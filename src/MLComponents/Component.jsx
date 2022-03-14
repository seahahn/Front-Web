import React, { useState, useContext, useEffect } from "react";
import { useDrag } from "react-dnd";
import classNames from "classnames";
import { ITEMS } from "./constants";
import * as AllCompo from "./CompoOptions";
import CompoResult from "./CompoResult";
import { componentBodyStyle, buttonStyle } from "MLComponents/componentStyle";
import { LayoutContext } from "MLComponents/Container";
import { BlockContext } from "MLComponents/Column";
import LoadingSpin from "react-loading-spin";

/*
data : initialData.layout으로부터 시작되어 내려온 데이터
compoType : Row로 구분되는 컴포넌트 타입(PREPROCESS, TRAIN, EVAL)
path : 컴포넌트의 위치를 구분하기 위한 경로
 */
const Component = ({ data, compoType, path }) => {
  const { layoutRef } = useContext(LayoutContext); // 프로젝트 전체 구조를 가지고 있는 컨텍스트
  const { blockId } = useContext(BlockContext); // 컬럼에 속한 모든 컴포넌트들에 블록 ID를 전달하기 위한 컨텍스트

  // 전체 프로젝트 구조 데이터 중 컴포넌트에 해당하는 부분만 따로 가져오기
  const compoRef =
    layoutRef.current.find((col) => col.id === blockId) &&
    layoutRef.current
      .find((col) => col.id === blockId)
      .children.find((row) => row.id === compoType)
      .children.find((compo) => compo.id === data.id);

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
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  // layout에 지정된 func에 해당되는 component를 가져옴
  const component = ITEMS[data.func];

  // 컴포넌트 출력 결과 영역의 숨김/표시 상태
  const [optionOpened, setOptionOpened] = useState(true);
  const [resultOpened, setResultOpened] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // 저장 중 상태
  const [render, setRender] = useState(false);

  const [compoParam, setCompoParam] = useState(data.param); // 컴포넌트 기능의 옵션 값 모음

  // 기능의 옵션 값 변경 시 프로젝트 구조 데이터에도 반영(저장 목적)
  useEffect(() => {
    if (compoRef && compoRef.hasOwnProperty("param")) {
      compoRef.param = compoParam;
    }
  }, [compoParam, compoRef]);

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
    "FeatureTargetSplit",
    "TrainTestSplit",
    "MergeDf",
    "ConcatDf",
    "MakePipeline",
    "MakeOptimizer",
    "Fit",
    "Transform",
    "ModelSteps",
    "Predict",
    "Score",
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
        <div className="flex flex-row space-x-1 items-center">
          {isLoading && (
            <div className="cursor-pointer" onClick={() => setIsLoading(false)}>
              <LoadingSpin size="1.5rem" />
            </div>
          )}
          <button type="submit" form={formId} className={classNames(isLoading && "hidden", buttonStyle)} disabled={isLoading}>
            실행
          </button>
          {/* <div className={classNames(!isLoading && "hidden", "flex justify-center items-center")}>
            <LoadingSpin />
          </div> */}
          <span>{component.id}</span>
          <button
            type="button"
            onClick={() => {
              console.log(layoutRef.current);
              console.log(compoRef);
            }}
            className={buttonStyle}>
            로그 확인
          </button>
        </div>
        <div className="space-x-2">
          <button className={buttonStyle} onClick={() => setRender(!render)}>
            새로 고침
          </button>
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
        <Options
          formId={formId}
          resultId={resultId}
          param={compoParam}
          setParam={setCompoParam}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          render={render}
        />
      </div>
      <div className={classNames(resultOpened ? "" : "hidden", "max-w-full")}>
        <CompoResult resultId={resultId} />
      </div>
    </div>
  );
};
export default React.memo(Component);
