import React, { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import DropZone from "./DropZone";
import TrashDropZone from "./TrashDropZone";
// import SideBarItem from "./SideBarItem";
import SideBar from "./SideBar";
// import Row from "./Row";
import Column from "./Column";
// import initialData from "./initial-data"; ROW-COLUMN-COMPONENT
import initialData from "./initial-data-test"; // COLUMN-ROW-COMPONENT
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout
} from "./helpers";
import styled from "styled-components";

import { SIDEBAR_ITEMS, SIDEBAR_ITEM, COMPONENT, COLUMN, ITEMS_EDA,  ITEMS_TRAIN,  ITEMS_EVAL } from "./constants";
import shortid from "shortid";

const Toolbox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: calc(100vw - 60px);
  margin-bottom: 10px;
  button {
    margin-left: 10px;
    width: 2em;
  }
`;

const Container = () => {
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      console.log('dropZone', dropZone)
      console.log('item', item)

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component
        };
        const newItem = {
          id: newComponent.id,
          type: COMPONENT
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );

  // const renderRow = (row, currentPath) => {
  //   return (
  //     <Row
  //       key={row.id}
  //       data={row}
  //       handleDrop={handleDrop}
  //       components={components}
  //       path={currentPath} // 각각의 row마다 자신의 index를 경로로 가짐
  //     />
  //   );
  // };

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        path={currentPath}
      />
    );
  };

  const [movingEnabled, setMovingEnabled] = useState(true)
  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="flex flex-row">
      <div className="flex flex-col grow">
        {/* 요소 확대/축소 및 위치 이동 기능을 넣기 위한 Wrapper */}
        <TransformWrapper limitToBounds={false} disabled={movingEnabled}>
        {/* 확대 / 축소 / 원 위치 이동 함수 넣기 */}
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <React.Fragment>
              <Toolbox>
                {/* 별도로 위치 이동 가능 여부를 설정할 수 있는 버튼 추가 */}
                <button onClick={() => setMovingEnabled(!movingEnabled)}>Move</button>
                {/* 확대 / 축소 / 원 위치 이동을 위한 버튼 */}
                <button onClick={() => zoomIn()}>+</button>
                <button onClick={() => zoomOut()}>-</button>
                <button onClick={() => resetTransform()}>x</button>
              </Toolbox>

              {/* TransformComponent 안의 컴포넌트가 실제로 확대 / 축소 / 위치 이동 기능이 적용되는 대상임 */}
              <TransformComponent >
              <div className="page">

                <div className="columns">
                  {/* layout 데이터에서 column 하나씩 내놓음. 한 column에 한 index */}
                  {layout.map((column, index) => {
                    const currentPath = `${index}`; // index는 현재 경로로 지정됨

                    return (
                      <React.Fragment key={column.id}>
                        {/* column 하나마다 좌측에 DropZone 놔둠 */}
                        <DropZone
                          data={{
                            path: currentPath,
                            childrenCount: layout.length
                          }}
                          onDrop={handleDrop}
                          className="horizontalDrag"
                          path={currentPath}
                        />
                        {/* row 데이터 하나씩 전달하여 row 생성
                        동시에 각각의 row의 index를 전달하여 해당 row의 경로로 지정 */}
                        {renderColumn(column, currentPath)}
                      </React.Fragment>
                    );
                  })}
                  {/* column 다 추가하고 나면 마지막으로 맨 오른쪽에 DropZone 추가
                  (맨 오른쪽에도 column을 새로 추가할 수 있게 해야 함) */}
                  <DropZone
                    data={{
                      path: `${layout.length}`,
                      childrenCount: layout.length
                    }}
                    onDrop={handleDrop}
                    className="horizontalDrag"
                    isLast
                  />
                </div>
              </div>
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>

        {/* 컴포넌트 삭제를 위한 TrashZone */}
        <TrashDropZone
          data={{
            layout
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>

      {/* 사이드바와 사이드바 내 아이템들 */}
      <SideBar/>

    </div>
  );
};
export default Container;
