import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "App";
import classNames from "classnames";
import _ from "lodash";
import { ContainerContext } from "Components/MLML/MLComponents/Container";
import { Radio } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { getProjList } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

function LoadProject({ isOpen, setIsOpen, setIsNewProjectOpen, initProject, deleteProject }) {
  const { userIdx } = useContext(AppContext);
  const projIdx = Number(localStorage.getItem("aiplay_proj_idx"));
  const { projListRef, isLoading, handleLoading, isInitialOpen, setIsInitialOpen } = useContext(ContainerContext);

  const [projList, setProjList] = useState(null);

  useEffect(() => {
    projListRef.current ? setProjList(projListRef.current) : loadingProjList();
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
  }, [isOpen, isLoading, projListRef]);

  const [selectedProj, setSelectedProj] = useState(null);

  const handleChange = (e) => {
    setSelectedProj(Number(e.target.value));
  };

  const loadingProjList = () => {
    handleLoading(true);
    getProjList(userIdx, projListRef).then((res) => {
      setProjList(res);
      handleLoading(false);
    });
  };

  const handleDelete = (e) => {
    const value = Number(e.target.value);
    const result = deleteProject(value);
    if (result) {
      projListRef.current = _.remove(projListRef.current, (proj) => proj.idx !== value);
      value === selectedProj && setSelectedProj(null);
    }
  };

  const handleConfirm = () => {
    if (selectedProj) {
      setIsOpen(false);
      setIsInitialOpen(false);
      initProject(selectedProj);
    } else {
      alert("프로젝트를 선택해주세요.");
    }
  };

  const openNewProject = () => {
    setIsNewProjectOpen(true);
    setIsOpen(false);
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-2/5 max-h-2/5 bg-white border-2 rounded-lg flex flex-col justify-around divide-solid p-2">
        <h3 className="text-xl p-2">프로젝트 목록</h3>
        {projList && projList.length > 0 ? (
          <>
            <Radio
              options={projList ? projList.map((proj) => proj.idx) : []}
              optionText={projList ? projList.map((proj) => proj.proj_name) : null}
              group="projList"
              className="custom-scroll overflow-y-auto flex flex-col space-y-2 px-2"
              handleChange={handleChange}
              handleDelete={handleDelete}
              disabledTarget={!isInitialOpen ? projIdx : null}
            />

            <div className="flex flex-row justify-around py-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
                확인
              </button>
              {!isInitialOpen && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="border border-red-500 hover:bg-red-300 text-black text-md md:text-xs font-bold w-2/5 py-2 px-2 rounded">
                  취소
                </button>
              )}
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="flex flex-col space-y-2 px-2">
              <div className="text-center">
                생성된 프로젝트가 없습니다! <br />
                아래 버튼을 눌러 프로젝트를 생성해주세요.
              </div>
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openNewProject}>
                프로젝트 생성하기
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default React.memo(LoadProject);
