import SingleEntry from "../../../../components/SingleEntry";

export default function SingleEntryInTournamentPage({ query }) {
  return <SingleEntry tournamentSlug={query.slug} id={query.id} />;
}
