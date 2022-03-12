import React, { useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { saveDf, showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

function SortValue({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // DOM 접근 위한 Ref
  const byRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingBy = (e) => {
    setParam({
      ...param,
      by: e,
    });
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

    // 축 선택에 맞는 값을 입력하지 않은 경우 입력칸에 포커스 주기
    if (param.by.length === 0) {
      byRef.current.focus();
      return;
    }

    const paramResult = {
      ...param,
      by: [...param.by.map((col) => col.value)],
    };
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.SortValue), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  const sortKinds = ["quicksort", "mergesort", "heapsort", "stable"];

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <label className="self-center">정렬 기준 컬럼</label>
          <MultiSelect
            ref={byRef}
            options={colObjArray}
            onChange={settingBy}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={param.by}
          />
        </div>

        <Select options={[0, 1]} optionText={["행", "열"]} name={"axis"} text="축 선택" onChange={handleChange} defaultValue={param.axis} />
        <Select
          options={[false, true]}
          optionText={["내림차순", "오름차순"]}
          name={"ascd"}
          text="정렬 순서"
          onChange={handleChange}
          defaultValue={param.ascd}
        />
        <Select options={sortKinds} name={"kind"} text="정렬 알고리즘" onChange={handleChange} defaultValue={param.kind} />
        <Select options={["last", "first"]} name={"na_pos"} text="정렬 시 결측치 위치" onChange={handleChange} defaultValue={param.na_pos} />
        <Switch name={"ig_idx"} text="인덱스 무시 여부" onChange={handleChange} checked={param.ig_idx} />
      </div>
    </form>
  );
}

export default SortValue;
