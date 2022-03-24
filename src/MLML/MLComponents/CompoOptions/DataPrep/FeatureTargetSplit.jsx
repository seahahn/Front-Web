import React, { useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { getColumns, saveFeatureTarget, showDataResult } from "MLML/MLComponents/CompoOptions/util";
import MultiSelect from "react-select";
import { BlockContext } from "MLML/MLComponents/Column";

function FeatureTargetSplit({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const colsRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setParam({
      ...param,
      cols: e,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 입력해야 할 파라미터가 있는지 확인
    if (param.cols.length === 0) {
      // 생성 또는 변경할 컬럼명 입력 여부 확인
      colsRef.current.focus();
      return;
    }
    const paramResult = {
      cols: [...param.cols.map((col) => col.value)],
    };
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.FeatureTargetSplit), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveFeatureTarget(blockId, data);
        showDataResult(dfd, JSON.parse(data).X, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row items-center">
        <span className="mr-2">타겟 컬럼 선택</span>
        <MultiSelect
          ref={colsRef}
          options={colObjArray}
          onChange={settingCols}
          className="flex-1"
          isMulti={true}
          closeMenuOnSelect={false}
          defaultValue={param.cols}
        />
      </div>
    </form>
  );
}

export default FeatureTargetSplit;
