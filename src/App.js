import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { MLML, ServiceIntro, Home, About, MLExamples, DLExamples, AIExamplePage } from "pages";
export const AppContext = createContext(); // Navbar 및 MLComponents 모두에 사용되는 변수를 전달하기 위한 컨텍스트

function App() {
  const navigate = useNavigate();

  const [userIdx, setUserIdx] = React.useState(localStorage.getItem("AIPLAY_USER_IDX"));
  const [userNickname, setUserNickname] = React.useState(localStorage.getItem("AIPLAY_USER_NICKNAME"));
  const [isSignInOpenFromHome, setIsSignInOpenFromHome] = React.useState(false);

  const refreshTokenInterval = React.useRef(null);

  // Home 에서 Get Started 또는 Learn More 버튼 클릭 시 동작할 함수
  const handleGetStarted = () => {
    // 로그인을 하여 userIdx가 있으면 MLML로 이동, 없으면 로그인 창 띄우기
    userIdx ? navigate("/mlml") : setIsSignInOpenFromHome(true);
  };

  return (
    <AppContext.Provider
      value={{
        userIdx,
        setUserIdx,
        userNickname,
        setUserNickname,
        isSignInOpenFromHome,
        setIsSignInOpenFromHome,
        handleGetStarted,
        refreshTokenInterval,
      }}>
      <Routes>
        <Route path="/mlml" element={<MLML />} />
        <Route element={<ServiceIntro />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mlexamples" element={<MLExamples />} />
          <Route path="/dlexamples" element={<DLExamples />} />
          <Route path="/dlexamples/:func" element={<AIExamplePage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default React.memo(App);
