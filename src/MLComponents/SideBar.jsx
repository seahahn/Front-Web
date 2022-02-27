import React from "react";
import SideBarItem from "./SideBarItem";
import { ITEMS_NEW_BLOCK, ITEMS_PREPROCESS, ITEMS_TRAIN, ITEMS_EVAL } from "./constants";

function SideBar({ addNewBlock }) {
  return (
    // 사이드바와 사이드바 내 아이템들
    <div className="sideBar w-1/5 overflow-y-scroll">
      <button type="button" onClick={addNewBlock}>
        블록 추가
      </button>
      {Object.values(ITEMS_NEW_BLOCK).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
      <hr />
      {Object.values(ITEMS_PREPROCESS).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
      <hr />
      {Object.values(ITEMS_TRAIN).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
      <hr />

      {Object.values(ITEMS_EVAL).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
    </div>
  );
}

export default React.memo(SideBar);
