import styled from "styled-components";
import { useQuery, gql } from "urql";
import Link from "next/link";
import DisplayError from "./ErrorMessage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ALL_TOURNAMENTS_QUERY = gql`
  query ALL_TOURNAMENTS_QUERY {
    tournaments {
      id
      name
      slug
    }
  }
`;

export default function Tournaments() {
  const [{ data, fetching, error }] = useQuery({
    query: ALL_TOURNAMENTS_QUERY,
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { tournaments } = data;
  return (
    <Wrapper>
      {tournaments.length === 0 ? "No Active Tournaments!" : null}
      {tournaments.map((tournament) => (
        <div
          key={tournament.slug}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>
            <Link href={`/tournament/${tournament.slug}`}>
              {tournament.name}
            </Link>
          </div>
          <div style={{ fontSize: "2rem" }}>
            {" - "}
            <Link href={`/tournament/${tournament.slug}/leaderboard`}>
              Leaderboard
            </Link>
          </div>
        </div>
      ))}
    </Wrapper>
  );
}
