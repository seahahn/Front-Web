import React, { useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import DropZone from "./DropZone";
import TrashDropZone from "./TrashDropZone";
import SideBarItem from "./SideBarItem";
import Row from "./Row";
import initialData from "./initial-data";
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

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath} // 각각의 row마다 자신의 index를 경로로 가짐
      />
    );
  };

  const [zoomEnabled, setZoomEnabled] = useState(true)
  const test = {
    display: 'flex',
    flexDirection: 'column'
  }
  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="flex flex-row">
      <div className="flex flex-col grow">
      <TransformWrapper limitToBounds={false} disabled={zoomEnabled} wrapperStyle={test}>
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <Toolbox>
              <button onClick={() => setZoomEnabled(!zoomEnabled)}>Move</button>
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
            </Toolbox>
            <TransformComponent >
            <div className="page">

              {/* layout 데이터에서 row 하나씩 내놓음. 한 row에 한 index */}
              {layout.map((row, index) => {
                const currentPath = `${index}`; // index는 현재 경로로 지정됨

                return (
                  <React.Fragment key={row.id}>
                    {/* row 하나마다 위에 DropZone 놔둠 */}
                    <DropZone
                      data={{
                        path: currentPath,
                        childrenCount: layout.length
                      }}
                      onDrop={handleDrop}
                      path={currentPath}
                    />
                    {/* row 데이터 하나씩 전달하여 row 생성
                    동시에 각각의 row의 index를 전달하여 해당 row의 경로로 지정 */}
                    {renderRow(row, currentPath)}
                  </React.Fragment>
                );
              })}
              {/* row 다 추가하고 나면 마지막으로 맨 아래에 DropZone 놔둠
              (맨 아래에도 row를 새로 추가할 수 있게 해야 함) */}
              <DropZone
                data={{
                  path: `${layout.length}`,
                  childrenCount: layout.length
                }}
                onDrop={handleDrop}
                isLast
              />
            </div>
            </TransformComponent>

          </React.Fragment>
        )}
      </TransformWrapper>
        <TrashDropZone
          data={{
            layout
          }}
          onDrop={handleDropToTrashBin}
        />
      </div>

      <div className="sideBar">
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
    </div>
  );
};
export default Container;
