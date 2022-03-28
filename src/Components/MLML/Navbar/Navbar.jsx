import logoNav from "assets/logo_nav.png";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "App";
import { Disclosure } from "@headlessui/react";
import { Link } from "react-router-dom";
import LeftSvcIntroPart from "./LeftSvcIntroPart";
import RightMenu from "./RightMenu";
import SignUp from "Components/ServiceIntro/UserAuthFuncs/SignUp";
import SignIn from "Components/ServiceIntro/UserAuthFuncs/SignIn";
import FindPw from "Components/ServiceIntro/UserAuthFuncs/FindPw";
import UserProfile from "Components/ServiceIntro/UserAuthFuncs/UserProfile";
import ServiceUsage from "Components/MLML/SubComponents/ServiceUsage";
import errorPic from "assets/error_pic.png";
import { removeToken, refreshToken } from "utils/auth";
import classNames from "classnames";

function Navbar() {
  const navigate = useNavigate();

  const { LeftNavPart, isMLML, userIdx, setUserIdx, setUserNickname, isSignInOpenFromHome, refreshTokenInterval } = useContext(AppContext);

  const [profilePic, setProfilePic] = useState(localStorage.getItem("AIPLAY_USER_PIC"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(userIdx ? true : false);

  const [isServiceUsageOpen, setIsServiceUsageOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isFindPwOpen, setIsFindPwOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  useEffect(async () => {
    // 새로고침 등으로 페이지가 새로 로딩된 경우 JWT 발급 재시작
    if (userIdx) {
      // 로컬 스토리지에 저장된 사용자 고유 번호가 있는 경우 토큰 갱신 요청
      const tokenState = refreshToken();
      console.log(tokenState);
      if (tokenState) {
        // 토큰 갱신 요청 성공한 경우
        refreshTokenInterval.current = setInterval(refreshToken, 1000 * 60 * 1);
      } else {
        // 토큰 갱신 요청 실패한 경우 (토큰 만료)
        console.log("Token Expired");
        alert("토큰이 만료되어 로그아웃 되었습니다.");
        logout();
      }
    }
  }, []);

  useEffect(() => {
    setIsSignInOpen(isSignInOpenFromHome);
  }, [isSignInOpenFromHome]);

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
    localStorage.removeItem("AIPLAY_USER_MEMBERSHIP");
    localStorage.removeItem("AIPLAY_USER_TOKEN");
    localStorage.removeItem("aiplay_csrf_token");
    localStorage.removeItem("aiplay_proj_idx");
    sessionStorage.clear();
    setLoggedIn(false);
    setUserIdx(null);
    setUserNickname(null);
    setProfilePic(null);

    // 1시간마다 갱신하던 토큰을 제거
    clearInterval(refreshTokenInterval.current);
    removeToken();
    navigate("/");
  };

  const handleImgError = useCallback((e) => {
    e.target.src = errorPic;
    e.target.title = "이미지 로딩 오류";
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="px-2 sm:px-6 lg:px-8">
        {/* 모바일 메뉴 버튼 */}
        <div className="w-full flex justify-center">
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div
          className={classNames(
            mobileMenuOpen ? "flex" : "hidden",
            "relative md:flex flex-col md:flex-row items-center justify-between h-full md:h-16 pb-8 md:pb-0 space-y-8 md:space-y-0"
          )}>
          {!isMLML && (
            <Link to="/">
              <img src={logoNav} alt="logo" className="h-12 rounded-lg" />
            </Link>
          )}
          {/* 좌측 메뉴 */}
          {/* {isMLML?:<LeftSvcIntroPart/>} */}
          {isMLML ? LeftNavPart : <LeftSvcIntroPart />}

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

      {isMLML && <ServiceUsage isOpen={isServiceUsageOpen} setIsOpen={setIsServiceUsageOpen} />}
      <SignIn isOpen={isSignInOpen} openerStates={openerStates} setProfilePic={setProfilePic} />
      <SignUp isOpen={isSignUpOpen} setIsOpen={setIsSignUpOpen} setIsSignInOpen={setIsSignInOpen} />
      <FindPw isOpen={isFindPwOpen} setIsOpen={setIsFindPwOpen} setIsSignInOpen={setIsSignInOpen} />
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
