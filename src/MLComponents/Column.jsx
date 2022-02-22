import React, { useRef } from "react";
import Row from "./Row";

const Column = ({ data, handleDrop, path }) => {
  const ref = useRef(null);

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        path={currentPath} // 각각의 row마다 자신의 index를 경로로 가짐
      />
    );
  };

  return (
    <div ref={ref} className="base column rounded-lg">
      {data.id}
      {data.children.map((row, index) => {
        const currentPath = `${path}-${index}`;

        return <React.Fragment key={row.id}>{renderRow(row, currentPath)}</React.Fragment>;
      })}
    </div>
  );
};
export default Column;
