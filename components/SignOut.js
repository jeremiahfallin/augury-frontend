import { useAuth } from "./Auth";

export default function SignOut() {
  const auth = useAuth();

  return (
    <button
      type="button"
      style={{ color: "var(--black)" }}
      onClick={async () => {
        auth.signOut();
      }}
    >
      Sign Out
    </button>
  );
}
