import Team from "./Team";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  grid-column-gap: 10px;
  height: 56px;

  @keyframes blink {
    0% {
      background: var(${(p) => p.color});
    }
    50% {
      background: var(--secondary);
    }
    100% {
      background: var(${(p) => p.color});
    }
  }

  .highlighted {
    animation: blink 500ms ease-in;
    animation-iteration-count: 1;
  }
`;

export default function Match({
  matchSetId,
  match,
  maxTeamUses,
  inputs,
  handleChange,
  predictionsCount,
  lockInTime,
  highlighted,
  locked,
}) {
  const winner = match.winner;
  return (
    <Wrapper key={match.id}>
      <Team
        team={match.blue}
        predictedPercentage={
          (100 * match.bluePredictionsInMatch) / predictionsCount
        }
        value={match.blue.id}
        checked={
          match.blue.id === inputs?.[matchSetId]?.predictedTeamId &&
          match.id === inputs?.[matchSetId]?.matchId
        }
        highlighted={highlighted}
        winner={winner}
        onChange={(e) => {
          if (new Date(lockInTime).valueOf() - new Date().valueOf() > 0) {
            return handleChange({
              e,
              matchSetId,
              predictedTeamId: match.blue.id,
              matchId: match.id,
              maxTeamUses,
            });
          }
          return null;
        }}
      />
      <div style={{ display: "grid", justifySelf: "center" }}>vs.</div>
      <Team
        team={match.red}
        predictedPercentage={
          (100 * match.redPredictionsInMatch) / predictionsCount
        }
        value={match.red.id}
        checked={
          match.red.id === inputs?.[matchSetId]?.predictedTeamId &&
          match.id === inputs?.[matchSetId]?.matchId
        }
        highlighted={highlighted}
        winner={winner}
        onChange={(e) => {
          if (!locked) {
            return handleChange({
              e,
              matchSetId,
              predictedTeamId: match.red.id,
              matchId: match.id,
              maxTeamUses,
            });
          }
          return null;
        }}
      />
    </Wrapper>
  );
}
