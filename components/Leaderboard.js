import { useAuth } from "./Auth";
import { useQuery, gql } from "urql";
import styled from "styled-components";
import DisplayError from "./ErrorMessage";

const LEADERBOARD_QUERY = gql`
  query LEADERBOARD_QUERY($slug: String!) {
    entries(where: { tournament: { slug: { equals: $slug } } }) {
      id
      user {
        name
        id
      }
      name
      active
      prediction {
        predictedMatch {
          winner {
            id
          }
        }
        predictedTeam {
          id
        }
      }
    }
  }
`;

const LeaderboardWrapper = styled.div``;

const RankingsWrapper = styled.div``;

const RankingsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding-left: 1rem;
  border-bottom: 1px solid var(--gray-500);
`;

const HeaderRow = styled(RankingsRow)`
  --header-color: var(--gray-300);
  border-top: 1px solid var(--header-color);
  border-bottom: 1px solid var(--header-color);
`;

// TODO: In the future, this should be generated from the database.
export default function Leaderboard({ tournamentSlug }) {
  const [
    {
      data: leaderboardData,
      fetching: leaderboardLoading,
      error: leaderboardError,
    },
  ] = useQuery({
    query: LEADERBOARD_QUERY,
    variables: { slug: tournamentSlug },
  });

  const auth = useAuth();
  if (leaderboardLoading || !auth.ready) return <p>Loading...</p>;
  if (leaderboardError) return <DisplayError error={updateEntryError} />;
  if (leaderboardData.entries.length === 0) return <p>No entries</p>;
  // Generate leaderboard rankings from data.
  const leaderboard = leaderboardData.entries
    .map((entry) => {
      const { prediction, active, user, name, id } = entry;
      const correctPredictions = prediction.reduce((acc, p) => {
        const { predictedMatch, predictedTeam } = p;
        const { winner } = predictedMatch;
        const { id: teamId } = predictedTeam;
        const winnerId = winner?.id || null;
        if (winnerId === teamId) {
          return acc + 1;
        }
        return acc;
      }, 0);
      return { correctPredictions, active, user, name, id };
    })
    .sort((a, b) => b.correctPredictions - a.correctPredictions);

  return (
    <LeaderboardWrapper>
      <h1>Leaderboard</h1>
      <RankingsWrapper>
        <HeaderRow>
          <strong>Entry</strong>
          <strong>User</strong>
          <strong>Wins</strong>
          <strong>Active</strong>
        </HeaderRow>
        {leaderboard.map((entry) => {
          const { name, id, correctPredictions, user } = entry;
          return (
            <RankingsRow key={id}>
              <div>{name}</div>
              <div>{user.name}</div>
              <div style={{ display: "grid", alignItems: "center" }}>
                {correctPredictions}
              </div>
              <div>{entry.active ? "Y" : "N"}</div>
            </RankingsRow>
          );
        })}
      </RankingsWrapper>
    </LeaderboardWrapper>
  );
}
