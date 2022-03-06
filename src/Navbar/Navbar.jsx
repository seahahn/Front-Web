/* This example requires Tailwind CSS v2.0+ */
import React, { useCallback } from "react";
import classNames from "classnames";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import LeftSidebar from "./LeftSidebar";

const USER_IDX = 2;
const PROJ_IDX = 2;
// UPM = User-Proj-Managing
const UPM_URL = "http://localhost:3001/project"; // User-Proj-Managing(사용자 프로젝트 관리) 서버 주소
const UPM_TARGET = `/${USER_IDX}/${PROJ_IDX}`; // 사용자 및 프로젝트 고유 번호(프로젝트 불러오기, 수정, 삭제에 사용)

function Navbar({ layout }) {
  const saveProject = useCallback(async () => {
    // 새 프로젝트 생성 시 사용할 함수
    const projectData = {
      user_idx: USER_IDX,
      proj_idx: PROJ_IDX,
      layout: layout,
    };
    await fetch(UPM_URL, Object.assign(httpConfig(JSON.stringify(projectData)), { headers: { "Content-Type": "application/json" } }))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, [layout]);

  const updateProject = useCallback(async () => {
    // 기존 프로젝트 수정 시 사용할 함수
    // const params = {
    //   user_idx: 1,
    //   proj_idx: 1,
    // };
    const projectData = {
      layout: layout,
    };
    await fetch(UPM_URL + UPM_TARGET, Object.assign(httpConfig("PUT", JSON.stringify(projectData)), { headers: { "Content-Type": "application/json" } }))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, [layout]);

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* 좌측 메뉴 */}
          <div className="flex-1 flex items-center leading-normal space-x-4 sm:items-stretch sm:justify-start">
            <LeftSidebar saveProject={saveProject} updateProject={updateProject} />
            <div className="flex items-center leading-normal space-x-4">
              <div className="text-gray-300 text-lg font-medium">프로젝트명</div>
              <div className="text-gray-300 text-sm font-medium">마지막 저장 시점 : {new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* 공개 채팅 버튼 */}
            <button
              type="button"
              className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              <HiOutlineChatAlt2 className="h-8 w-8" />
            </button>

            {/* 프로필 버튼 & 드롭다운 */}
            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
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
                      <a href="https://www.naver.com" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                        프로필 설정
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a href="https://www.google.com" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
                        로그아웃
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

export default React.memo(Navbar);
