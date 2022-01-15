import SingleTournament from "../../components/SingleTournament";

export default function SingleTournamentPage({ query }) {
  return <SingleTournament slug={query.slug} />;
}
