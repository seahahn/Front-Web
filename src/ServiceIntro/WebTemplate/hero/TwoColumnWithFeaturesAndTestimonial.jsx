import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, { NavLinks, NavLink, PrimaryLink } from "ServiceIntro/WebTemplate/headers/light";
import { SectionHeading } from "ServiceIntro/WebTemplate/misc/Headings";
import { SectionDescription } from "ServiceIntro/WebTemplate/misc/Typography";
import { PrimaryButton as PrimaryButtonBase } from "ServiceIntro/WebTemplate/misc/Buttons";
import { Container, ContentWithVerticalPadding } from "ServiceIntro/WebTemplate/misc/Layouts";
import { ReactComponent as CheckboxIcon } from "feather-icons/dist/icons/check-circle.svg";
import { ReactComponent as QuotesLeftIconBase } from "ServiceIntro/WebTemplate/images/quotes-l.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "ServiceIntro/WebTemplate/images/dot-pattern.svg";
import { AppContext } from "App";

const Header = tw(HeaderBase)`max-w-none`;
const Row = tw.div`flex flex-col lg:flex-row justify-between items-center lg:py-16 max-w-screen-2xl mx-auto sm:px-8`;
const Column = tw.div``;
const TextColumn = tw(Column)`mr-auto lg:mr-0 max-w-lg lg:max-w-xl xl:max-w-2xl`;
const Heading = tw(SectionHeading)`text-left text-primary-700 whitespace-pre-line leading-snug xl:text-6xl`;
const Description = tw(SectionDescription)`mt-4 lg:text-base text-gray-100 whitespace-pre-line max-w-lg`;
const PrimaryButton = tw(PrimaryButtonBase)`mt-8 inline-block w-56 tracking-wide text-center py-5`;
const FeatureList = tw.ul`mt-12 leading-loose`;
const Feature = tw.li`flex items-center`;
const FeatureIcon = tw(CheckboxIcon)`w-5 h-5 text-primary-300`;
const FeatureText = tw.p`ml-2 font-medium text-gray-300`;
const ImageColumn = tw(Column)`ml-auto lg:mr-0 relative mt-16 lg:mt-0 lg:ml-32`;
const ImageContainer = tw.div`relative z-40 transform xl:-translate-x-24 xl:-translate-y-16`;
const Image = tw.img`max-w-full w-96 rounded-lg relative z-20`;
const Offsetbackground = tw.div`absolute inset-0 bg-gray-700 rounded xl:-mb-8`;
const ImageDecoratorBlob = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none z-10 absolute right-0 bottom-0 transform translate-x-10 translate-y-10 h-32 w-32 opacity-25 text-gray-100 fill-current`}
`;
const Testimonial = tw.div`max-w-sm rounded-lg relative sm:absolute bottom-0 inset-x-0 z-20 px-8 py-6 sm:px-10 sm:py-8 bg-primary-900 text-gray-600 font-medium transform sm:translate-y-0 lg:translate-y-16 md:-translate-x-32 text-sm leading-relaxed md:-mr-16 xl:mr-0`;
const QuotesLeftIcon = tw(
  QuotesLeftIconBase
)`w-16 h-16 md:w-12 md:h-12 absolute top-0 left-0 text-gray-900 md:text-red-500 transform translate-x-1 md:-translate-x-1/2 md:-translate-y-5 opacity-10 md:opacity-100`;
const Quote = tw.blockquote`text-gray-300 whitespace-pre-line`;
const CustomerName = tw.p`mt-4 font-bold text-gray-200`;
const CustomerCompany = tw.p`mt-1 text-sm text-gray-500`;

const TwoColumnWithFeaturesAndTestimonial = ({
  props = {
    heading: "Better, Faster and Cheaper Cloud.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    imageSrc:
      "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=510&q=80",
    imageDecoratorBlob: true,
    primaryButtonUrl: "www.google.com",
    primaryButtonText: "Get Started",
    buttonRounded: true,
    features: ["Available in 7 Locations", "Premium Internet Backbone", "99.99% Uptime SLA"],
    testimonial: {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      customerName: "Charlotte Hale",
      customerCompany: "Delos Inc.",
    },
  },
}) => {
  const { setIsSignInOpenFromHome } = React.useContext(AppContext);

  const buttonRoundedCss = props.buttonRounded && tw`rounded-full`;
  // const navLinks = [
  //   <NavLinks key={1}>
  //     <NavLink href="/#">About</NavLink>
  //     <NavLink href="/#">Blog</NavLink>
  //     <NavLink href="/#">Pricing</NavLink>
  //     <NavLink href="/#">Contact Us</NavLink>
  //     <NavLink href="/#">Testimonials</NavLink>
  //   </NavLinks>,
  //   <NavLinks key={2}>
  //     <NavLink href="/#" tw="lg:ml-12!">
  //       Login
  //     </NavLink>
  //     <PrimaryLink css={buttonRoundedCss} href="/#">
  //       Sign Up
  //     </PrimaryLink>
  //   </NavLinks>,
  // ];
  return (
    <>
      {/* <Header links={navLinks} /> */}
      <Container>
        <ContentWithVerticalPadding>
          <Row>
            <TextColumn>
              <Heading>{props.heading}</Heading>
              <Description>{props.description}</Description>
              <PrimaryButton css={buttonRoundedCss} onClick={() => setIsSignInOpenFromHome(true)}>
                {props.primaryButtonText}
              </PrimaryButton>
              <FeatureList>
                {props.features.map((feature, index) => (
                  <Feature key={index}>
                    <FeatureIcon />
                    <FeatureText>{feature}</FeatureText>
                  </Feature>
                ))}
              </FeatureList>
            </TextColumn>
            <ImageColumn>
              <ImageContainer>
                <Image src={props.imageSrc} />
                {props.imageDecoratorBlob && <ImageDecoratorBlob />}
                <Testimonial>
                  <QuotesLeftIcon />
                  <Quote>{props.testimonial.quote}</Quote>
                  <CustomerName>{props.testimonial.customerName}</CustomerName>
                  <CustomerCompany>{props.testimonial.customerCompany}</CustomerCompany>
                </Testimonial>
              </ImageContainer>
              <Offsetbackground />
            </ImageColumn>
          </Row>
        </ContentWithVerticalPadding>
      </Container>
    </>
  );
};

export default TwoColumnWithFeaturesAndTestimonial;
