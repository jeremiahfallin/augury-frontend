import styled from "styled-components";
import Countdown from "./Countdown";

const DetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
`;

export default function MatchSet({ lockInTime, locked, children }) {
  return (
    <div style={{ userSelect: "none" }}>
      <DetailsWrapper>
        <Countdown lockInTime={lockInTime} />
        {locked && <p>Locked</p>}
      </DetailsWrapper>
      <div style={{ display: "grid", gridRowGap: "10px" }}>{children}</div>
    </div>
  );
}
