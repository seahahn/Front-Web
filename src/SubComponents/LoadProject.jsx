import React, { useState, useEffect, useContext } from "react";
import classNames from "classnames";
import _ from "lodash";
import { ContainerContext } from "MLComponents/Container";
import { Radio } from "MLComponents/CompoOptions/CompoPiece";
import { inputStyle } from "MLComponents/componentStyle";
import { httpConfig, UPM_PROJ_URL, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";
import { getProjList } from "MLComponents/CompoOptions/util";

function LoadProject({ isOpen, setIsOpen, initProject, deleteProject }) {
  const projIdx = Number(window.localStorage.getItem("aiplay_proj_idx"));
  const { projListRef, isLoading } = useContext(ContainerContext);

  const [projList, setProjList] = useState(null);

  // 프로젝트 목록 열 때마다 목록 갱신
  // useEffect(() => {
  //   console.log("LoadProject useEffect");
  //   isOpen && getProjList(USER_IDX, projListRef).then((result) => setProjList(result));
  // }, [isLoading, projListRef]);

  useEffect(() => {
    setProjList(projListRef.current);
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
    // isOpen && (document.body.style.overflow = "hidden");
    // console.log(isOpen);
  }, [isOpen, isLoading, projListRef]);

  const [selectedProj, setSelectedProj] = useState(null);

  const handleChange = (e) => {
    setSelectedProj(Number(e.target.value));
  };

  const handleDelete = (e) => {
    const value = Number(e.target.value);
    const result = deleteProject(value);
    if (result) {
      projListRef.current = _.remove(projListRef.current, (proj) => proj.idx !== value);
      // setProjList(_.remove(projList, (proj) => proj.idx !== value));
      value === selectedProj && setSelectedProj(null);
    }
  };

  const handleConfirm = () => {
    if (selectedProj) {
      setIsOpen(false);
      initProject(selectedProj);
    } else {
      alert("프로젝트를 선택해주세요.");
    }
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-2/5 max-h-2/5 bg-white border-2 rounded-lg flex flex-col justify-around divide-solid p-2">
        <h3 className="text-xl p-2">프로젝트 목록</h3>
        <Radio
          options={projList ? projList.map((proj) => proj.idx) : []}
          optionText={projList ? projList.map((proj) => proj.proj_name) : null}
          group="projList"
          className="custom-scroll overflow-y-auto flex flex-col space-y-2 px-2"
          handleChange={handleChange}
          handleDelete={handleDelete}
          disabledTarget={projIdx}
        />
        <div className="flex flex-row justify-around py-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            확인
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="border border-red-500 hover:bg-red-300 text-black text-md md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(LoadProject);
