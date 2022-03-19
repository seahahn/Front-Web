import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

import AnimationRevealPage from "ServiceIntro/WebTemplate/helpers/AnimationRevealPage";

import FirstSection from "ServiceIntro/WebTemplate/hero/TwoColumnWithFeaturesAndTestimonial";
import Features from "ServiceIntro/WebTemplate/features/ThreeColWithSideImage";
import MainFeature from "ServiceIntro/WebTemplate/features/TwoColWithTwoHorizontalFeaturesAndButton";
import FeatureStats from "ServiceIntro/WebTemplate/features/ThreeColCenteredStatsPrimaryBackground";
import Pricing from "ServiceIntro/WebTemplate/pricing/TwoPlansWithDurationSwitcher";
import Testimonial from "ServiceIntro/WebTemplate/testimonials/TwoColumnWithImageAndRating";
import FAQ from "ServiceIntro/WebTemplate/faqs/SingleCol";
import GetStarted from "ServiceIntro/WebTemplate/cta/GetStartedLight";

const HighlightedText = tw.span`text-primary-300`;

function Home() {
  const firstSectionProps = {
    heading: "Simple, Easy & Fun\nAI Experiences",
    description:
      "인공지능이 무엇인지 궁금하셨나요?\nAI Play에서 단순하고, 쉽고, 재미있게 경험해보세요!\n말로만 듣던 머신 러닝과 딥 러닝이 무엇인지 직접 경험해보세요!",
    imageSrc:
      "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=510&q=80",
    imageDecoratorBlob: true,
    primaryButtonUrl: "",
    primaryButtonText: "Get Started",
    buttonRounded: true,
    features: ["GUI 기반 머신 러닝 모델 제작 도구 말랑말랑(MalLang-MalLang)", "직접 체험 가능한 N개 이상의 머신 러닝 모델 프로젝트", "N개의 딥 러닝 프로젝트"],
    testimonial: {
      quote:
        "250년 이상 동안 경제 성장의 근본적인 동인은 기술 혁신이었다.\n이들 중 가장 중요한 것은 경제학자들이 범용 기술이라고 부르는 증기기관, 전기, 내연기관 등을 포함한다.\n우리 시대의 가장 중요한 범용기술은 인공지능, 특히 기계 학습이다.",
      customerName: "에릭 브린욜프손, 앤드류 맥아피",
      customerCompany: "MIT 슬론경영대학원 교수, 부교수",
    },
  };

  const featureStatsProps = {
    subheading: "",
    heading: "N개 이상의 인공지능 프로젝트",
    description: "이미 인공지능에 관심을 가진 수많은 분들이 주목하고 있습니다!\n우리는 여러분이 쉽고 재미있게 인공지능을 경험할 수 있도록 도와드립니다!",
    stats: [
      {
        key: "Clients",
        value: "10+",
      },
      {
        key: "Revenue",
        value: "$10+",
      },
      {
        key: "Employees",
        value: "3+",
      },
    ],
  };

  const faqProps = {
    subheading: "FAQS",
    description: "많은 들이 주로 궁금해하시는 부분들을 모아봤어요!\n아래에서 궁금하신 부분을 찾아보세요!",
    faqs: [
      {
        question: "Is lunch provided free of cost ?",
        answer:
          "Yes, it is, if you have a membership with us. Otherwise it is charged as per the menu. Some limits do apply as to how much items can be included in your lunch. This limit is enough for any one person and merely exists to discourage abusal of the system.",
      },
      {
        question: "Do you have 2 Bedroom suites ?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        question: "Are Wi-Fi costs included in the price ?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        question: "Where can I reach you for support ?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
  };

  const getStartedProps = {
    subheading: "Interested in AI Play ?",
    heading: "Join Our Playground Now!",
    primaryLinkText: "Get Started",
    primaryLinkUrl: null,
    secondaryLinkText: "Contact Us",
    secondaryLinkUrl: "http://google.com",
    pushDownFooter: true,
  };

  return (
    <AnimationRevealPage>
      <FirstSection props={firstSectionProps} />
      <FeatureStats props={featureStatsProps} />
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
        props={faqProps}
        heading={
          <>
            자주 묻는 <HighlightedText>질문</HighlightedText>
          </>
        }
      />
      <GetStarted props={getStartedProps} />
    </AnimationRevealPage>
  );
}

export default Home;
