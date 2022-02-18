import "./App.css";
import "./styles.css";
import Navbar from "./Navbar/Navbar";
// import Container from "./MLFuncs/Container";
import Container from "./MLComponents/Container";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

function App() {
  return (
    <div className="App">
      <Navbar />
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  );
}

export default App;
