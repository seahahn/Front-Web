import React, { useRef, createContext } from "react";
import Row from "Components/MLML/MLComponents/Row";
import { negButtonStyle } from "Components/MLML/MLComponents/componentStyle";

export const BlockContext = createContext(); // 해당 블록에 속한 모든 컴포넌트들에 블록 ID를 전달하기 위한 컨텍스트

const Column = ({ data, handleDrop, path, removeBlock }) => {
  const blockId = data.id; // 블록의 ID

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
    <div ref={ref} className="border border-black bg-slate-300 column flex-auto p-2 max-w-full rounded-lg">
      <div className="flex flex-row justify-between px-2">
        <span>{data.id}</span>
        <button type="button" onClick={removeBlock} value={data.id} className={negButtonStyle}>
          블록 삭제
        </button>
      </div>
      <BlockContext.Provider value={{ blockId }}>
        {data.children.map((row, index) => {
          const currentPath = `${path}-${index}`;

          return <React.Fragment key={row.id}>{renderRow(row, currentPath)}</React.Fragment>;
        })}
      </BlockContext.Provider>
    </div>
  );
};
export default React.memo(Column);
