import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MLML, ServiceIntro } from "pages";
// import { createContext } from "react";
// import Container from "./MLML/MLComponents/Container";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DndProvider } from "react-dnd";
// import * as dfd from "danfojs";

// const storage = window.sessionStorage; // 데이터프레임 저장을 위한 세션 스토리지

// export const AppContext = createContext({ dfd, storage });

function App() {
  // window.onbeforeunload = (e) => {
  //   // 창 닫기 또는 새로고침 시 경고 띄우기
  //   e.preventDefault();
  //   e.returnValue = "";
  // };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mlml" element={<MLML />} />
        <Route path="/" element={<ServiceIntro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
