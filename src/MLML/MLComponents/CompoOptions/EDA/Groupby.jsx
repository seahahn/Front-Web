import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { showDataResult, getColumns } from "MLML/MLComponents/CompoOptions/util";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLML/MLComponents/Column";

function Groupby({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const groupbyFuncs = ["sum", "count", "mean", "min", "max", "std", "median"];

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

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      by: [...param.by.map((col) => col.value)],
    };
    console.log(paramResult);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Groupby), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row mr-4 space-x-2">
          <label className="self-center">정렬 기준 컬럼</label>
          <MultiSelect options={colObjArray} onChange={settingBy} className="flex-1" isMulti={true} closeMenuOnSelect={false} defaultValue={param.by} />
          <Select
            className="flex-1 self-center justify-self-stretch"
            options={groupbyFuncs}
            name={"func"}
            text="계산 방식"
            onChange={handleChange}
            defaultValue={param.func}
          />
        </div>
        <div className="flex flex-col flex-1">
          <Select options={[0, 1]} optionText={["행", "열"]} name={"axis"} text="축 선택" onChange={handleChange} defaultValue={param.axis} />
          <Switch name={"as_index"} text="asIndex" onChange={handleChange} checked={param.as_index} />
          <Switch name={"sort"} text="sort" onChange={handleChange} checked={param.sort} />
          <Switch name={"group_keys"} text="groupKeys" onChange={handleChange} checked={param.group_keys} />
          <Switch name={"observed"} text="observed" onChange={handleChange} checked={param.observed} />
          <Switch name={"dropna"} text="dropNa" onChange={handleChange} checked={param.dropna} />
        </div>
      </div>
    </form>
  );
}

export default Groupby;
