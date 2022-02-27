import React, { useRef } from "react";
import Row from "MLComponents/Row";
import { negButtonStyle } from "MLComponents/componentStyle";

const Column = ({ data, handleDrop, path, removeBlock }) => {
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
    <div ref={ref} className="base column max-w-full rounded-lg">
      <div className="flex flex-row justify-between">
        <span>{data.id}</span>
        <button type="button" onClick={removeBlock} value={data.id} className={negButtonStyle}>
          블록 삭제
        </button>
      </div>

      {data.children.map((row, index) => {
        const currentPath = `${path}-${index}`;

        return <React.Fragment key={row.id}>{renderRow(row, currentPath)}</React.Fragment>;
      })}
    </div>
  );
};
export default React.memo(Column);
