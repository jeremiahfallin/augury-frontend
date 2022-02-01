import Head from "next/head";
import Link from "next/link";
import { useQuery, useMutation, gql } from "urql";
import DisplayError from "./ErrorMessage";
import { useAuth } from "./Auth";
import usePredictionForm from "../lib/usePredictionForm";
import Form from "./styles/Form";
import MatchSet from "./MatchSet";
import Match from "./Match";

const SINGLE_ENTRY_QUERY = gql`
  query SINGLE_ENTRY_QUERY($id: ID!) {
    entry(where: { id: $id }) {
      id
      user {
        name
      }
      prediction {
        id
        matchSet {
          id
        }
        predictedTeam {
          id
          name
        }
        predictedMatch {
          id
          blue {
            id
            name
          }
          red {
            id
            name
          }
        }
      }
      tournament {
        id
        name
        maxTeamUses
        slug
        matchSet {
          id
          lockInTime
          predictionsCount
          match {
            id
            redPredictionsInMatch
            red {
              id
              name
              photo {
                image {
                  publicUrl
                  publicUrlTransformed
                }
                altText
              }
            }
            bluePredictionsInMatch
            blue {
              id
              name
              photo {
                image {
                  publicUrl
                  publicUrlTransformed
                }
                altText
              }
            }
            winner {
              id
            }
          }
        }
      }
    }
  }
`;

const ENTER_PREDICTIONS_MUTATION = gql`
  mutation Mutation($entryId: ID!, $predictions: [PredictionInput]) {
    enterPredictions(entryId: $entryId, predictions: $predictions) {
      id
    }
  }
`;

export default function SingleEntry({ id }) {
  const auth = useAuth();

  const [{ data: entryData, fetching: entryLoading, error: entryError }] =
    useQuery({ query: SINGLE_ENTRY_QUERY, variables: { id } });

  const entry = entryData?.entry;

  const [
    { error: updateEntryError, fetching: updateEntryLoading },
    enterEntryPredictions,
  ] = useMutation(ENTER_PREDICTIONS_MUTATION);

  // Stores the current entry in the form state
  // from the initial graphql query.
  const { inputs, handleChange, highlighted } = usePredictionForm(
    entry?.prediction
      ? Object.assign(
          {},
          ...entry?.prediction.map((prediction) => ({
            [prediction.matchSet.id]: {
              predictedTeamId: prediction.predictedTeam.id,
              matchId: prediction.predictedMatch.id,
              predictionId: prediction.id,
            },
          }))
        )
      : {}
  );
  if (entryLoading || !auth.ready) return <p>Loading...</p>;
  if (entryError) return <DisplayError error={updateEntryError} />;

  return (
    <>
      <h1>Entry for {entry.tournament.name}</h1>
      <Link href={`/tournament/${entry.tournament.slug}/leaderboard`}>
        Leaderboard
      </Link>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const predictions = Object.values(inputs).map((input) => {
            return { teamId: input.predictedTeamId, matchId: input.matchId };
          });
          await enterEntryPredictions({
            entryId: id,
            predictions,
          });
        }}
      >
        <Head>
          <title>
            Augury | {entry.user.name}&apos;s Entry for {entry.tournament.name}
          </title>
        </Head>
        Each team can be used {entry.tournament.maxTeamUses} times.
        <fieldset disabled={updateEntryLoading} aria-busy={updateEntryLoading}>
          <div style={{ paddingBottom: "20px" }}>
            {entry.tournament.matchSet.map((matchSet, i) => {
              const locked =
                new Date(matchSet.lockInTime).valueOf() - new Date().valueOf() <
                0;
              return (
                <MatchSet
                  key={matchSet.id}
                  lockInTime={matchSet.lockInTime}
                  set={i}
                  locked={locked}
                >
                  {matchSet.match.map((match) => (
                    <Match
                      key={match.id}
                      matchSetId={matchSet.id}
                      predictionsCount={matchSet.predictionsCount}
                      lockInTime={matchSet.lockInTime}
                      maxTeamUses={entry.tournament.maxTeamUses}
                      {...{
                        match,
                        inputs,
                        handleChange,
                        highlighted,
                        locked,
                      }}
                    />
                  ))}
                </MatchSet>
              );
            })}
          </div>
          <button type="submit">Update Prediction</button>
        </fieldset>
      </Form>
    </>
  );
}
