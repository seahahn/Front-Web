import React from "react";
import tw from "twin.macro";
import { SectionHeading as HeadingTitle, Subheading } from "ServiceIntro/WebTemplate/misc/Headings";

const HeadingInfoContainer = tw.div`flex flex-col items-center`;
const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center whitespace-pre-line max-w-sm`;

const ExpHeader = ({ props }) => {
  return (
    <div>
      <HeadingInfoContainer>
        <Subheading>{props.category}</Subheading>
        <HeadingTitle>{props.title}</HeadingTitle>
        <HeadingDescription>{props.dsc}</HeadingDescription>
      </HeadingInfoContainer>
    </div>
  );
};

export default ExpHeader;
