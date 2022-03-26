import React from "react";
import tw from "twin.macro";
import { Link as RouteLink } from "react-router-dom";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading as HeadingTitle, Subheading } from "Components/ServiceIntro/WebTemplate/misc/Headings";
import { PrimaryButton as PrimaryButtonBase } from "Components/ServiceIntro/WebTemplate/misc/Buttons";
import { ReactComponent as UserIcon } from "feather-icons/dist/icons/user.svg";
import { ReactComponent as TagIcon } from "feather-icons/dist/icons/tag.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "Components/ServiceIntro/WebTemplate/images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "Components/ServiceIntro/WebTemplate/images/svg-decorator-blob-3.svg";

import AdminPost from "Components/AIExampleComponents/AdminPost";
import { deletePost } from "Components/AIExampleComponents/post";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-10 lg:py-12 3xl:py-24`;
const ThreeColumn = tw.div`flex flex-col items-center lg:items-stretch lg:flex-row flex-wrap`;
const Column = tw.div`mt-24 lg:w-1/3`;

const HeadingInfoContainer = tw.div`flex flex-col items-center`;
const HeadingDescription = tw.p`mt-4 font-medium text-gray-600 text-center whitespace-pre-line max-w-sm`;

const Card = tw.div`lg:mx-4 xl:mx-8 max-w-sm flex flex-col h-full`;
const Image = styled.div((props) => [`background-image: url("${props.imageSrc}");`, tw`bg-cover bg-center h-80 lg:h-64 rounded rounded-b-none`]);

const Details = tw.div`p-6 rounded border-2 border-t-0 rounded-t-none border-solid border-primary-100 flex-1 flex flex-col items-center text-center lg:block lg:text-left`;
const MetaContainer = tw.div`flex items-center`;
const Meta = styled.div`
  ${tw`text-secondary-100 font-medium text-sm flex items-center leading-none mr-6 last:mr-0`}
  svg {
    ${tw`w-4 h-4 mr-1`}
  }
`;

const Title = tw.h5`mt-4 leading-snug font-bold text-lg text-slate-100`;
const Description = tw.p`mt-2 text-sm text-secondary-100`;
const Link = styled(PrimaryButtonBase).attrs({ as: "a", target: "_blank", rel: "noopener noreferrer" })`
  ${tw`inline-block mt-4 text-sm font-semibold self-end`}
`;
const LinkCover = styled(PrimaryButtonBase)`
  ${tw`inline-block mt-4 text-sm font-semibold self-end`}
`;

const DecoratorBlob1 = tw(SvgDecoratorBlob1)`-z-10 absolute bottom-0 right-0 w-48 h-48 transform translate-x-40 -translate-y-8 opacity-25`;
const DecoratorBlob2 = tw(SvgDecoratorBlob2)`-z-10 absolute top-0 left-0 w-48 h-48 transform -translate-x-32 translate-y-full opacity-25`;

const ThreeColSimpleWithImageAndDashedBorder = ({
  refresh,
  setRefresh,
  isAdminPostOpen,
  setIsAdminPostOpen,
  isDL = false,
  heading = (
    <>
      We Love <span tw="text-primary-500">Writing.</span>
    </>
  ),
  props = {
    subheading: "Blog",
    description: "Some amazing blog posts that are written by even more amazing people.",
    posts: [
      {
        image_src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        author: "Adam Wathan",
        category: "SEO",
        title: "Optimizing your website for your main keyword",
        dsc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        link: "https://reddit.com",
      },
      {
        image_src: "https://images.unsplash.com/photo-1479660095429-2cf4e1360472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        author: "Owais Khan",
        category: "Advertising",
        title: "Creating The perfect advertisement campaign",
        dsc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        link: "https://timerse.com",
      },
      {
        image_src: "https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        author: "Steve Schoger",
        category: "Social Media",
        title: "Efficient management of your social media assets",
        dsc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        link: "https://timerse.com",
      },
    ],
  },
}) => {
  const userMembership = localStorage.getItem("AIPLAY_USER_MEMBERSHIP");

  const handleDeletePost = (e) => {
    deletePost(e.target.value).then((res) => {
      setRefresh(!refresh);
    });
  };

  return (
    <Container>
      <Content>
        <HeadingInfoContainer>
          {props.subheading && <Subheading>{props.subheading}</Subheading>}
          <HeadingTitle>{heading}</HeadingTitle>
          <HeadingDescription>{props.description}</HeadingDescription>
          {userMembership === process.env.REACT_APP_ADMIN_MEMBERSHIP_CODE && (
            <>
              <button type="button" onClick={() => setIsAdminPostOpen(true)} className="p-2 bg-primary-500 text-white">
                게시물 추가
              </button>
              <AdminPost isOpen={isAdminPostOpen} setIsOpen={setIsAdminPostOpen} />
            </>
          )}
        </HeadingInfoContainer>
        <ThreeColumn>
          {props.posts.map((post, index) => (
            <Column key={index}>
              <Card>
                <Image imageSrc={post.image_src} />
                <Details>
                  <MetaContainer>
                    <Meta>
                      <UserIcon />
                      <div>{post.author}</div>
                    </Meta>
                    <Meta>
                      <TagIcon />
                      <div>{post.category}</div>
                    </Meta>
                  </MetaContainer>
                  <Title>{post.title}</Title>
                  <Description>{post.dsc}</Description>
                  {isDL ? (
                    <RouteLink to={post.link} state={{ props: post }}>
                      <LinkCover>이동하기</LinkCover>
                    </RouteLink>
                  ) : (
                    <Link href={post.link}>이동하기</Link>
                  )}
                  {userMembership === process.env.REACT_APP_ADMIN_MEMBERSHIP_CODE && (
                    <button type="button" value={post.idx} onClick={handleDeletePost} className="bg-red-500 text-white p-2 justify-self-end">
                      삭제
                    </button>
                  )}
                </Details>
              </Card>
            </Column>
          ))}
        </ThreeColumn>
      </Content>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};

export default ThreeColSimpleWithImageAndDashedBorder;
