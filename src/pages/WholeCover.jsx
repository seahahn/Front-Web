import Navbar from "Components/MLML/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function WholeCover() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default WholeCover;
