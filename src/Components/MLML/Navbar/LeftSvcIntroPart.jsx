import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

function LeftSvcIntroPart({ isMLML }) {
  const navTextStyle = "text-white hover:text-teal-300 hover:underline hover:underline-offset-2";
  return (
    <ul className={classNames(isMLML ? "invisible" : "", "flex flex-1 flex-col md:flex-row items-center justify-center md:space-x-8 space-y-8 md:space-y-0")}>
      {[
        ["/home", "Home"],
        ["/mlexamples", "Machine Learning"],
        ["/dlexamples", "Deep Learning"],
        ["/about", "About Us"],
      ].map(([link, text]) => (
        <Link to={link}>
          <li className={navTextStyle}>{text}</li>
        </Link>
      ))}
    </ul>
  );
}

export default LeftSvcIntroPart;
