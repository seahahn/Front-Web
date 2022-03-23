import React from "react";
import tw from "twin.macro";
import { useParams, useLocation } from "react-router-dom";
import { ExpHeader, ExpBody } from "AIExampleComponents";
import AnimationRevealPage from "ServiceIntro/WebTemplate/helpers/AnimationRevealPage";
import AdminPost from "AIExampleComponents/AdminPost";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-10 lg:py-12 3xl:py-24`;

const AIExamplePage = () => {
  const userMembership = localStorage.getItem("AIPLAY_USER_MEMBERSHIP");
  const [isAdminPostOpen, setIsAdminPostOpen] = React.useState(false);

  const params = useParams();
  const func = params.func; // URL 맨 뒤에 붙은 값

  const location = useLocation();
  const props = location.state.props; // 해당 post 관련 내용

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <ExpHeader func={func} props={props} />
          {userMembership === process.env.REACT_APP_ADMIN_MEMBERSHIP_CODE && (
            <div className="flex flex-col items-center">
              <button type="button" onClick={() => setIsAdminPostOpen(true)} className="w-1/6 bg-primary-500 text-white">
                게시물 수정
              </button>
              <AdminPost isOpen={isAdminPostOpen} setIsOpen={setIsAdminPostOpen} post={props} />
            </div>
          )}
          <ExpBody func={func} />
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default AIExamplePage;
