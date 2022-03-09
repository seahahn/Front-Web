import React, { useState, useMemo, useCallback, useEffect } from "react";
import classNames from "classnames";
import { Radio } from "MLComponents/CompoOptions/CompoPiece";
import { inputStyle } from "MLComponents/componentStyle";
import { UPM_URL, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";

function LoadProject({ isOpened, setIsOpened, initProject }) {
  const getProjList = async () => {
    const response = await fetch(UPM_URL + "list/" + USER_IDX);
    const projList = await response.json();
    // console.log(projList);
    setProjList(projList);
    // const proj_idxs = projList.map((proj) => proj.idx);
    // const proj_names = projList.map((proj) => proj.proj_name);
    // console.log(proj_idxs);
    // console.log(proj_names);
  };

  useEffect(() => {
    getProjList();
  }, []);

  const [selectedProj, setSelectedProj] = useState(null);
  const [projList, setProjList] = useState(null);
  console.log(projList);

  const handleChange = (e) => {
    setSelectedProj(e.target.value);
  };

  return (
    <div className={classNames(!isOpened && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-2/5 min-h-2/5 bg-white border-2 rounded-lg flex flex-col justify-around divide-solid">
        <h3 className="text-xl p-2">프로젝트 목록</h3>
        <Radio
          options={projList && projList.map((proj) => proj.idx)}
          optionText={projList && projList.map((proj) => proj.proj_name)}
          group="projList"
          className="flex flex-col space-y-2 p-2"
          handleChange={handleChange}
        />
        <div className="flex flex-row justify-around">
          <button
            type="button"
            onClick={() => {
              setIsOpened(false);
              initProject(selectedProj);
            }}
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
