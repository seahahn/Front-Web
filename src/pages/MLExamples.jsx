import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import Examples from "ServiceIntro/WebTemplate/blogs/ThreeColSimpleWithImageAndDashedBorder";

const HighlightedText = tw.span`text-primary-500`;

function MLExamples() {
  const props = {
    subheading: "Machine Learning Examples",
    description: "머신 러닝이 무엇인지, 어떻게 만들어지고 동작하는지\n경험해보세요!",
    blogPosts: [
      {
        imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        author: "Adam Wathan",
        category: "SEO",
        title: "Optimizing your website for your main keyword",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "https://reddit.com",
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1479660095429-2cf4e1360472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        author: "Owais Khan",
        category: "Advertising",
        title: "Creating The perfect advertisement campaign",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "https://timerse.com",
      },
      {
        imageSrc: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        author: "Steve Schoger",
        category: "Social Media",
        title: "Efficient management of your social media assets",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "https://timerse.com",
      },
    ],
  };

  return (
    <Examples
      props={props}
      heading={
        <>
          <HighlightedText>머신 러닝</HighlightedText> 프로젝트
        </>
      }
    />
  );
}

export default MLExamples;
