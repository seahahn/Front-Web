import logoNav from "assets/logo_nav.png";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import LeftMLNavPart from "./LeftMLNavPart";
import LeftSvcIntroPart from "./LeftSvcIntroPart";
import RightMenu from "./RightMenu";
import ServiceUsage from "MLML/SubComponents/ServiceUsage";
import SignUp from "ServiceIntro/SignUp";
import SignIn from "ServiceIntro/SignIn";
import FindPw from "ServiceIntro/FindPw";
import UserProfile from "ServiceIntro/UserProfile";
import errorPic from "assets/error_pic.png";

function Navbar({ props, isMLML }) {
  const userIdx = localStorage.getItem("AIPLAY_USER_IDX");

  const [profilePic, setProfilePic] = useState(localStorage.getItem("AIPLAY_USER_PIC"));

  const [loggedIn, setLoggedIn] = useState(userIdx);

  const [isServiceUsageOpen, setIsServiceUsageOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isFindPwOpen, setIsFindPwOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const openerStates = {
    setIsServiceUsageOpen,
    setIsSignInOpen,
    setIsSignUpOpen,
    setIsFindPwOpen,
    setIsUserProfileOpen,
    setLoggedIn,
  };

  const logout = () => {
    localStorage.removeItem("AIPLAY_USER_IDX");
    localStorage.removeItem("AIPLAY_USER_EMAIL");
    localStorage.removeItem("AIPLAY_USER_NICKNAME");
    localStorage.removeItem("AIPLAY_USER_PIC");
    localStorage.removeItem("aiplay_proj_idx");
    sessionStorage.clear();
    setLoggedIn(false);
  };

  const handleImgError = (e) => {
    console.log(e.target);
    e.target.src = errorPic;
    e.target.title = "이미지 로딩 오류";
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="md:block hidden px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {!isMLML && (
            <Link to="/">
              <img src={logoNav} alt="logo" className="h-12 rounded-lg" />
            </Link>
          )}
          {/* 좌측 메뉴 */}
          {isMLML ? <LeftMLNavPart props={props} /> : <LeftSvcIntroPart />}

          {/* 우측 메뉴 */}
          <RightMenu
            openerStates={openerStates}
            isMLML={isMLML}
            loggedIn={loggedIn}
            logout={logout}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            handleImgError={handleImgError}
          />
        </div>
      </div>
      {/* 모바일 메뉴 버튼 */}
      <div className="w-full flex justify-center">
        <button className="md:hidden xs:block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isMLML ? (
        <ServiceUsage isOpen={isServiceUsageOpen} setIsOpen={setIsServiceUsageOpen} />
      ) : (
        <>
          <SignIn isOpen={isSignInOpen} openerStates={openerStates} setProfilePic={setProfilePic} />
          <SignUp isOpen={isSignUpOpen} setIsOpen={setIsSignUpOpen} setIsSignInOpen={setIsSignInOpen} />
          <FindPw isOpen={isFindPwOpen} setIsOpen={setIsFindPwOpen} setIsSignInOpen={setIsSignInOpen} />
        </>
      )}
      <UserProfile
        isOpen={isUserProfileOpen}
        setIsOpen={setIsUserProfileOpen}
        logout={logout}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        handleImgError={handleImgError}
      />
    </Disclosure>
  );
}

export default React.memo(Navbar);
