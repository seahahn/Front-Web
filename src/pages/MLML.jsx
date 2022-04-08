import { createContext, memo } from "react";
import Container from "Components/MLML/MLComponents/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
// import * as dfd from "danfojs";
// import { readJSON } from "danfojs";

const storage = window.sessionStorage; // 데이터프레임 저장을 위한 세션 스토리지

export const MLMLContext = createContext();

function MLML() {
  window.onbeforeunload = (e) => {
    // 창 닫기 또는 새로고침 시 경고 띄우기
    e.preventDefault();
    e.returnValue = "저장되지 않은 데이터는 사라집니다.";
  };
  window.onunload = () => {
    storage.clear();
  };
  return (
    <div className="App text-base md:text-sm sm:text-xs">
      <DndProvider backend={HTML5Backend}>
        <MLMLContext.Provider value={{ storage }}>
          <Container />
        </MLMLContext.Provider>
      </DndProvider>
    </div>
  );
}

export default memo(MLML);
