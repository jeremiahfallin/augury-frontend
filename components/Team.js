import Image from "next/image";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  width: 100%;
  background: var(${(p) => p.color});
  border-radius: 9999px;
  height: 100%;

  input[type="radio"] {
    display: none;
  }
  label {
    padding: 0;
    margin: 0;
  }
`;

const Percentage = styled.div`
  font-size: 1.2rem;
`;

const TeamInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MatchResultWrapper = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.3) 0px,
    rgba(0, 0, 0, 0.3) 18%,
    rgba(0, 0, 0, 0.4) 18%,
    rgba(0, 0, 0, 0.4) 28%,
    rgba(0, 0, 0, 0.6) 28%,
    rgba(0, 0, 0, 0.6) 77%,
    rgba(0, 0, 0, 0.4) 77%,
    rgba(0, 0, 0, 0.4) 87%,
    rgba(0, 0, 0, 0.3) 87%,
    rgba(0, 0, 0, 0.3) 100%
  );
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
  width: 100px;
  height: 100%;
  color: var(--offWhite);
  font-size: 3rem;
`;

const ImageWrapper = styled.div`
  display: grid;
  justify-items: center;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5) 0px,
    rgba(255, 255, 255, 0.5) 18%,
    rgba(255, 255, 255, 0.3) 18%,
    rgba(255, 255, 255, 0.3) 28%,
    rgba(0, 0, 0, 0.6) 28%,
    rgba(0, 0, 0, 0.6) 77%,
    rgba(0, 0, 0, 0.3) 77%,
    rgba(0, 0, 0, 0.3) 87%,
    rgba(0, 0, 0, 0.4) 87%,
    rgba(0, 0, 0, 0.4) 100%
  );
  border-top-left-radius: 9999px;
  border-bottom-left-radius: 9999px;
  width: 100px;
`;

export default function Team({
  team,
  predictedPercentage,
  checked,
  highlighted,
  winner,
  value,
  onChange,
}) {
  return (
    <Wrapper
      color={checked ? "--green-500" : "--gray-400"}
      className={checked && team.id === highlighted ? "highlighted" : ""}
      onClick={onChange}
    >
      <input
        type="radio"
        id="prediction"
        name="prediction"
        {...{ value, checked, onChange }}
      />
      <ImageWrapper>
        <Image
          src={team.photo.image.publicUrlTransformed}
          alt={team.photo.alt}
          height={56}
          width={56}
          layout="fixed"
        />
      </ImageWrapper>
      <TeamInfoWrapper>
        <label htmlFor={team.name}>{team.name}</label>
        <Percentage>{predictedPercentage.toFixed(1)}% picked</Percentage>
      </TeamInfoWrapper>
      <MatchResultWrapper>
        {winner === null ? "-" : winner?.id === team.id ? "W" : "L"}
      </MatchResultWrapper>
    </Wrapper>
  );
}
