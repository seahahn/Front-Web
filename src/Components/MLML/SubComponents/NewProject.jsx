import React, { useEffect, useContext } from "react";
import classNames from "classnames";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { ContainerContext } from "Components/MLML/MLComponents/Container";

function NewProject({ isOpen, setIsOpen, newProject }) {
  const { projListRef, isLoading, handleLoading, isInitialOpen, setIsInitialOpen } = useContext(ContainerContext);

  const [newProjName, setNewProjName] = React.useState("");

  useEffect(() => {
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleConfirm = () => {
    if (newProjName) {
      setIsOpen(false);
      setIsInitialOpen(false);
      newProject(newProjName);
      setNewProjName("");
    } else {
      alert("프로젝트명을 입력해주세요.");
    }
  };

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-1/4 h-1/4 bg-slate-500 border-2 rounded-lg flex flex-col justify-around divide-solid space-y-3 pb-3 px-8">
        <h3 className="text-xl p-2 font-bold text-white self-center">새 프로젝트 생성</h3>
        <input
          type="text"
          className={"mx-2 px-2 text-lg placeholder:text-base rounded-md"}
          placeholder="프로젝트명을 입력해주세요"
          value={newProjName}
          onChange={(e) => setNewProjName(e.target.value)}
        />
        <div className="flex flex-row justify-around">
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-primary-500 hover:bg-primary-700 text-white hover:text-primary-300 text-sm md:text-xs font-bold w-2/5 py-2 px-2 rounded-full">
            확인
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white text-md md:text-xs font-bold w-2/5 py-2 px-2 rounded-full">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NewProject);
