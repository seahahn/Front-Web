import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { getColumns, saveFeatureTarget, showDataResult } from "MLComponents/CompoOptions/util";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

function FeatureTargetSplit({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [cols, setCols] = useState([]); // 타겟 컬럼 MultiSelect

  const colsRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    // console.log(e);
    setCols([...e.map((col) => col.value)]);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = { cols: cols }; // 입력해야 할 파라미터 설정
    // 입력해야 할 파라미터가 있는지 확인
    if (cols.length === 0) {
      // 생성 또는 변경할 컬럼명 입력 여부 확인
      colsRef.current.focus();
      return;
    }
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.FeatureTargetSplit), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        saveFeatureTarget(blockId, data);
        showDataResult(dfd, JSON.parse(data).X, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row items-center">
        <span className="mr-2">타겟 컬럼 선택</span>
        <MultiSelect ref={colsRef} options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
      </div>
    </form>
  );
}

export default React.memo(FeatureTargetSplit);
