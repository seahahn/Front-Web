import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, ROW, COLUMN } from "./constants";
import {  handleRemoveItemFromLayout} from "./helpers";
import Container from "./Container";

const ACCEPTS = [ROW, COLUMN, COMPONENT];

// data는 layout, onDrop는 handleDropToTrashBin
const TrashDropZone = ({ data, onDrop }) => {

  // const handleDropToTrashBin = useCallback(
  //   (dropZone, item) => {
  //     const splitItemPath = item.path.split("-");
  //     setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
  //   },
  //   [layout]
  // );

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const layout = data.layout;
      const itemPath = item.path;
      const splitItemPath = itemPath.split("-");
      const itemPathRowIndex = splitItemPath[0];
      const itemRowChildrenLength =
        layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

      // prevent removing a col when row has only one col
      if (
        item.type === COLUMN &&
        itemRowChildrenLength &&
        itemRowChildrenLength < 2
      ) {
        return false;
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames("trashDropZone", { active: isActive })}
      ref={drop}
    >
      {/* TRASH */}
      <Container/>
    </div>
  );
};
export default TrashDropZone;
