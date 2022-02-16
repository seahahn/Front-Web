import "./App.css";
import "./styles.css";
import Navbar from "./Navbar/Navbar";
import Container from "./MLFuncs/Container";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

function App() {
  return (
    <div className="App">
      <Navbar />
      <DndProvider backend={Backend}>
        <Container />
      </DndProvider>
    </div>
  );
}

export default App;
