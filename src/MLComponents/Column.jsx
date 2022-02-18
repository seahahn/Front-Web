import React, { useRef } from "react";
import Row from "./Row";

const style = {};
const Column = ({ data, components, handleDrop, path }) => {
  const ref = useRef(null);

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

  return (
    <div ref={ref} style={{ ...style }} className="base column">
      {data.id}
      {data.children.map((row, index) => {
        const currentPath = `${path}-${index}`;

        return (
          <React.Fragment key={row.id}>
            {renderRow(row, currentPath)}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Column;
