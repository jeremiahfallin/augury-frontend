import gql from "graphql-tag";
import { useMutation } from "urql";
import Form from "./styles/Form";
import useForm from "../lib/useForm";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation SIGN_UP_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
  });
  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetch currently logged in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        // send email and password to server
        await signup().catch(console.error);
        resetForm();
      }}
    >
      <h2>Request a Password Reset</h2>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset!</button>
      </fieldset>
    </Form>
  );
}
