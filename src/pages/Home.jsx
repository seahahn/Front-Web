import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import AnimationRevealPage from "ServiceIntro/Templates/helpers/AnimationRevealPage";

import Hero from "ServiceIntro/Templates/hero/TwoColumnWithFeaturesAndTestimonial";
import Features from "ServiceIntro/Templates/features/ThreeColWithSideImage";
import MainFeature from "ServiceIntro/Templates/features/TwoColWithTwoHorizontalFeaturesAndButton";
import FeatureStats from "ServiceIntro/Templates/features/ThreeColCenteredStatsPrimaryBackground";
import Pricing from "ServiceIntro/Templates/pricing/TwoPlansWithDurationSwitcher";
import Testimonial from "ServiceIntro/Templates/testimonials/TwoColumnWithImageAndRating";
import FAQ from "ServiceIntro/Templates/faqs/SingleCol";
import GetStarted from "ServiceIntro/Templates/cta/GetStartedLight";

const HighlightedText = styled.span`text-teal-300`;

function Home() {
  return (
    <AnimationRevealPage>
      <Hero />
      <FeatureStats />
      <Features
        heading={
          <>
            Amazing <HighlightedText>Features</HighlightedText>
          </>
        }
      />
      <MainFeature
        heading={
          <>
            Cloud built by and for <HighlightedText>Professionals</HighlightedText>
          </>
        }
      />
      <Testimonial
        heading={
          <>
            Our Clients <HighlightedText>Love Us</HighlightedText>
          </>
        }
      />
      <Pricing
        heading={
          <>
            Flexible <HighlightedText>Plans</HighlightedText>
          </>
        }
      />
      <FAQ
        heading={
          <>
            Any <HighlightedText>Questions ?</HighlightedText>
          </>
        }
      />
      <GetStarted />
    </AnimationRevealPage>
  );
}

export default Home;
