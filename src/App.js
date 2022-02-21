import "./App.css";
import "./styles.css";
import { createContext } from "react";
import Navbar from "./Navbar/Navbar";
import Container from "./MLComponents/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import * as dfd from "danfojs";

export const DfdContext = createContext(dfd);

function App() {
  return (
    <div className="App">
      <Navbar />
      <DndProvider backend={HTML5Backend}>
        <DfdContext.Provider value={dfd}>
          <Container />
        </DfdContext.Provider>
      </DndProvider>
    </div>
  );
}

export default App;
