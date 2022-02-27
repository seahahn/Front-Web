import "./App.css";
import "./styles.css";
import { createContext } from "react";
import Navbar from "./Navbar/Navbar";
import Container from "./MLComponents/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import * as dfd from "danfojs";

const storage = window.sessionStorage; // 데이터프레임 저장을 위한 세션 스토리지

export const AppContext = createContext({ dfd, storage });

function App() {
  return (
    <div className="App h-screen text-base md:text-sm sm:text-xs">
      <Navbar />
      <DndProvider backend={HTML5Backend}>
        <AppContext.Provider value={{ dfd, storage }}>
          <Container />
        </AppContext.Provider>
      </DndProvider>
    </div>
  );
}

export default App;
