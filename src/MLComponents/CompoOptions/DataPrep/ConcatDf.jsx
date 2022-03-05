import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult, saveDf, loadDf } from "MLComponents/CompoOptions/util";
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

  const [leftBlockId, setLeftBlockId] = useState(dfs[0]); // Select
  const [rightBlockId, setRightBlockId] = useState(dfs[0]); // Select

  const [params, setParams] = useState({
    axis: 0, // Select
    join: "outer", // Select
    ig_idx: false, // 기존 인덱스 무시 여부 Switch
    keys: "", // 각각의 데이터셋을 구분짓는 그룹명 input text
    names: "", // 멀티인덱스 각 레벨의 이름 input text
    veri_integ: false, // 무결성(데이터 중복 여부) 탐지 Switch
    sort: false, // outer일 때 정렬. inner일 때 효과 없음 Switch
    copy: true, // Switch
  });

  // DOM 접근 위한 Ref
  const leftBlockIdRef = useRef();
  const rightBlockIdRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setParams({
        ...params,
        [name]: checked,
      });
    } else {
      setParams({
        ...params,
        [name]: value,
      });
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

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
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={dfs}
            ref={leftBlockIdRef}
            text="연결 기준 데이터셋"
            onChange={(e) => setLeftBlockId(e.target.value)}
          />
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={dfs}
            ref={rightBlockIdRef}
            text="연결 대상 데이터셋"
            onChange={(e) => setRightBlockId(e.target.value)}
          />
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={[0, 1]}
            optionText={["행", "열"]}
            name={"axis"}
            text="축 선택"
            onChange={handleChange}
          />
          <Select className="flex-1 self-center justify-self-stretch" options={["outer", "inner"]} name={"join"} text="연결 방식" onChange={handleChange} />
        </div>
        <div className="grid grid-rows-2 grid-cols-2 space-y-1">
          <label className="self-center">데이터셋 그룹명(쉼표로 구분)</label>
          <input name={"keys"} className={inputStyle} type="text" onChange={handleChange} />
          <label className="self-center">멀티인덱스 각 레벨명(쉼표로 구분)</label>
          <input name={"names"} className={inputStyle} type="text" onChange={handleChange} />
        </div>
        <div className="grid grid-rows-2 grid-cols-2 space-2">
          <Switch name={"ig_idx"} text="기존 인덱스 무시 : " onChange={handleChange} checked={params.ig_idx} />
          <Switch name={"veri_integ"} text="무결성 탐지 여부 : " onChange={handleChange} checked={params.veri_integ} />
          <Switch name={"sort"} text="정렬 여부 : " onChange={handleChange} checked={params.sort} />
          <Switch name={"copy"} text="복사 여부 : " onChange={handleChange} checked={params.copy} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(ConcatDf);
