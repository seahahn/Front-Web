import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from "ServiceIntro/WebTemplate/helpers/AnimationRevealPage";
import Examples from "ServiceIntro/WebTemplate/blogs/ThreeColSimpleWithImageAndDashedBorder";
import { getPosts } from "AIExampleComponents/post";

const HighlightedText = tw.span`text-primary-500`;

function MLExamples() {
  const [posts, setPosts] = React.useState([]);
  const [isAdminPostOpen, setIsAdminPostOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    getPosts("ml").then((res) => {
      setPosts(res);
    });
  }, [refresh, isAdminPostOpen]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const props = {
    subheading: "Machine Learning Examples",
    description: "머신 러닝이 무엇인지, 어떻게 만들어지고 동작하는지\n경험해보세요!",
    posts: posts,
  };

  return (
    <AnimationRevealPage>
      <Examples
        props={props}
        heading={
          <>
            <HighlightedText>머신 러닝</HighlightedText> 프로젝트
          </>
        }
        isDL={false}
        refresh={refresh}
        setRefresh={setRefresh}
        isAdminPostOpen={isAdminPostOpen}
        setIsAdminPostOpen={setIsAdminPostOpen}
      />
    </AnimationRevealPage>
  );
}

export default MLExamples;
