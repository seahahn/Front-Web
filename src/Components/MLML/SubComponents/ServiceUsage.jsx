import React, { useState, useContext, useEffect } from "react";
import classNames from "classnames";
import { ContainerContext } from "Components/MLML/MLComponents/Container";
import { HiX, HiOutlineChevronDown, HiOutlineChevronLeft } from "react-icons/hi";
import { httpConfig, UPM_MODEL_URL } from "utils/networkConfigs";
import { AppContext } from "App";

const ServiceUsage = ({ isOpen, setIsOpen }) => {
  const { projListRef, modelListRef, handleLoading, isLoading } = useContext(ContainerContext);

  const [modelListOpened, setModelListOpened] = useState(true);
  const [usageListOpened, setUsageListOpened] = useState(true);
  const [modelList, setModelList] = useState(modelListRef.current);

  useEffect(() => {
    setModelList(modelListRef.current);
    isOpen ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
  }, [isOpen, isLoading, modelListRef]);

  return (
    <div className={classNames(!isOpen && "hidden", "fixed inset-0 z-10 flex justify-center items-center")}>
      <div className="fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm" />
      <div className="absolute w-1/4 h-4/5 min-h-3/5 bg-slate-100 border-2 rounded-lg flex flex-col divide-solid p-2">
        <div className="relative flex flex-row justify-center items-center bg-slate-300 rounded-lg">
          <h3 className="text-xl font-bold p-2 text-black self-center">서비스 사용 현황</h3>
          <HiX onClick={() => setIsOpen(false)} className="absolute right-0 inline w-8 h-8 mx-2 cursor-pointer" />
        </div>
        <div className="flex flex-col space-y-2 py-2">
          <div className="flex flex-row justify-between items-center">
            <h4 className="text-lg p-2 text-black">현재 사용량</h4>
            <HiOutlineChevronDown
              className={classNames(usageListOpened ? "" : "hidden", "w-8 h-8 mx-2 cursor-pointer")}
              onClick={() => setUsageListOpened(!usageListOpened)}
            />
            <HiOutlineChevronLeft
              className={classNames(usageListOpened ? "hidden" : "", "w-8 h-8 mx-2 cursor-pointer")}
              onClick={() => setUsageListOpened(!usageListOpened)}
            />
          </div>
          <div className={classNames(usageListOpened ? "" : "hidden", "flex flex-col space-y-2 px-2")}>
            <span className="text-base text-black">프로젝트 수 : {projListRef.current && projListRef.current.length}</span>
            <span className="text-base text-black">모델 수 : {modelListRef.current && modelListRef.current.length}</span>
            <span className="text-base text-black">
              모델 용량 합계 : {modelListRef.current && modelListRef.current.reduce((prevModel, curModel) => prevModel + curModel.size, 0)} Byte
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2 py-2 max-h-3/5">
          <div className="flex flex-row justify-between items-center">
            <h4 className="text-lg p-2 text-black">모델 목록</h4>
            <HiOutlineChevronDown
              className={classNames(modelListOpened ? "" : "hidden", "w-8 h-8 mx-2 cursor-pointer")}
              onClick={() => setModelListOpened(!modelListOpened)}
            />
            <HiOutlineChevronLeft
              className={classNames(modelListOpened ? "hidden" : "", "w-8 h-8 mx-2 cursor-pointer")}
              onClick={() => setModelListOpened(!modelListOpened)}
            />
          </div>
          <div className={classNames(modelListOpened ? "" : "hidden", "custom-scroll flex flex-col overflow-y-auto space-y-2")}>
            {modelList &&
              modelList.map((model) => (
                <UpdateDeleteBtns key={model.idx} model={model} modelListRef={modelListRef} handleLoading={handleLoading} setModelList={setModelList} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceUsage;

/**
 * 모델 목록 출력을 위한 컴포넌트
 * @param model : 모델 정보
 * @param modelListRef : 모델 목록 정보를 저장하는 객체
 * @param handleLoading : 로딩 상태를 전달하는 함수
 * @param setModelList : 모델 목록을 전달하는 함수
 */
const UpdateDeleteBtns = ({ model, modelListRef, handleLoading, setModelList }) => {
  console.log(model);
  const { userIdx } = useContext(AppContext);

  const [isUpdating, setIsUpdating] = useState(false);
  const [newModelName, setNewModelName] = useState("");

  useEffect(() => {
    setNewModelName("");
  }, [isUpdating]);

  const updateModelName = async () => {
    handleLoading(true);
    const modelData = {
      old_model_name: model.model_name,
      model_name: newModelName,
    };
    const response = await fetch(`${UPM_MODEL_URL}/name/${userIdx}/${model.idx}`, httpConfig(JSON.stringify(modelData), "PUT", true));
    const result = await response.json();
    console.log(result);
    modelListRef.current = result;
    setIsUpdating(false);
    handleLoading(false);
  };

  const deleteModel = async () => {
    if (window.confirm("정말로 삭제하시겠어요?")) {
      handleLoading(true);
      const response = await fetch(`${UPM_MODEL_URL}/${userIdx}/${model.idx}`, httpConfig(null, "DELETE"));
      const result = await response.json();
      console.log(result);
      modelListRef.current = result;
      handleLoading(false);
    }
  };

  const downloadModel = async () => {
    handleLoading(true);
    const response = await fetch(`${UPM_MODEL_URL}/download/${userIdx}/${model.idx}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${model.model_name}.joblib`;
    a.click();
    window.URL.revokeObjectURL(url);
    handleLoading(false);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-white rounded-lg px-2 py-1">
      <div className="flex flex-col flex-1 mr-2 space-between">
        {isUpdating ? (
          <input
            type="text"
            maxLength="255"
            className={"px-2 flex-1 text-base placeholder:text-sm rounded-md"}
            onChange={(e) => setNewModelName(e.target.value)}
            defaultValue={model.model_name}
          />
        ) : (
          <span onClick={downloadModel} className="text-slate-800 text-base cursor-pointer">
            {model.model_name}
          </span>
        )}
        <span className="text-sm">{model.size} Byte</span>
      </div>
      <div className="flex flex-row space-x-2">
        <button
          type="button"
          onClick={isUpdating ? updateModelName : () => setIsUpdating(true)}
          className={classNames(
            "bg-utility-warn hover:bg-utility-warn-hover text-slate-800 hover:text-slate-100 text-sm md:text-xs font-bold py-1 px-2 rounded"
          )}>
          {isUpdating ? "완료" : "수정"}
        </button>
        <button
          type="button"
          onClick={isUpdating ? () => setIsUpdating(false) : deleteModel}
          className="bg-utility-del hover:bg-utility-del-hover text-slate-800 hover:text-slate-100 text-md md:text-xs font-bold py-1 px-2 rounded">
          {isUpdating ? "취소" : "삭제"}
        </button>
      </div>
    </div>
  );
};
