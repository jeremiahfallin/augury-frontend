import gql from "graphql-tag";
import { useMutation } from "urql";
import Form from "./styles/Form";
import useForm from "../lib/useForm";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation SIGN_UP_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email)
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
  });
  const [{ data, fetching, error }, resetPassword] = useMutation(
    REQUEST_RESET_MUTATION
  );

  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        // send email and password to server
        await resetPassword({ email: inputs.email }).catch(console.error);
        resetForm();
      }}
    >
      <h2>Request a Password Reset</h2>
      <Error error={error} />
      <fieldset disabled={fetching} aria-busy={fetching}>
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
