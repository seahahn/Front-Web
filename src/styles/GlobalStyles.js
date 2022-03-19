import React from "react";
import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${theme`colors.primary.500`};
    ${tw`antialiased`}
  }
`;

export default function GlobalStylesComponent() {
  return (
    <>
      <GlobalStyles />
      <CustomStyles />
    </>
  );
}
