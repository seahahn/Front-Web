import { Routes, Route } from "react-router-dom";
import { MLML, ServiceIntro, Home, About } from "pages";

function App() {
  return (
    <Routes>
      <Route path="/mlml" element={<MLML />} />
      <Route element={<ServiceIntro />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
