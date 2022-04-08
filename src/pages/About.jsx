import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import AnimationRevealPage from "Components/ServiceIntro/WebTemplate/helpers/AnimationRevealPage";
import { Container, ContentWithPaddingXl } from "Components/ServiceIntro/WebTemplate/misc/Layouts";
import { SectionHeading, Subheading as SubheadingBase } from "Components/ServiceIntro/WebTemplate/misc/Headings";
import { SectionDescription } from "Components/ServiceIntro/WebTemplate/misc/Typography";
import { ReactComponent as FacebookIcon } from "Components/ServiceIntro/WebTemplate/images/facebook-icon.svg";
import { ReactComponent as LinkedinIcon } from "Components/ServiceIntro/WebTemplate/images/linkedin-icon.svg";
import { ReactComponent as GithubIcon } from "Components/ServiceIntro/WebTemplate/images/github-icon.svg";

const HeadingContainer = tw.div``;
const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;
const Description = tw(SectionDescription)`mx-auto text-center`;

const Cards = tw.div`flex flex-wrap flex-row justify-center sm:max-w-2xl lg:max-w-5xl mx-auto`;
const Card = tw.div`mt-24 w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center`;
const CardImage = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`w-64 h-64 bg-cover bg-center rounded`}
`;
const CardContent = styled.div`
  ${tw`flex flex-col items-center mt-6`}
  .position {
    ${tw`uppercase font-bold tracking-widest text-xs text-primary-500`}
  }
  .name {
    ${tw`mt-1 text-xl font-medium text-gray-300`}
  9
`;

const CardLinks = styled.div`
  ${tw`mt-6 flex`}
  .link {
    ${tw`mr-8 last:mr-0 text-gray-300 hocus:text-primary-500 transition duration-300`}
    .icon {
      ${tw`fill-current w-6 h-6`}
    }
  }
`;

const About = ({
  heading = "AI Play Team Members",
  subheading = "Our Team",
  description = "AI Play를 만들어 가는 팀원들을 소개합니다!",
  cards = [
    {
      imageSrc:
        "https://scontent-ssn1-1.xx.fbcdn.net/v/t1.6435-9/67878360_2421242878111706_5348573037711065088_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=dmKMJQNy2IQAX9n8clp&_nc_ht=scontent-ssn1-1.xx&oh=00_AT9samEfljSWaewFMKFaM1IAGw_o_Vxgm9KEVAhuXx-niw&oe=6266D52A",
      position: "Planner, FullStack Developer",
      name: "안경호",
      links: [
        {
          url: "https://www.facebook.com/seah.ahn.nt",
          icon: FacebookIcon,
        },
        {
          url: "https://www.linkedin.com/in/gyeong-ho-ahn-2a949116b/",
          icon: LinkedinIcon,
        },
        {
          url: "https://github.com/seahahn",
          icon: GithubIcon,
        },
      ],
    },
    {
      imageSrc: "https://user-images.githubusercontent.com/73585246/160568548-35932007-a87b-4d68-98ab-e4e5a6291433.jpg",
      position: "Backend Developer",
      name: "이경희",
      links: [
        // {
        //   url: "https://twitter.com",
        //   icon: TwitterIcon,
        // },
        {
          url: "https://www.linkedin.com/in/kyounghuilee/",
          icon: LinkedinIcon,
        },
        {
          url: "https://github.com/KayyoungHL",
          icon: GithubIcon,
        },
      ],
    },
    {
      imageSrc: "https://user-images.githubusercontent.com/73585246/160568565-d4e996a5-f668-4f3d-baf7-17c77b51fe24.png",
      position: "Backend Developer",
      name: "김민석",
      links: [
        // {
        //   url: "https://twitter.com",
        //   icon: TwitterIcon,
        // },
        // {
        //   url: "https://linkedin.com",
        //   icon: LinkedinIcon,
        // },
        {
          url: "https://github.com/Library-of-jade",
          icon: GithubIcon,
        },
      ],
    },
  ],
}) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimationRevealPage>
      <Container>
        <ContentWithPaddingXl>
          <HeadingContainer>
            {subheading && <Subheading>{subheading}</Subheading>}
            {heading && <Heading>{heading}</Heading>}
            {description && <Description>{description}</Description>}
          </HeadingContainer>
          <Cards>
            {cards.map((card, index) => (
              <Card key={index}>
                <CardImage imageSrc={card.imageSrc} />
                <CardContent>
                  <span className="position">{card.position}</span>
                  <span className="name">{card.name}</span>
                  <CardLinks>
                    {card.links.map((link, linkIndex) => (
                      <a key={linkIndex} className="link" href={link.url}>
                        <link.icon className="icon" />
                      </a>
                    ))}
                  </CardLinks>
                </CardContent>
              </Card>
            ))}
          </Cards>
        </ContentWithPaddingXl>
      </Container>
    </AnimationRevealPage>
  );
};

export default About;
