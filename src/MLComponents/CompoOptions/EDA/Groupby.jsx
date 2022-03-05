import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

function Groupby({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const groupbyFuncs = ["sum", "count", "mean", "min", "max", "std", "median"];

  const [params, setParams] = useState({
    by: columns[0],
    func: groupbyFuncs[0],
    axis: 0,
    as_index: true,
    sort: true,
    group_keys: true,
    observed: false,
    dropna: true,
  });

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

    // 백앤드 전송을 위한 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Groupby), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row mr-4 space-x-2">
          <label className="self-center">정렬 기준 컬럼</label>
          <MultiSelect options={colObjArray} onChange={settingBy} className="flex-1" isMulti={true} closeMenuOnSelect={false} defaultInputValue={columns[0]} />
          <Select className="flex-1 self-center justify-self-stretch" options={groupbyFuncs} name={"func"} text="계산 방식" onChange={handleChange} />
        </div>
        <div className="flex flex-col flex-1">
          <Select options={[0, 1]} optionText={["행", "열"]} name={"axis"} text="축 선택" onChange={handleChange} />
          <Switch name={"as_index"} text="asIndex" onChange={handleChange} checked={params.as_index} />
          <Switch name={"sort"} text="sort" onChange={handleChange} checked={params.sort} />
          <Switch name={"group_keys"} text="groupKeys" onChange={handleChange} checked={params.group_keys} />
          <Switch name={"observed"} text="observed" onChange={handleChange} checked={params.observed} />
          <Switch name={"dropna"} text="dropNa" onChange={handleChange} checked={params.dropna} />
        </div>
      </div>
    </form>
  );
}

export default Groupby;
