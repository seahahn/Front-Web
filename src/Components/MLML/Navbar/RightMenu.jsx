import React, { useState, Fragment, useEffect } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import blankPic from "assets/blank_pic.png";
import Chat from "Components/MLML/Chatting/Chat";

/**
 * 상단 네비게이션 바의 우측 메뉴
 * 사용자가 로그인 했을 때의 메뉴를 구현함
 * 공개 채팅 버튼, 프로필 아이콘으로 구성됨
 * 프로필 아이콘 클릭 시 사용자 관련 메뉴 출력
 */
function RightMenu({ openerStates, isMLML, loggedIn, logout, profilePic, handleImgError }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStart, setChatStart] = useState(sessionStorage.getItem("chatStart") ? true : false);
  const [chatIsChanged, setChatIsChanged] = useState(false);
  const chatProps = {
    chatOpen,
    setChatOpen,
    chatStart,
    setChatStart,
    chatIsChanged,
    setChatIsChanged,
  };

  useEffect(() => {
    chatOpen && setChatIsChanged(false);
  }, [chatOpen]);

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠어요?")) {
      logout();
    }
  };

  return (
    <div className="min-w-full md:min-w-1/10 flex items-center space-x-2 justify-center md:justify-end sm:static sm:inset-auto sm:pr-0">
      {/* 로그인 되어 있으면 공개 채팅 & 프로필 아이콘 / 안 되어 있으면 Sign In & Sign Up 버튼 */}
      {loggedIn ? (
        <>
          {/* 머신 러닝 웹 앱(MLML) 이동 버튼 */}
          {!isMLML && (
            <Link to="/mlml">
              <button
                type="button"
                className="bg-teal-300 px-2 py-1 rounded-full text-white hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                MLML
              </button>
            </Link>
          )}

          {/* 공개 채팅 버튼 */}
          <div className="relative flex flex-col items-center">
            <span
              className={classNames(
                chatStart && !chatOpen && chatIsChanged ? "animate-ping" : "hidden",
                "absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"
              )}></span>
            <button
              type="button"
              onClick={() => setChatOpen(!chatOpen)}
              className={classNames(
                "bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              )}>
              <span className="sr-only">View chatting</span>
              <HiOutlineChatAlt2 className="h-8 w-8" />
            </button>
            <div className={classNames(chatOpen ? "" : "hidden")}>
              <Chat props={chatProps} />
            </div>
          </div>

          {/* 프로필 아이콘 */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open user menu</span>
                <img className="object-cover h-8 w-8 rounded-full" src={profilePic ? profilePic : blankPic} alt="" onError={handleImgError} />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={() => openerStates.setIsUserProfileOpen(true)}
                      className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                      프로필 설정
                    </div>
                  )}
                </Menu.Item>
                {isMLML && (
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => openerStates.setIsServiceUsageOpen(true)}
                        className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                        서비스 사용 현황
                      </div>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <div onClick={handleLogout} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                      로그아웃
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-3 md:space-y-0">
          <button
            type="button"
            onClick={() => openerStates.setIsSignInOpen(true)}
            className="px-4 md:px-1 py-2 md:py-1 text-white rounded-full hover:text-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => openerStates.setIsSignUpOpen(true)}
            className="bg-teal-300 px-4 md:px-1 py-2 md:py-1 rounded-full text-slate-700 hover:text-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
            <span>Sign Up</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(RightMenu);
