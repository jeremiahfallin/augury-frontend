import { createContext, useRef, useMemo, useEffect, useContext } from "react";
import { gql, useQuery, useMutation } from "urql";

const AuthContext = createContext({
  ready: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const wasReady = useRef(false);
  const mutationContext = useMemo(
    () => ({ additionalTypenames: ["User"] }),
    []
  );

  const [{ fetching, data: sessionData, error: sessionError }] = useQuery({
    query: gql`
      query {
        authenticatedItem {
          ... on User {
            id
            email
            name
            entry {
              id
              name
              tournament {
                id
                name
              }
              prediction {
                predictedTeam {
                  id
                  name
                }
                predictedMatch {
                  id
                  blue {
                    id
                    name
                  }
                  red {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  const [, authenticate] = useMutation(gql`
    mutation ($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
          item {
            id
          }
        }
        ... on UserAuthenticationWithPasswordFailure {
          message
        }
      }
    }
  `);

  const signIn = async ({ email, password }) => {
    const result = await authenticate({ email, password }, mutationContext);
    const { data, error } = result;
    if (
      data?.authenticateUserWithPassword?.__typename ===
      "UserAuthenticationWithPasswordSuccess"
    ) {
      return { success: true };
    } else if (
      data?.authenticateUserWithPassword?.__typename ===
      "UserAuthenticationWithPasswordFailure"
    ) {
      return {
        success: false,
        message: data.authenticateUserWithPassword?.message,
      };
    }
    if (error) {
      return { success: false, message: error.toString() };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  };

  const [{ fetching: signOutLoading }, signOutMutation] = useMutation(gql`
    mutation {
      endSession
    }
  `);

  const signOut = () => {
    signOutMutation(undefined, mutationContext);
  };

  useEffect(() => {
    if (!wasReady.current && !fetching && !sessionError) {
      wasReady.current = true;
    }
  });

  return (
    <AuthContext.Provider
      value={{
        ready: wasReady.current || !fetching || signOutLoading,
        sessionData: sessionData?.authenticatedItem,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
