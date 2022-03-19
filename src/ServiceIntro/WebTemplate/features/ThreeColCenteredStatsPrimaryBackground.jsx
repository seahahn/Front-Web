import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "ServiceIntro/WebTemplate/misc/Headings";
import { Container as ContainerBase, ContentWithPaddingXl } from "ServiceIntro/WebTemplate/misc/Layouts";
import { SectionDescription } from "ServiceIntro/WebTemplate/misc/Typography";

const Container = tw(ContainerBase)`my-8 lg:my-10 bg-primary-900 text-gray-100 -mx-8 px-8`;
const HeadingContainer = tw.div``;
const Heading = tw(SectionHeading)`sm:text-3xl md:text-4xl lg:text-5xl`;
const Subheading = tw(SubheadingBase)`text-gray-100 text-center`;
const Description = tw(SectionDescription)`text-gray-400 text-center mx-auto whitespace-pre-line max-w-screen-md`;

const StatsContainer = tw.div`mt-8 flex flex-col sm:flex-row items-center justify-center flex-wrap max-w-screen-md justify-between mx-auto`;
const Stat = tw.div`flex flex-col text-center p-4 tracking-wide`;
const StatKey = tw.div`text-xl font-medium`;
const StatValue = tw.div`text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-black`;

const ThreeColCenteredStatsPrimaryBackground = ({
  props = {
    subheading: "",
    heading: "Over 9000 Projects Completed",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    stats: [
      {
        key: "Clients",
        value: "2500+",
      },
      {
        key: "Revenue",
        value: "$100M+",
      },
      {
        key: "Employees",
        value: "150+",
      },
    ],
  },
}) => {
  return (
    <Container>
      <ContentWithPaddingXl>
        <HeadingContainer>
          {props.subheading && <Subheading>{props.subheading}</Subheading>}
          <Heading>{props.heading}</Heading>
          {props.description && <Description>{props.description}</Description>}
        </HeadingContainer>
        <StatsContainer>
          {props.stats.map((stat, index) => (
            <Stat key={index}>
              <StatValue>{stat.value}</StatValue>
              <StatKey>{stat.key}</StatKey>
            </Stat>
          ))}
        </StatsContainer>
      </ContentWithPaddingXl>
    </Container>
  );
};

export default ThreeColCenteredStatsPrimaryBackground;
