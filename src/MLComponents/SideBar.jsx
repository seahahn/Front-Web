import React from 'react'
import SideBarItem from "./SideBarItem";
import { SIDEBAR_ITEMS, ITEMS_EDA,  ITEMS_TRAIN,  ITEMS_EVAL } from "./constants";

function SideBar() {
  return (
    // 사이드바와 사이드바 내 아이템들
    <div className="sideBar w-1/5 overflow-y-scroll">
      {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
      <hr/>
      {Object.values(ITEMS_EDA).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
      <hr/>
      {Object.values(ITEMS_TRAIN).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      <hr/>

      {Object.values(ITEMS_EVAL).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      <hr/>
      {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
        <SideBarItem key={sideBarItem.id} data={sideBarItem} />
      ))}
  </div>
  )
}

export default SideBar