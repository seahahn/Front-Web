import React from "react";
import { Link } from "react-router-dom";

function LeftSvcIntroPart() {
  const navTextStyle = "text-white hover:text-teal-300 hover:underline hover:underline-offset-2";
  return (
    <ul className="flex flex-1 flex-row items-center justify-center space-x-8">
      <Link to="/home">
        <li className={navTextStyle}>Home</li>
      </Link>
      <Link to="/mlexamples">
        <li className={navTextStyle}>Machine Learning</li>
      </Link>
      <Link to="/dlexamples">
        <li className={navTextStyle}>Deep Learning</li>
      </Link>
      <Link to="/about">
        <li className={navTextStyle}>About Us</li>
      </Link>
    </ul>
  );
}

export default LeftSvcIntroPart;
