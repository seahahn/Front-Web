import React, { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import classNames from "classnames";
import TrashDropZone from "MLComponents/TrashDropZone";
import SideBar from "MLComponents/SideBar";
import Column from "MLComponents/Column";
import initialData from "MLComponents/initial-data-test"; // COLUMN-ROW-COMPONENT
import initialBlockForm from "MLComponents/initial-data-form"; // 새로운 블록 생성 폼
import { handleMoveWithinParent, handleMoveToDifferentParent, handleMoveSidebarComponentIntoParent, handleRemoveItemFromLayout } from "MLComponents/helpers";
import styled from "styled-components";

import { SIDEBAR_ITEM, COLUMN } from "MLComponents/constants";
import shortid from "shortid";

const Toolbox = styled.div`
  display: flex;
  position: fixed;
  z-index: 5;
  justify-content: center;
  width: 80%;
  button {
    padding: 10px 5px;
    width: 5rem;
    font-size: 0.8em;
    border: 1px solid #ccc;
  }
  button:hover {
    color: #008cba;
  }
`;

const Container = () => {
  const initialLayout = initialData.layout; // 현재 더미 데이터 -> 이후 MongoDB에서 사용자의 프로젝트에 맞는 데이터 가져와야 함
  const [layout, setLayout] = useState(initialLayout);
  const [movingEnabled, setMovingEnabled] = useState(false); // 마우스 휠, 드래그 등을 이용한 작업 영역 위치 조정 가능 여부 상태

  // TrashDropZone에 아이템 드랍 시 아이템 삭제 기능
  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  // DropZone에 아이템 드랍 시 아이템 추가 기능
  const handleDrop = useCallback(
    (dropZone, item) => {
      console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type, func: item.func };
      // console.log('newItem id type', newItem);
      // if (item.type === COLUMN) {
      //   newItem.children = item.children;
      // }

      // 사이드바로부터 컴포넌트 가져와서 추가하는 경우
      if (item.type.includes(SIDEBAR_ITEM)) {
        // if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        // const newComponent = {
        //   id: shortid.generate(),
        //   ...item.component
        // };

        // 실제로 Container에 추가된 컴포넌트의 정보
        const newItem = {
          id: shortid.generate(), // layout에 포함되기 위해 새로운 id를 생성
          type: item.type, // 전처리 / 훈련 / 평가 구분하기 위한 값
          func: item.func, // 사이드바 아이템의 func가 어떤 기능인지 나타냄
        };
        // setComponents({
        //   ...components,
        //   [newComponent.id]: newComponent
        // });

        setLayout(handleMoveSidebarComponentIntoParent(layout, splitDropZonePath, newItem));
        // console.log(layout);
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");
      // console.log('splitItemPath', splitItemPath)
      // console.log('pathToItem', pathToItem)

      // 2. 단순 이동인 경우
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          // console.log('move within parent');
          setLayout(handleMoveWithinParent(layout, splitDropZonePath, splitItemPath));
          // console.log(layout);
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        // console.log('move different parent');
        setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
        // console.log(layout);
        return;
      }

      // 3. Move + Create
      // setLayout(
      //   handleMoveToDifferentParent(
      //     layout,
      //     splitDropZonePath,
      //     splitItemPath,
      //     newItem
      //   )
      // );
    },
    [layout]
  );

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        // components={components}
        handleDrop={handleDrop}
        path={currentPath}
        removeBlock={removeBlock}
      />
    );
  };

  // 새로운 블록 추가 기능
  const addNewBlock = useCallback(() => {
    const newBlock = {
      type: COLUMN,
      id: shortid.generate(),
      children: initialBlockForm.newBlock.children,
    };
    console.log([...layout, newBlock]);
    setLayout([...layout, newBlock]);
  }, [layout]);

  // 블록 삭제 기능
  const removeBlock = useCallback(
    (event) => {
      // console.log(event.target.value);
      const newLayout = layout.filter((value, index, arr) => {
        // console.log(value.id, index, arr);
        return value.id !== event.target.value;
      });

      setLayout(newLayout);
    },
    [layout]
  );

  return (
    <div className="flex flex-row h-full mt-16">
      <div className="flex flex-col bg-slate-700">
        {/* 요소 확대/축소 및 위치 이동 기능을 넣기 위한 Wrapper */}
        <TransformWrapper minScale={0.1} maxScale={2} limitToBounds={false} disabled={!movingEnabled}>
          {/* 확대 / 축소 / 원 위치 이동 함수 넣기 */}
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <React.Fragment>
              <Toolbox>
                {/* 위치 이동 가능 여부를 설정할 수 있는 버튼 추가 */}
                <button
                  className={classNames(movingEnabled ? "bg-green-500" : "bg-green-50", "rounded-bl-lg")}
                  onClick={() => setMovingEnabled(!movingEnabled)}>
                  Move
                </button>
                {/* 확대 / 축소 / 원 위치 이동을 위한 버튼 */}
                <button className="bg-green-50" onClick={() => zoomIn(0.2)}>
                  Zoom In
                </button>
                <button className="bg-green-50" onClick={() => zoomOut(0.2)}>
                  Zoom Out
                </button>
                <button className="bg-green-50 rounded-br-lg" onClick={() => resetTransform()}>
                  Reset
                </button>
              </Toolbox>
              {/* TransformComponent 안의 컴포넌트가 실제로 확대 / 축소 / 위치 이동 기능이 적용되는 대상임 */}
              <TransformComponent>
                <div className="page columns h-full">
                  {/* layout 데이터에서 column 하나씩 내놓음. 한 column에 한 index */}
                  {layout.map((column, index) => {
                    const currentPath = `${index}`; // index는 현재 경로로 지정됨
                    return (
                      <React.Fragment key={column.id}>
                        {/* column 하나마다 좌측에 TrashDropZone 놔둠 */}
                        <TrashDropZone data={{ layout }} onDrop={handleDropToTrashBin} />
                        {/* column 데이터 하나씩 전달하여 column 생성
                        동시에 각각의 column의 index를 전달하여 해당 column의 경로로 지정 */}
                        {renderColumn(column, currentPath)}
                      </React.Fragment>
                    );
                  })}
                  {/* layout.length === 0 이면 새로운 블록 추가 요청 메시지 보이기 */}
                  {layout.length === 0 ? (
                    <div className="fixed top-0 bottom-0 left-0 right-0 text-5xl text-cyan-200 flex justify-center items-center">
                      <h1>블록을 추가해주세요!</h1>
                    </div>
                  ) : null}
                  {/* column 다 추가하고 나면 마지막으로 맨 오른쪽에 TrashDropZone 추가 */}
                  <TrashDropZone data={{ layout }} onDrop={handleDropToTrashBin} />
                </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
      {/* 사이드바와 사이드바 내 아이템들 */}
      <SideBar addNewBlock={addNewBlock} />
    </div>
  );
};
export default React.memo(Container);
