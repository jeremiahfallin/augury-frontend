import styled from "styled-components";
import { useQuery, gql } from "urql";
import Link from "next/link";
import DisplayError from "./ErrorMessage";
import { useAuth } from "./Auth";

const ALL_ENTRIES_QUERY = gql`
  query ALL_ENTRIES_QUERY($userId: ID!) {
    entries(where: { user: { id: { equals: $userId } } }) {
      id
      name
      tournament {
        id
        name
        slug
      }
    }
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const EntriesWrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(auto, minmax(100px, auto));
`;

export default function Entries() {
  const auth = useAuth();
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: ALL_ENTRIES_QUERY,
    variables: { userId: auth?.sessionData?.id },
  });

  if (fetching || !auth.ready) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { entries } = data;
  // filter out each tournament name so that entries can be separated by tourney.
  const tournaments = entries
    .map((entry) => entry.tournament.name)
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <Wrapper>
      {entries.length === 0 && "You haven't entered anything!!"}
      {tournaments.map((tournament) => {
        return (
          <section key={tournament}>
            <h2>{tournament}</h2>
            <EntriesWrapper>
              {entries
                .filter((entry) => entry.tournament.name === tournament)
                .map((entry, i) => {
                  return (
                    <Link
                      type="button"
                      key={entry.id}
                      href={`/tournament/${entry.tournament.slug}/entry/${entry.id}`}
                    >
                      {entry.name}
                    </Link>
                  );
                })}
            </EntriesWrapper>
          </section>
        );
      })}
    </Wrapper>
  );
}
