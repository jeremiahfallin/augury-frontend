import styled, { createGlobalStyle } from "styled-components";
import Header from "./Header";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Nanum Gothic';
    src: url('/static/NanumGothic-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "Sriracha";
    src: url("/static/Sriracha-Regular.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "Zen Kurenaido";
    src: url("/static/ZenKurenaido-Regular.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
  }
  html {
    --primary: hsl(168, 99%, 18%);
    --secondary: hsl(348deg, 99%, 18%);
    --green-100: hsl(152, 100%, 8%);
    --green-200: hsl(152, 100%, 16%);
    --green-300: hsl(152, 100%, 25%);
    --green-400: hsl(152, 50%, 50%);
    --green-500: hsl(152, 50%, 64%);
    --green-900: hsl(152, 50%, 94%);
    --logo: hsl(168, 99%, 18%);
    --black: hsl(0 0% 22%);
    --gray-100: hsl(0, 0%, 10%);
    --gray-200: hsl(0, 0%, 25%);
    --gray-300: hsl(0, 0%, 46%);
    --gray-300: hsl(0, 0%, 64%);
    --gray-400: hsl(0, 0%, 83%);
    --gray-500: hsl(0, 0%, 96%);
    --offWhite: #ededed;
    --maxWidth: 1000px;
    --bs: 0 12px 24px 0 rgba(0, 0, 0, 0.09);
    box-sizing: border-box;
    font-size: 62.5%;
  }
  body {
    font-family: 'Lora', --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
}
a {
    text-decoration: none;
    color: var(--black);
}
a:hover {
    text-decoration: underline;
}
button {
    font-family: 'Lora', --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

*, *:before, *:after {
    box-sizing: inherit;
}
label {
  padding: 0;
  margin: 0;
}
`;

const Wrapper = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 2rem;
`;

export default function Page({ children }) {
  return (
    <>
      <GlobalStyles />
      <Header />
      <Wrapper>{children}</Wrapper>
    </>
  );
}
