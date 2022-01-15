import Leaderboard from "../../../components/Leaderboard";

export default function LeaderboardPage({ query }) {
  return <Leaderboard tournamentSlug={query.slug} />;
}
