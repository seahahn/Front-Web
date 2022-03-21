import React, { createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { MLML, ServiceIntro, Home, About, MLExamples, DLExamples } from "pages";

export const AppContext = createContext(); // Navbar 및 MLComponents 모두에 사용되는 변수를 전달하기 위한 컨텍스트

function App() {
  const [userIdx, setUserIdx] = React.useState(localStorage.getItem("AIPLAY_USER_IDX"));
  const [userNickname, setUserNickname] = React.useState(localStorage.getItem("AIPLAY_USER_NICKNAME"));
  const [isSignInOpenFromHome, setIsSignInOpenFromHome] = React.useState(false);

  return (
    <AppContext.Provider value={{ userIdx, setUserIdx, userNickname, setUserNickname, isSignInOpenFromHome, setIsSignInOpenFromHome }}>
      <Routes>
        <Route path="/mlml" element={<MLML />} />
        <Route element={<ServiceIntro />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mlexamples" element={<MLExamples />} />
          <Route path="/dlexamples" element={<DLExamples />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}

export default React.memo(App);
