import React from "react";
import logoNav from "assets/logo_nav.png";
import { Link } from "react-router-dom";
import { GoMarkGithub } from "react-icons/go";

function Footer() {
  return (
    <div className="flex flex-1 flex-row items-center justify-between bg-gray-800 p-4 h-16">
      <div className="flex flex-row items-center space-x-4">
        <img src={logoNav} alt="logo" className="h-8 rounded-lg" />
        <span className="text-sm text-slate-300">ⓒ 2022. Team AI Play. All rights reserved.</span>
      </div>
      <div className="flex flex-row items-center space-x-8">
        <Link to="/about">
          <span className="text-sm text-slate-300">About</span>
        </Link>
        <span className="text-sm text-slate-300">Contact</span>
        <a href="https://github.com/AI-Play" target="_blank" rel="noreferrer">
          <GoMarkGithub className="h-8 w-8 text-white" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
