import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import AnimationRevealPage from "ServiceIntro/WebTemplate/helpers/AnimationRevealPage";

import Hero from "ServiceIntro/WebTemplate/hero/TwoColumnWithFeaturesAndTestimonial";
import Features from "ServiceIntro/WebTemplate/features/ThreeColWithSideImage";
import MainFeature from "ServiceIntro/WebTemplate/features/TwoColWithTwoHorizontalFeaturesAndButton";
import FeatureStats from "ServiceIntro/WebTemplate/features/ThreeColCenteredStatsPrimaryBackground";
import Pricing from "ServiceIntro/WebTemplate/pricing/TwoPlansWithDurationSwitcher";
import Testimonial from "ServiceIntro/WebTemplate/testimonials/TwoColumnWithImageAndRating";
import FAQ from "ServiceIntro/WebTemplate/faqs/SingleCol";
import GetStarted from "ServiceIntro/WebTemplate/cta/GetStartedLight";

const HighlightedText = tw.span`text-primary-300`;

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
