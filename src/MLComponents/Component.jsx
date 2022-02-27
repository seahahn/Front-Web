import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import classNames from "classnames";
import { COMPONENT, ITEMS } from "./constants";
import * as AllCompo from "./CompoOptions";
import CompoResult from "./CompoResult";
import { componentBodyStyle, buttonStyle } from "MLComponents/componentStyle";

/*
data : initialData.layout으로부터 시작되어 내려온 데이터
compoType : Row로 구분되는 컴포넌트 타입(PREPROCESS, TRAIN, EVAL)
path : 컴포넌트의 위치를 구분하기 위한 경로
 */
const Component = ({ data, compoType, path }) => {
  const [{ opacity }, drag, preview] = useDrag({
    type: compoType,
    item: {
      // Container 내에서 위치 이동 및 추가/삭제 시 사용되는 정보(handleDrop에서 사용)
      id: data.id,
      type: compoType,
      func: data.func,
      path: path,
    },
    collect: (monitor) => ({
      // isDragging: monitor.isDragging(),
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  // 컴포넌트 드래그할 때 해당 컴포넌트의 투명도 조절
  // const opacity = isDragging ? 0 : 1;
  // drag(ref);

  // layout에 지정된 func에 해당되는 component를 가져옴
  const component = ITEMS[data.func];

  // 컴포넌트 출력 결과 영역의 숨김/표시 상태
  const [optionOpened, setOptionOpened] = useState(true);
  const [resultOpened, setResultOpened] = useState(true);

  // 컴포넌트의 기능에 맞춰 옵션 영역 집어넣기
  const OptionList = [
    "DataUpload",
    "Head",
    "Tail",
    "Shape",
    "Dtype",
    "ColumnList",
    "Unique",
    "IsNa",
    "Corr",
    "Describe",
    "ColConditionDf",
    "LocDf",
    "ILocDf",
    "Transpose",
    "Groupby",
    "Drop",
    "DropNa",
    "RenameCol",
    "SortValue",
    "SetColumn",
    "BoxPlot",
    "HistPlot",
    "CountPlot",
    "ScatterPlot",
  ];
  let Options = AllCompo[data.func];
  if (!OptionList.includes(data.func)) {
    Options = AllCompo["DataUpload"];
  }

  // 각각의 컴포넌트의 고유값에 맞춰 옵션과 결과 영역 고유값 지정(다른 컴포넌트에 결과 출력 방지)
  const formId = "form" + data.id;
  const resultId = "result" + data.id;

  return (
    // 전체 컴포넌트 영역
    <div ref={preview} style={{ opacity }} className={componentBodyStyle}>
      {/* 메인 영역 */}
      <div ref={drag} className="flex justify-between my-2 cursor-move">
        <div>
          <button type="submit" form={formId} className={buttonStyle}>
            실행
          </button>
          <span>{component.id}</span>
        </div>
        <div>
          <button className={buttonStyle} onClick={() => setOptionOpened(!optionOpened)}>
            {optionOpened ? "옵션 숨김" : "옵션 표시"}
          </button>
          <button className={buttonStyle} onClick={() => setResultOpened(!resultOpened)}>
            {resultOpened ? "결과 숨김" : "결과 표시"}
          </button>
        </div>
      </div>

      {/* 옵션 & 출력 영역 */}
      <div className={classNames(optionOpened ? "my-2" : "hidden", "max-w-full")}>
        <Options formId={formId} resultId={resultId} />
      </div>
      <div className={classNames(resultOpened ? "" : "hidden", "max-w-full")}>
        <CompoResult resultId={resultId} />
      </div>
    </div>
  );
};
export default Component;
