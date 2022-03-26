import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { showDataResult, saveDf, loadDf } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { Select, Switch } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "Components/MLML/MLComponents/Column";

function ConcatDf({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
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

  const [dfs, setDfs] = useState(getDfList());

  const [leftBlockId, setLeftBlockId] = useState(dfs[0]); // Select
  const [rightBlockId, setRightBlockId] = useState(dfs[0]); // Select

  // DOM 접근 위한 Ref
  const leftBlockIdRef = useRef();
  const rightBlockIdRef = useRef();

  useEffect(() => {
    setDfs(getDfList());
    const firstDf = getDfList()[0];

    leftBlockIdRef.current.value = firstDf;
    rightBlockIdRef.current.value = firstDf;
  }, [render]);

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

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.ConcatDf), param);
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
    setIsLoading(false); // 로딩 종료
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
          <Switch name={"ig_idx"} text="기존 인덱스 무시 : " onChange={handleChange} checked={param.ig_idx} />
          <Switch name={"veri_integ"} text="무결성 탐지 여부 : " onChange={handleChange} checked={param.veri_integ} />
          <Switch name={"sort"} text="정렬 여부 : " onChange={handleChange} checked={param.sort} />
          <Switch name={"copy"} text="복사 여부 : " onChange={handleChange} checked={param.copy} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(ConcatDf);
