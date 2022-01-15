import Entries from "./Entries";
import Tournaments from "./Tournaments";
import { useAuth } from "./Auth";

export default function Home() {
  const auth = useAuth();
  if (!auth.ready) return null;
  if (!!auth.sessionData) return <Entries />;
  return <Tournaments />;
}
