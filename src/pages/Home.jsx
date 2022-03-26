import React from "react";
import tw from "twin.macro";
import mailTo from "utils/mailTo";

import AnimationRevealPage from "Components/ServiceIntro/WebTemplate/helpers/AnimationRevealPage";

import FirstSection from "Components/ServiceIntro/WebTemplate/hero/TwoColumnWithFeaturesAndTestimonial";
// import Features from "Components/ServiceIntro/WebTemplate/features/ThreeColWithSideImage";
import MainFeature from "Components/ServiceIntro/WebTemplate/features/TwoColWithTwoHorizontalFeaturesAndButton";
import FeatureStats from "Components/ServiceIntro/WebTemplate/features/ThreeColCenteredStatsPrimaryBackground";
import Pricing from "Components/ServiceIntro/WebTemplate/pricing/TwoPlansWithDurationSwitcher";
// import Testimonial from "Components/ServiceIntro/WebTemplate/testimonials/TwoColumnWithImageAndRating";
import FAQ from "Components/ServiceIntro/WebTemplate/faqs/SingleCol";
import GetStarted from "Components/ServiceIntro/WebTemplate/cta/GetStartedLight";

import TeamIllustrationSrc from "Components/ServiceIntro/WebTemplate/images/team-illustration-2.svg";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";

const HighlightedText = tw.span`text-primary-300`;

function Home() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const firstSectionProps = {
    heading: "Simple, Easy & Fun\nAI Experience",
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
        value: "$0+",
      },
      {
        key: "Employees",
        value: "3+",
      },
    ],
  };

  const mainFeatureProps = {
    subheading: "Our Expertise",
    description:
      "일일이 코딩하며 머신 러닝 모델을 만드는 것에 지치셨나요?\n이제는 간단한 마우스 클릭과 드래그, 그리고 키보드 입력을 통해\n머신 러닝 모델을 만들어보세요!\n쉽고 재미있게 머신 러닝을 경험할 수 있도록 도와드립니다!",
    primaryButtonText: "Learn More",
    primaryButtonUrl: "https://timerse.com",
    imageSrc: TeamIllustrationSrc,
    buttonRounded: true,
    imageRounded: true,
    imageBorder: false,
    imageShadow: false,
    showDecoratorBlob: false,
    textOnLeft: true,
    features: [
      {
        Icon: BriefcaseIcon,
        title: "Professionalism",
        description: "우리는 여러분에게 최상의 서비스를 제공하기 위해 최고의 팀 멤버를 갖추고 있습니다!",
        iconContainerCss: tw`bg-primary-300 text-primary-800`,
      },
      {
        Icon: MoneyIcon,
        title: "Affordable",
        description: "우리는 여러분에게 최소한의 비용(거의 무료)으로 최대한의 경험을 드리고자 합니다!",
        iconContainerCss: tw`bg-red-300 text-red-800`,
      },
    ],
    iconRoundedFull: true,
    iconFilled: true,
    iconContainerCss: null,
  };

  const pricingProps = {
    subheading: "Pricing",
    heading: "말랑말랑(MLML) 멤버십",
    description: "손쉬운 머신 러닝 모델 구현을 바라시나요? 원하시는 기능과 용량에 맞춰 말랑말랑 멤버십을 선택해보세요!",
    plans: [
      {
        name: "Free Membership",
        durationPrices: ["$0", "$0"],
        mainFeature: "For Simple Practice",
        features: ["최대 3개 모델", "모델 용량 합계 최대 10MB", "최대 3개의 프로젝트", "기본 지원 제공"],
      },
      {
        name: "Pro Membership",
        durationPrices: ["$9", "$99"],
        mainFeature: "Suited for Professional",
        features: ["최대 10개 모델", "모델 용량 합계 최대 500MB", "최대 10개의 프로젝트", "우선 지원 제공"],
        featured: true,
      },
    ],
    primaryButtonText: "시작하기",
    planDurations: [
      {
        text: "Month",
        switcherText: "Monthly",
      },
      {
        text: "Year",
        switcherText: "Yearly",
      },
    ],
  };

  const faqProps = {
    subheading: "FAQS",
    description: "많은 분들이 주로 궁금해하시는 부분들을 모아봤어요!\n아래에서 궁금하신 부분을 찾아보세요!",
    faqs: [
      {
        question: "AI Play의 머신 러닝과 딥 러닝 체험 프로젝트들은 누가 만들었나요?",
        answer:
          "머신 러닝과 딥 러닝 프로젝트들은 AI Play의 멤버들이 만들었습니다.\n앞으로 계속해서 더 많은 참여자들을 확보할 예정입니다! 참여하고 싶으신 분들은 아래의 공식 깃허브 페이지를 확인해보세요!",
      },
      {
        question: "딥 러닝 체험 프로젝트 이용은 무료인가요?",
        answer:
          "네, 무료입니다. 기본적으로 우리의 서버에 이용자분의 이미지 등 어느 것도 저장하지 않기에 가능합니다.\n그러나 후에 서버의 자원을 많이 소모하는 프로젝트일 경우에는 유료 멤버십 이용자분께만 공개하는 것을 고려하고 있습니다.",
      },
      {
        question: "말랑말랑(MLML)은 어떻게 만들어졌나요?",
        answer:
          "GUI 기반의 머신 러닝 모델 제작 서비스 말랑말랑은 데이터 분석 및 머신 러닝에 관한 대표적인 Python의 라이브러리인 Pandas 그리고 Scikit-Learn 등을 기반으로 만들어져 있습니다.\n따라서 이들 라이브러리에 대하여 어느 정도 이해하고 사용하시면 좋습니다.",
      },
      {
        question: "지원 서비스는 어떻게 받을 수 있나요?",
        answer:
          "아래 Contact를 눌러서 이메일을 통해 지원 서비스를 신청하시면 됩니다.\n요청 순서에 따라 답신을 드린 후, 구체적인 지원 일정을 조율하여 직접 소통하며 도와드릴 것입니다.\n추후에 챗봇을 통한 지원 서비스도 제공할 예정입니다.",
      },
    ],
  };

  const getStartedProps = {
    subheading: "Interested in AI Play ?",
    heading: "Join Our Playground Now!",
    primaryLinkText: "Get Started",
    primaryLinkUrl: null,
    secondaryLinkText: "Contact Us",
    secondaryLinkUrl: mailTo(),
    pushDownFooter: true,
  };

  return (
    <AnimationRevealPage>
      <FirstSection props={firstSectionProps} />
      <FeatureStats props={featureStatsProps} />
      {/* <Features
        heading={
          <>
            Amazing <HighlightedText>Features</HighlightedText>
          </>
        }
      /> */}
      <MainFeature
        props={mainFeatureProps}
        heading={
          <>
            No Code 머신 러닝 모델 제작 서비스 <HighlightedText>말랑말랑</HighlightedText>
          </>
        }
      />
      {/* <Testimonial
        heading={
          <>
            Our Clients <HighlightedText>Love Us</HighlightedText>
          </>
        }
      /> */}
      <Pricing
        props={pricingProps}
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
