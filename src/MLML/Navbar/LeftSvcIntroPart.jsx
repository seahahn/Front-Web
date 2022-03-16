import React from "react";
import { Link } from "react-router-dom";

function LeftSvcIntroPart() {
  const navTextStyle = "text-white hover:text-blue-300 hover:underline hover:underline-offset-2";
  return (
    <ul className="flex flex-1 flex-row items-center justify-center space-x-8">
      <Link to="/home">
        <li className={navTextStyle}>Home</li>
      </Link>
      <Link to="/">
        <li className={navTextStyle}>MachineLearning</li>
      </Link>
      <Link to="/">
        <li className={navTextStyle}>DeepLearning</li>
      </Link>
      <Link to="/about">
        <li className={navTextStyle}>About</li>
      </Link>
    </ul>
  );
}

export default LeftSvcIntroPart;
