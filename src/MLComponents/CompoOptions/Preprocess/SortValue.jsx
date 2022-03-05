import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { saveDf, showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

function SortValue({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [params, setParams] = useState({
    by: [], // MultiSelect
    axis: 0, // Select
    ascd: true, // Select
    kind: "quicksort", // Select
    na_pos: "last", // Select
    ig_idx: false, // Switch
  });

  // DOM 접근 위한 Ref
  const byRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingBy = (e) => {
    setParams({
      ...params,
      by: [...e.map((col) => col.value)],
    });
  };

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

    // 축 선택에 맞는 값을 입력하지 않은 경우 입력칸에 포커스 주기
    if (params.by.length === 0) {
      byRef.current.focus();
      return;
    }
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.SortValue), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  const sortKinds = ["quicksort", "mergesort", "heapsort", "stable"];

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <label className="self-center">정렬 기준 컬럼</label>
          <MultiSelect ref={byRef} options={colObjArray} onChange={settingBy} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>

        <Select options={[0, 1]} optionText={["행", "열"]} name={"axis"} text="축 선택" onChange={handleChange} />
        <Select options={[true, false]} optionText={["오름차순", "내림차순"]} name={"ascd"} text="정렬 순서" onChange={handleChange} />
        <Select options={sortKinds} name={"kind"} text="정렬 알고리즘" onChange={handleChange} />
        <Select options={["last", "first"]} name={"na_pos"} text="정렬 시 결측치 위치" onChange={handleChange} />
        <Switch name={"ig_idx"} text="인덱스 무시 여부" onChange={handleChange} checked={params.ig_idx} />
      </div>
    </form>
  );
}

export default SortValue;
