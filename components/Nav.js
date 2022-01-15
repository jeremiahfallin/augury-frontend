import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import { useAuth } from "./Auth";
import SignOut from "./SignOut";

export default function Nav() {
  const auth = useAuth();

  if (!auth.ready) return null;
  return (
    <NavStyles>
      <Link href="/tournaments">Tournaments</Link>
      {auth?.sessionData && (
        <>
          <Link href="/entries">Entries</Link>
          <SignOut />
        </>
      )}
      {!auth?.sessionData && <Link href="/signin">Sign In</Link>}
    </NavStyles>
  );
}
