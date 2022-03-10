/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useContext, useEffect } from "react";
import classNames from "classnames";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  HiOutlinePlusCircle,
  HiOutlineFolderOpen,
  HiOutlineSave,
  HiOutlineIdentification,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineHome,
} from "react-icons/hi";
import NewProject from "SubComponents/NewProject";
import ProjNameChange from "SubComponents/ProjNameChange";
import LoadProject from "SubComponents/LoadProject";

const LeftSidebar = ({ initProject, updateProject, newProject, updateProjName, deleteProject }) => {
  const [isNewProjectOpened, setIsNewProjectOpened] = useState(false);
  const [isProjNameChangeOpened, setIsProjNameChangeOpened] = useState(false);
  const [isLoadProjectOpened, setIsLoadProjectOpened] = useState(false);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          {/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
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
        <Menu.Items className="z-50 origin-top-right absolute -left-6 mt-4 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => setIsNewProjectOpened(true)}
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center cursor-pointer")}>
                  <HiOutlinePlusCircle className="inline mx-2" /> 새 프로젝트
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => setIsLoadProjectOpened(true)}
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center cursor-pointer")}>
                  <HiOutlineFolderOpen className="inline mx-2" />
                  프로젝트 열기
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={updateProject}
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center cursor-pointer")}>
                  <HiOutlineSave className="inline mx-2" />
                  프로젝트 저장
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => setIsProjNameChangeOpened(true)}
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center cursor-pointer")}>
                  <HiOutlineIdentification className="inline mx-2" />
                  프로젝트명 변경
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://seahahn.notion.site/AI-Play-FAQ-c776655cf3ec4ce4873910f2b8baea82"
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center")}>
                  <HiOutlineExclamationCircle className="inline mx-2" />
                  FAQ
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://mail.google.com/"
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center")}>
                  <HiOutlineQuestionMarkCircle className="inline mx-2" />
                  Q&A
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="https://seahahn.notion.site/AI-Play-About-66e76675940b4056b5684e32ec23c373"
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center")}>
                  <HiOutlineInformationCircle className="inline mx-2" />
                  About AI Play
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="http://localhost:3000/"
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-base flex items-center")}>
                  <HiOutlineHome className="inline mx-2" />
                  AI Play로 이동
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
      <NewProject isOpened={isNewProjectOpened} setIsOpened={setIsNewProjectOpened} newProject={newProject} />
      <ProjNameChange isOpened={isProjNameChangeOpened} setIsOpened={setIsProjNameChangeOpened} updateProjName={updateProjName} />
      <LoadProject isOpened={isLoadProjectOpened} setIsOpened={setIsLoadProjectOpened} initProject={initProject} deleteProject={deleteProject} />
    </Menu>
  );
};

export default React.memo(LeftSidebar);
