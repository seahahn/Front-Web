import React, { useRef, Fragment } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import blankPic from "assets/blank_pic.png";

/**
 * 상단 네비게이션 바의 우측 메뉴
 * 사용자가 로그인 했을 때의 메뉴를 구현함
 * 공개 채팅 버튼, 프로필 아이콘으로 구성됨
 * 프로필 아이콘 클릭 시 사용자 관련 메뉴 출력
 */
function RightMenu({ openerStates, isMLML, loggedIn, logout, profilePic, handleImgError }) {
  return (
    <div className="absolute inset-y-0 right-0 min-w-1/10 flex items-center space-x-2 justify-end pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {/* 로그인 되어 있으면 공개 채팅 & 프로필 아이콘 / 안 되어 있으면 Sign In & Sign Up 버튼 */}
      {loggedIn ? (
        <>
          {/* 공개 채팅 버튼 */}
          {!isMLML && (
            <Link to="/mlml">
              <button
                type="button"
                className="bg-teal-300 p-1 rounded-xl text-white hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                MLML
              </button>
            </Link>
          )}
          <button
            type="button"
            className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">View notifications</span>
            <HiOutlineChatAlt2 className="h-8 w-8" />
          </button>

          {/* 프로필 아이콘 */}
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src={profilePic ? profilePic : blankPic} alt="" onError={handleImgError} />
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
                    <div onClick={logout} className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700 cursor-pointer")}>
                      로그아웃
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      ) : (
        <div className="flex flex-row space-x-2">
          <button
            type="button"
            onClick={() => openerStates.setIsSignInOpen(true)}
            className="p-1 text-white rounded-lg hover:text-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => openerStates.setIsSignUpOpen(true)}
            className="bg-teal-300 p-1 rounded-lg text-slate-700 hover:text-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
            <span>Sign Up</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(RightMenu);
