import React, { useState, useRef } from "react";
import classNames from "classnames";
import SideBarItem from "./SideBarItem";
import { buttonStyle } from "MLML/MLComponents/componentStyle";
import { ITEMS_NEW_BLOCK, ITEMS_PREPROCESS, ITEMS_TRAIN, ITEMS_EVAL } from "./constants";

function SideBar({ addNewBlock }) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isNewBlockHidden, setIsNewBlockHidden] = useState(false);
  const [isPreprocessHidden, setIsPreprocessHidden] = useState(false);
  const [isTrainHidden, setIsTrainHidden] = useState(false);
  const [isEvalHidden, setIsEvalHidden] = useState(false);

  const isSidebarHiddenRef = useRef();
  const isNewBlockHiddenRef = useRef();
  const isPreprocessHiddenRef = useRef();
  const isTrainHiddenRef = useRef();
  const isEvalHiddenRef = useRef();

  const handleHidden = (event) => {
    switch (event.target) {
      case isSidebarHiddenRef.current:
        setIsSidebarHidden(!isSidebarHidden);
        break;
      case isNewBlockHiddenRef.current:
        setIsNewBlockHidden(!isNewBlockHidden);
        break;
      case isPreprocessHiddenRef.current:
        setIsPreprocessHidden(!isPreprocessHidden);
        break;
      case isTrainHiddenRef.current:
        setIsTrainHidden(!isTrainHidden);
        break;
      case isEvalHiddenRef.current:
        setIsEvalHidden(!isEvalHidden);
        break;
      default:
        console.log("error");
        break;
    }
  };

  return (
    // 사이드바와 사이드바 내 아이템들
    <div className={classNames(isSidebarHidden ? "rounded-bl-lg" : "bottom-0", "sideBar w-1/5 overflow-y-scroll space-y-2")}>
      <div className="relative flex flex-row justify-between">
        <button type="button" onClick={addNewBlock} className={buttonStyle}>
          블록 추가
        </button>
        <button ref={isSidebarHiddenRef} type="button" onClick={handleHidden} className={buttonStyle}>
          {isSidebarHidden ? "보이기" : "숨기기"}
        </button>
      </div>
      <div className={classNames("sideBar-item-container space-y-2", { hidden: isSidebarHidden })}>
        <div className={classNames("flex flex-row justify-between")}>
          <span>데이터 추가 기능</span>
          <button ref={isNewBlockHiddenRef} type="button" onClick={handleHidden} className={buttonStyle}>
            {isNewBlockHidden ? "보이기" : "숨기기"}
          </button>
        </div>
        <div className={classNames(isNewBlockHidden ? "hidden" : "")}>
          {Object.values(ITEMS_NEW_BLOCK).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        <div className={classNames("flex flex-row justify-between")}>
          <span>EDA / 전처리 기능</span>
          <button ref={isPreprocessHiddenRef} type="button" onClick={handleHidden} className={buttonStyle}>
            {isPreprocessHidden ? "보이기" : "숨기기"}
          </button>
        </div>
        <div className={classNames(isPreprocessHidden ? "hidden" : "", "grid grid-cols-2 gap-1")}>
          {Object.values(ITEMS_PREPROCESS).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        <div className={classNames("flex flex-row justify-between")}>
          <span>모델 훈련 기능</span>
          <button ref={isTrainHiddenRef} type="button" onClick={handleHidden} className={buttonStyle}>
            {isTrainHidden ? "보이기" : "숨기기"}
          </button>
        </div>
        <div className={classNames(isTrainHidden ? "hidden" : "")}>
          {Object.values(ITEMS_TRAIN).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        <div className={classNames("flex flex-row justify-between")}>
          <span>모델 평가 기능</span>
          <button ref={isEvalHiddenRef} type="button" onClick={handleHidden} className={buttonStyle}>
            {isEvalHidden ? "보이기" : "숨기기"}
          </button>
        </div>
        <div className={classNames(isEvalHidden ? "hidden" : "")}>
          {Object.values(ITEMS_EVAL).map((sideBarItem, index) => (
            <SideBarItem key={sideBarItem.id} data={sideBarItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SideBar);
