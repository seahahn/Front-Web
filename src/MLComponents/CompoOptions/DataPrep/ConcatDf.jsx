import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult, getColumns, saveDf, loadDf } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLComponents/Column";

function ConcatDf({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  // 데이터프레임 목록 가져오기
  const dfs = [...Object.keys(storage)]
    .filter((df) => {
      return df.endsWith("_df"); // 맨 뒤 _df 붙은 데이터프레임만 가져오기
    })
    .map((df) => df.slice(0, -3)) // 목록에 표시하기 위해 _df 제거
    .reverse(); // 가장 처음에 저장된 것부터 나열하기 위해 reverse
  // console.log(dfs);

  const columns = getColumns(dfs[0]); // 데이터프레임 컬럼 목록 가져오기

  const joinWays = ["inner", "outer"];

  const [leftBlockId, setLeftBlockId] = useState(dfs[0]); // Select
  const [rightBlockId, setRightBlockId] = useState(dfs[0]); // Select
  const [axis, setAxis] = useState(0); // Select
  const [join, setJoin] = useState("outer"); // Select
  const [igIdx, setIgIdx] = useState(false); // 기존 인덱스 무시 여부 Switch
  const [keys, setKeys] = useState(""); // 각각의 데이터셋을 구분짓는 그룹명 input text
  const [names, setNames] = useState(""); // 멀티인덱스 각 레벨의 이름 input text
  const [veriInteg, setVeriInteg] = useState(false); // 무결성(데이터 중복 여부) 탐지 Switch
  const [sort, setSort] = useState(false); // outer일 때 정렬. inner일 때 효과 없음 Switch
  const [copy, setCopy] = useState(true); // Switch

  // DOM 접근 위한 Ref
  const leftBlockIdRef = useRef();
  const rightBlockIdRef = useRef();
  const axisRef = useRef();
  const joinRef = useRef();
  const igIdxRef = useRef();
  const keysRef = useRef();
  const namesRef = useRef();
  const veriIntegRef = useRef();
  const sortRef = useRef();
  const copyRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case leftBlockIdRef.current:
        setLeftBlockId(event.target.value);
        break;
      case rightBlockIdRef.current:
        setRightBlockId(event.target.value);
        break;
      case axisRef.current:
        setAxis(event.target.value);
        break;
      case joinRef.current:
        setJoin(event.target.value);
        break;
      case igIdxRef.current:
        setIgIdx(!igIdx);
        break;
      case keysRef.current:
        setKeys(!sort);
        break;
      case namesRef.current:
        setNames(event.target.value);
        break;
      case veriIntegRef.current:
        setVeriInteg(!veriInteg);
        break;
      case sortRef.current:
        setSort(!sort);
        break;
      case copyRef.current:
        setCopy(!copy);
        break;
      default:
        console.log("error");
        break;
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      axis: axis,
      join: join,
      ig_idx: igIdx,
      keys: keys,
      names: names,
      veri_integ: veriInteg,
      sort: sort,
      copy: copy,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.ConcatDf), params);
    const df = loadDf(leftBlockId, rightBlockId); // 선택된 데이터프레임(JSON) 2개 가져오기
    console.log(JSON.stringify(df));
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="grid grid-rows-2 grid-cols-2 space-2">
          <Select className="flex-1 self-center justify-self-stretch" options={dfs} ref={leftBlockIdRef} text="연결 기준 데이터셋" onChange={handleChange} />
          <Select className="flex-1 self-center justify-self-stretch" options={dfs} ref={rightBlockIdRef} text="연결 대상 데이터셋" onChange={handleChange} />
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={[0, 1]}
            optionText={["행", "열"]}
            ref={axisRef}
            text="축 선택"
            onChange={handleChange}
          />
          <Select className="flex-1 self-center justify-self-stretch" options={joinWays} ref={joinRef} text="연결 방식" onChange={handleChange} />
        </div>
        <div className="grid grid-rows-2 grid-cols-2 space-y-1">
          <label className="self-center">데이터셋 그룹명(쉼표로 구분)</label>
          <input ref={keysRef} className={inputStyle} type="text" onChange={handleChange} />
          <label className="self-center">멀티인덱스 각 레벨명(쉼표로 구분)</label>
          <input ref={namesRef} className={inputStyle} type="text" onChange={handleChange} />
        </div>
        <div className="grid grid-rows-2 grid-cols-2 space-2">
          <Switch ref={igIdxRef} text="기존 인덱스 무시 : " onChange={handleChange} checked={igIdx} />
          <Switch ref={veriIntegRef} text="무결성 탐지 여부 : " onChange={handleChange} checked={veriInteg} />
          <Switch ref={sortRef} text="정렬 여부 : " onChange={handleChange} checked={sort} />
          <Switch ref={copyRef} text="복사 여부 : " onChange={handleChange} checked={copy} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(ConcatDf);
