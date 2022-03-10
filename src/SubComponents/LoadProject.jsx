import React, { useState, useEffect } from "react";
import classNames from "classnames";
import _ from "lodash";
import { Radio } from "MLComponents/CompoOptions/CompoPiece";
import { inputStyle } from "MLComponents/componentStyle";
import { UPM_URL, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";

function LoadProject({ isOpened, setIsOpened, initProject, deleteProject }) {
  const projIdx = Number(window.localStorage.getItem("aiplay_proj_idx"));

  const [projList, setProjList] = useState(null);

  const getProjList = async () => {
    const response = await fetch(UPM_URL + "/list/" + USER_IDX);
    const projList = await response.json();
    console.log(projList);
    setProjList(projList);
  };

  // 프로젝트 목록 열 때마다 목록 갱신
  useEffect(() => {
    getProjList();
  }, [isOpened]);

  const [selectedProj, setSelectedProj] = useState(null);

  const handleChange = (e) => {
    setSelectedProj(Number(e.target.value));
  };

  const handleDelete = (e) => {
    const value = Number(e.target.value);
    const result = deleteProject(value);
    if (result) {
      setProjList(_.remove(projList, (proj) => proj.idx !== value));
      value === selectedProj && setSelectedProj(null);
    }
  };

  const handleConfirm = () => {
    if (selectedProj) {
      setIsOpened(false);
      initProject(selectedProj);
    } else {
      alert("프로젝트를 선택해주세요.");
    }
  };

  return (
    <div className={classNames(!isOpened && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-2/5 min-h-2/5 bg-white border-2 rounded-lg flex flex-col justify-around divide-solid p-2">
        <h3 className="text-xl p-2">프로젝트 목록</h3>
        <Radio
          options={projList ? projList.map((proj) => proj.idx) : []}
          optionText={projList ? projList.map((proj) => proj.proj_name) : null}
          group="projList"
          className="flex flex-col space-y-2 px-2 py-4"
          handleChange={handleChange}
          handleDelete={handleDelete}
          disabledTarget={projIdx}
        />
        <div className="flex flex-row justify-around">
          <button
            type="button"
            onClick={handleConfirm}
            className="border border-blue-500 hover:bg-blue-300 text-black text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            확인
          </button>
          <button
            type="button"
            onClick={() => setIsOpened(false)}
            className="border border-red-500 hover:bg-red-300 text-black text-md md:text-xs font-bold w-2/5 py-2 px-2 rounded">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(LoadProject);
