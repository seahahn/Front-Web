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
  const colFromArray = [...columns];
  const colToArray = [...columns];
  colFromArray.unshift("처음");
  colToArray.unshift("끝");
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const groupbyFuncs = ["sum", "count", "mean", "min", "max", "std", "median", "size"];

  const [by, setBy] = useState(columns[0]); // Select
  const [func, setFunc] = useState(groupbyFuncs[0]); // Select
  const [axis, setAxis] = useState(0); // Select
  const [asIndex, setAsIndex] = useState(true); // Switch
  const [sort, setSort] = useState(true); // Switch
  const [groupKeys, setGroupKeys] = useState(true); // Switch
  const [observed, setObserved] = useState(false); // Switch
  const [dropNa, setDropNa] = useState(true); // Switch

  // DOM 접근 위한 Ref
  // const byRef = useRef();
  const funcRef = useRef();
  const axisRef = useRef();
  const asIndexRef = useRef();
  const sortRef = useRef();
  const groupKeysRef = useRef();
  const observedRef = useRef();
  const dropnaRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingBy = (e) => {
    // console.log(e);
    setBy([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case funcRef.current:
        setFunc(event.target.value);
        break;
      case axisRef.current:
        setAxis(event.target.value);
        break;
      case asIndexRef.current:
        setAsIndex(!asIndex);
        break;
      case sortRef.current:
        setSort(!sort);
        break;
      case groupKeysRef.current:
        setGroupKeys(!groupKeys);
        break;
      case observedRef.current:
        setObserved(!observed);
        break;
      case dropnaRef.current:
        setDropNa(!dropNa);
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
      by: by,
      func: func,
      axis: axis,
      as_index: asIndex,
      sort: sort,
      group_keys: groupKeys,
      observed: observed,
      dropna: dropNa,
    }; // 입력해야 할 파라미터 설정
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
          <Select className="flex-1 self-center justify-self-stretch" options={groupbyFuncs} ref={funcRef} text="계산 방식" onChange={handleChange} />
        </div>
        <div className="flex flex-col flex-1">
          <Select options={[0, 1]} optionText={["행", "열"]} ref={axisRef} text="축 선택" onChange={handleChange} />
          <Switch ref={asIndexRef} text="asIndex" onChange={handleChange} checked={asIndex} />
          <Switch ref={sortRef} text="sort" onChange={handleChange} checked={sort} />
          <Switch ref={groupKeysRef} text="groupKeys" onChange={handleChange} checked={groupKeys} />
          <Switch ref={observedRef} text="observed" onChange={handleChange} checked={observed} />
          <Switch ref={dropnaRef} text="dropNa" onChange={handleChange} checked={dropNa} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(Groupby);
