import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { showDataResult, getColumns, saveDf, loadDf } from "MLML/MLComponents/CompoOptions/util";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLML/MLComponents/Column";

function MergeDf({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  // 데이터프레임 목록 가져오기 위한 콜백
  const getDfList = useCallback(() => {
    return [...Object.keys(storage)]
      .filter((df) => {
        return df.endsWith("_df"); // 맨 뒤 _df 붙은 데이터프레임만 가져오기
      })
      .map((df) => df.slice(0, -3)) // 목록에 표시하기 위해 _df 제거
      .reverse(); // 가장 처음에 저장된 것부터 나열하기 위해 reverse
  }, [storage]);

  const columns = getDfList().length > 0 ? getColumns(getDfList()[0]) : []; // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const howWays = ["inner", "outer", "left", "right", "cross"];
  const validateOptions = ["1:1", "1:m", "m:1", "m:m"];

  const [dfs, setDfs] = useState(getDfList());

  const [leftBlockId, setLeftBlockId] = useState(dfs[0]); // Select
  const [rightBlockId, setRightBlockId] = useState(dfs[0]); // Select

  const [allBlockCols, setAllBlockCols] = useState(colObjArray); // on 선택 목록(두 데이터프레임의 공통 컬럼)
  const [leftBlockCols, setLeftBlockCols] = useState(colObjArray); // leftOn 선택 목록
  const [rightBlockCols, setRightBlockCols] = useState(colObjArray); // rightOn 선택 목록

  // DOM 접근 위한 Ref
  const leftBlockIdRef = useRef();
  const rightBlockIdRef = useRef();
  const allBlockColsRef = useRef();
  const leftBlockColsRef = useRef();
  const rightBlockColsRef = useRef();
  // console.log(param);
  useEffect(() => {
    if (getDfList().length > 0) {
      setDfs(getDfList());

      const firstDf = getDfList()[0];
      const blockColumns = [...getColumns(firstDf).map((column) => ({ label: column, value: column }))];
      setAllBlockCols(blockColumns); // 두 데이터프레임의 공통 컬럼 선택 목록
      setLeftBlockCols(blockColumns);
      setRightBlockCols(blockColumns);

      setLeftBlockId(firstDf);
      setRightBlockId(firstDf);

      leftBlockIdRef.current.value = firstDf;
      rightBlockIdRef.current.value = firstDf;
      allBlockColsRef.current.clearValue();
      leftBlockColsRef.current.clearValue();
      rightBlockColsRef.current.clearValue();

      // console.log("useEffect setParam");
      setParam({
        ...param,
        on: [],
        left_on: [],
        right_on: [],
      });
    }
  }, [render]);

  // 컬럼 선택(MultiSelect)
  const settingOn = (e) => {
    setParam({
      ...param,
      on: [...e.map((col) => col.value)],
    });
  };
  const settingLeftOn = (e) => {
    setParam({
      ...param,
      left_on: [...e.map((col) => col.value)],
    });
  };
  const settingRightOn = (e) => {
    setParam({
      ...param,
      right_on: [...e.map((col) => col.value)],
    });
  };

  const handleBlockCols = (event) => {
    switch (event.target) {
      case leftBlockIdRef.current:
        setLeftBlockId(event.target.value);
        const block1Columns = [...getColumns(event.target.value).map((column) => ({ label: column, value: column }))];
        setLeftBlockCols(block1Columns);
        setAllBlockCols(
          block1Columns.filter((col) => {
            return rightBlockCols.some((elem) => elem.label === col.label);
          })
        ); // 두 데이터프레임의 공통 컬럼 선택 목록
        break;
      case rightBlockIdRef.current:
        setRightBlockId(event.target.value);
        const block2Columns = [...getColumns(event.target.value).map((column) => ({ label: column, value: column }))];
        setRightBlockCols(block2Columns);
        setAllBlockCols(
          leftBlockCols.filter((col) => {
            return block2Columns.some((elem) => elem.label === col.label);
          })
        ); // 두 데이터프레임의 공통 컬럼 선택 목록
        break;
      default:
        console.log("error");
        break;
    }
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setParam({
        ...param,
        [name]: checked,
      });
    } else {
      setParam({
        ...param,
        [name]: value,
      });
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    const paramResult = {
      ...param,
      on: param.on.length > 0 ? param.on : "",
      left_on: param.left_on.length > 0 ? param.left_on : "",
      right_on: param.right_on.length > 0 ? param.right_on : "",
    };
    console.log(paramResult);

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.MergeDf), paramResult);
    const df = loadDf(leftBlockId, rightBlockId); // 선택된 데이터프레임(JSON) 2개 가져오기
    console.log(JSON.stringify(df));
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        data.startsWith("{") && saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <Select className="flex-1 self-center justify-self-stretch" options={dfs} ref={leftBlockIdRef} text="병합 기준 데이터셋" onChange={handleBlockCols} />
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={dfs}
            ref={rightBlockIdRef}
            text="병합 대상 데이터셋"
            onChange={handleBlockCols}
          />
          <Select className="flex-1 self-center justify-self-stretch" options={howWays} name={"how"} text="병합 방식" onChange={handleChange} />
        </div>
        <div className="grid grid-rows-3 grid-cols-2">
          <label className="self-center">병합 대상 컬럼(양쪽 DataFrame에 다 있어야 함)</label>
          <MultiSelect ref={allBlockColsRef} options={allBlockCols} onChange={settingOn} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
          <label className="self-center">병합 대상 컬럼(왼쪽)</label>
          <MultiSelect ref={leftBlockColsRef} options={leftBlockCols} onChange={settingLeftOn} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
          <label className="self-center">병합 대상 컬럼(오른쪽)</label>
          <MultiSelect ref={rightBlockColsRef} options={rightBlockCols} onChange={settingRightOn} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div className="flex flex-row space-x-2">
          <Switch name={"left_index"} text="leftIndex : " onChange={handleChange} checked={param.left_index} />
          <Switch name={"right_index"} text="rightIndex : " onChange={handleChange} checked={param.right_index} />
          <Switch name={"sort"} text="sort : " onChange={handleChange} checked={param.sort} />
        </div>
        <div className="grid grid-rows-2 grid-cols-2 space-y-1">
          <label className="self-center">왼쪽 데이터프레임 컬럼 접미사</label>
          <input name={"left_suf"} className={inputStyle} type="text" onChange={handleChange} />
          <label className="self-center">오른쪽 데이터프레임 컬럼 접미사</label>
          <input name={"right_suf"} className={inputStyle} type="text" onChange={handleChange} />
        </div>
        <div className="flex flex-row space-x-2">
          <Switch name={"copy"} text="copy" onChange={handleChange} checked={param.copy} />
          <Switch name={"indicator"} text="indicator" onChange={handleChange} checked={param.indicator} />
        </div>
        <Select className="flex-1 justify-self-stretch" options={validateOptions} name={"validate"} text="validate" onChange={handleChange} />
      </div>
    </form>
  );
}

export default React.memo(MergeDf);
