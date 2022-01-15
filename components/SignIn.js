import { gql, useMutation } from "urql";
import Form from "./styles/Form";
import useForm from "../lib/useForm";
import Error from "./ErrorMessage";
import { useAuth } from "../components/Auth";

export default function SignIn() {
  const auth = useAuth();
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });
  const error =
    auth?.data?.authenticateUserWithPassword.__typename ===
    "UserAuthenticationWithPasswordFailure"
      ? data?.authenticateUserWithPassword
      : undefined;

  const signIn = async () => {
    if (!auth.ready) {
      return;
    }
    if (!inputs.email.length || !inputs.password.length) {
      return;
    }
    const result = await auth.signIn({
      email: inputs.email,
      password: inputs.password,
    });
    if (result.success) {
      // FIXME: there's a cache issue with Urql where it's not reloading the
      // current user properly if we do a client-side redirect here.
      // router.push('/');

      top.location.href = "/";
    }
  };

  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        // send email and password to server
        signIn();
        resetForm();
      }}
    >
      <h2>Sign In to Your Account</h2>
      <Error error={error} />
      <fieldset disabled={!auth.ready} aria-busy={!auth.ready}>
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
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
