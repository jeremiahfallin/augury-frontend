import Link from "next/link";
import styled from "styled-components";
import Nav from "./Nav";

const Logo = styled.h1`
  font-family: "Zen Kurenaido";
  position: relative;
  font-size: 4rem;
  background: var(--logo);
  margin: 0;
  z-index: 2;
  background: linear-gradient(
    45deg,
    hsl(152, 100%, 16%, 0.5) 0px,
    hsl(152, 100%, 16%, 0.5) 0px 18%,
    hsl(152, 100%, 16%, 0.7) 18%,
    hsl(152, 100%, 16%, 0.7) 28%,
    hsl(152, 100%, 16%, 1) 28%,
    hsl(152, 100%, 16%, 1) 77%,
    hsl(152, 100%, 16%, 0.8) 77%,
    hsl(152, 100%, 16%, 0.8) 87%,
    hsl(152, 100%, 16%, 0.6) 87%,
    hsl(152, 100%, 16%, 0.6) 100%
  );
  a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
`;

const HeaderWrapper = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid var(--black, black);
  }
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <div className="bar">
        <Logo>
          <Link href="/">Augury</Link>
        </Logo>
        <Nav />
      </div>
      <div className="sub-bar" />
    </HeaderWrapper>
  );
}
