import { gql, useMutation } from "urql";
import Form from "./styles/Form";
import useForm from "../lib/useForm";
import Error from "./ErrorMessage";

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });
  const [{ data, fetching, error }, signup] = useMutation(SIGN_UP_MUTATION);

  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        // send email and password to server
        await signup(inputs).catch(console.error);
        resetForm();
      }}
    >
      <h2>Sign Up for an Account</h2>
      <Error error={error} />
      <fieldset disabled={fetching} aria-busy={fetching}>
        {data?.createUser && (
          <p>
            Signed up with {data.createUser.email} - Please go ahead and sign
            in!
          </p>
        )}
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
