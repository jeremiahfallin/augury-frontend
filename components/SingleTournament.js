import { useRef } from "react";
import Head from "next/head";
import { gql, useQuery, useMutation } from "urql";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Button from "./styles/Button";
import { useAuth } from "../components/Auth";
import DisplayError from "./ErrorMessage";

const TournamentWrapper = styled.div`
  display: grid;
  grid-auto-columns: 1fr 1fr;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid white;
  padding: 2rem;

  a {
    font-weight: bold;
    font-size: 1.8rem;
    color: var(--secondary);
  }

  .bar {
    height: 5px;
    border: 0;
    margin-bottom: 5px;
    margin-top: 5px;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: "";
      display: block;
      background-image: linear-gradient(
        to right,
        var(--primary) 0%,
        var(--secondary) 50%,
        var(--primary) 100%
      );
    }
  }
`;

const TeamsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 60px;
  justify-content: center;
  align-items: top;
  padding: 2rem;
`;

const TeamWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 50px auto;
  column-gap: 1.5rem;
  background-color: var(--gray-400);
  padding: 0.5rem 1rem;
  border-radius: 50px;
`;

const NewEntryButton = styled.button`
  border: none;
  background: var(--primary);
  color: white;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 2rem;
  padding: 0.8rem 1.5rem;
  display: inline-block;
  transition: all 0.5s;
  &[disabled] {
    opacity: 0.5;
  }
`;

const NewEntryWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SINGLE_TOURNAMENT_QUERY = gql`
  query SINGLE_TOURNAMENT_QUERY($slug: String!) {
    tournament(where: { slug: $slug }) {
      id
      name
      maxEntries
      entryCount(where: { tournament: { slug: { equals: $slug } } })
      match {
        red {
          name
          photo {
            image {
              publicUrlTransformed
            }
            altText
          }
        }
        blue {
          name
          photo {
            image {
              publicUrlTransformed
            }
            altText
          }
        }
      }
    }
  }
`;

const CREATE_ENTRY_MUTATION = gql`
  mutation CREATE_ENTRY_MUTATION(
    $userId: ID!
    $tournamentId: ID!
    $name: String!
  ) {
    createEntry(
      data: {
        user: { connect: { id: $userId } }
        tournament: { connect: { id: $tournamentId } }
        name: $name
      }
    ) {
      id
    }
  }
`;

export default function SingleTournament({ slug }) {
  const auth = useAuth();
  const newEntryName = useRef(null);

  const [
    {
      data: tournamentData,
      fetching: tournamentLoading,
      error: tournamentError,
    },
  ] = useQuery({
    query: SINGLE_TOURNAMENT_QUERY,
    variables: { slug },
  });

  const [
    { data: entryData, fetching: entryLoading, error: entryError },
    createEntry,
  ] = useMutation(CREATE_ENTRY_MUTATION);

  if (tournamentLoading) return <p>Loading...</p>;
  if (tournamentError)
    return <DisplayError error={tournamentError || entryError} />;

  const { tournament } = tournamentData;
  const teamData = tournament.match
    .map((match) => {
      return [
        { name: match.red.name, photo: match.red.photo },
        { name: match.blue.name, photo: match.blue.photo },
      ];
    })
    .flat()
    .filter((v, i, a) => a.map((e) => e.name).indexOf(v.name) === i);

  return (
    <TournamentWrapper>
      <Head>
        <title>League Eliminator | {tournament.name}</title>
      </Head>
      <div>
        <h2>{tournament.name}</h2>
        {auth?.sessionData && (
          <div>
            <h3>Entries:</h3>
            {auth?.sessionData?.entry?.filter(
              (entry) => entry.tournament.name === tournament.name
            ).length ? (
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridTemplateColumns: `repeat(${tournament.maxEntries}, 1fr)`,
                }}
              >
                {entryLoading && <p>Loading...</p>}
                {!entryLoading &&
                  auth?.sessionData?.entry
                    ?.filter(
                      (entry) => entry.tournament.name === tournament.name
                    )
                    .map((entry, i) => {
                      return (
                        <div key={entry.id}>
                          <Link
                            key={entry.id}
                            href={`/tournament/${slug}/entry/${entry.id}`}
                          >
                            {entry.name}
                          </Link>
                        </div>
                      );
                    })}
              </div>
            ) : null}
            {auth?.sessionData?.entry?.filter(
              (entry) => entry.tournament.name === tournament.name
            ).length < tournament.maxEntries && (
              <NewEntryWrapper>
                <input
                  type="text"
                  name="name"
                  onChange={(event) => {
                    newEntryName.current = event.target.value;
                  }}
                  placeholder="Team Name"
                />
                <NewEntryButton
                  type="button"
                  onClick={async () => {
                    await createEntry({
                      userId: auth.sessionData.id,
                      name: newEntryName.current,
                      tournamentId: tournament.id,
                    });
                  }}
                >
                  Create New Entry
                </NewEntryButton>
              </NewEntryWrapper>
            )}
          </div>
        )}
        <div className="bar gradient" />
        <TeamsWrapper>
          {teamData.map((team, i) => (
            <TeamWrapper key={i}>
              <Image
                src={team.photo.image.publicUrlTransformed}
                alt={team.photo.alt}
                height={50}
                width={50}
                layout="fixed"
              />
              <div
                style={{
                  display: "grid",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                {team.name}
              </div>
            </TeamWrapper>
          ))}
        </TeamsWrapper>
      </div>
    </TournamentWrapper>
  );
}
