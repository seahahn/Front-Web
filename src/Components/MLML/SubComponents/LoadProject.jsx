import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "App";
import classNames from "classnames";
import _ from "lodash";
import { Radio } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { getProjList } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

function LoadProject({ isOpen, setIsOpen, setIsNewProjectOpen, initProject, deleteProject }) {
  const { userIdx, ccv } = useContext(AppContext);
  const { projListRef, isLoading, handleLoading, isInitialOpen, setIsInitialOpen } = ccv;
  const projIdx = Number(localStorage.getItem("aiplay_proj_idx"));

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
      <div className="absolute w-full md:w-1/4 max-h-2/5 bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid p-2 space-y-3">
        <h3 className="text-xl p-2 font-bold text-white self-center">프로젝트 목록</h3>
        {projList && projList.length > 0 ? (
          <>
            <Radio
              options={projList ? projList.map((proj) => proj.idx) : []}
              optionText={projList ? projList.map((proj) => proj.proj_name) : null}
              group="projList"
              className="custom-scroll overflow-y-auto flex flex-col space-y-2 px-2 text-lg text-slate-200"
              handleChange={handleChange}
              handleDelete={handleDelete}
              disabledTarget={!isInitialOpen ? projIdx : null}
            />

            <div className="flex flex-row justify-around py-2">
              <button
                type="button"
                onClick={handleConfirm}
                className={classNames(
                  "bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded-full"
                )}>
                확인
              </button>
              {!isInitialOpen && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white text-md md:text-xs font-bold w-2/5 py-2 px-2 rounded-full">
                  취소
                </button>
              )}
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="flex flex-col items-center space-y-5 px-2 pb-2">
              <div className="text-center text-slate-100">
                생성된 프로젝트가 없습니다! <br />
                아래 버튼을 눌러 프로젝트를 생성해주세요.
              </div>
              <button type="button" className="bg-primary-500 hover:bg-primary-700 text-white font-bold w-1/2 py-2 px-4 rounded-full" onClick={openNewProject}>
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
