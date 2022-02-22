import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import classNames from "classnames";
import { COMPONENT, ITEMS } from "./constants";
import * as AllCompo from "./CompoOptions";

/*
data : initialData.layout으로부터 시작되어 내려온 데이터
compoType : Row로 구분되는 컴포넌트 타입(PREPROCESS, TRAIN, EVAL)
path : 컴포넌트의 위치를 구분하기 위한 경로
 */
const Component = ({ data, compoType, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: compoType,
    item: {
      // Container 내에서 위치 이동 및 추가/삭제 시 사용되는 정보(handleDrop에서 사용)
      id: data.id,
      type: compoType,
      func: data.func,
      path: path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 컴포넌트 드래그할 때 해당 컴포넌트의 투명도 조절
  const opacity = isDragging ? 0 : 1;
  drag(ref);

  // layout에 지정된 func에 해당되는 component를 가져옴
  const component = ITEMS[data.func];

  // 컴포넌트 출력 결과 영역의 숨김/표시 상태
  const [outputOpened, setOutputOpened] = useState(true);

  // 버튼 클릭 시 컴포넌트에 해당하는 기능 실행하기
  const funcExec = (id) => {
    console.log(`기능 실행 ${id}`);
  };

  // 컴포넌트의 기능에 맞춰 옵션 영역 집어넣기
  const Options = AllCompo["DataUpload"];
  // const Options = AllCompo[data.func];

  return (
    // 전체 컴포넌트 영역
    <div ref={ref} style={{}} className="flex flex-col h-auto bg-sky-50 px-4 py-2 cursor-move border-dashed border-2 border-sky-500 draggable rounded-lg">
      {/* 메인 영역 */}
      <div className="flex justify-between">
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => funcExec(component.title)}>
            실행
          </button>
          <span>기능명 - {component.id}</span>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOutputOpened(!outputOpened)}>
          옵션 숨김
        </button>
      </div>

      {/* 옵션 & 출력 영역 */}
      <div className={classNames(outputOpened ? "" : "hidden", "mt-4")}>
        <Options />
      </div>
    </div>
  );
};
export default Component;
