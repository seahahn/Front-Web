import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "./networkConfigs";
import { AppContext } from "../../App";
import { showDataResult, getColumns } from "./util";
import { Select, Switch } from "./CompoPiece";
import MultiSelect from "react-select";

function SortValue({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [by, setBy] = useState(columns[0]); // MultiSelect
  const [axis, setAxis] = useState(0); // Select
  const [ascd, setAscd] = useState(true); // Select
  const [kind, setKind] = useState("quicksort"); // Select
  const [NaPos, setNaPos] = useState("last"); // Select
  const [IgIdx, setIgIdx] = useState(false); // Switch
  // const [Key, setKey] = useState(true); // 보류

  // DOM 접근 위한 Ref
  // const byRef = useRef();
  const byRef = useRef();
  const axisRef = useRef();
  const ascdRef = useRef();
  const kindRef = useRef();
  const NaPosRef = useRef();
  const IgIdxRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 컬럼 선택(MultiSelect)
  const settingBy = (e) => {
    // console.log(e);
    setBy([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      // case byRef.current:
      //   setBy(event.target.value);
      //   break;
      case axisRef.current:
        setAxis(event.target.value);
        break;
      case ascdRef.current:
        setAscd(event.target.value);
        break;
      case kindRef.current:
        setKind(event.target.value);
        break;
      case NaPosRef.current:
        setNaPos(event.target.value);
        break;
      case IgIdxRef.current:
        setIgIdx(!IgIdx);
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
      axis: axis,
      ascd: ascd,
      kind: kind,
      na_pos: NaPos,
      ig_idx: IgIdx,
      // key: key,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 축 선택에 맞는 값을 입력하지 않은 경우 입력칸에 포커스 주기
    if (by.length === 0) {
      byRef.current.focus();
      return;
    }
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.SortValue), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
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
          <MultiSelect
            ref={byRef}
            options={colObjArray}
            onChange={settingBy}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultInputValue={columns[0]}
          />
        </div>

        <Select options={[0, 1]} optionText={["행", "열"]} ref={axisRef} text="축 선택" onChange={handleChange} />
        <Select options={[false, true]} optionText={["내림차순", "오름차순"]} ref={ascdRef} text="정렬 순서" onChange={handleChange} defaultValue={true} />
        <Select options={sortKinds} ref={kindRef} text="정렬 알고리즘" onChange={handleChange} />
        <Select options={["last", "first"]} ref={NaPosRef} text="정렬 시 결측치 위치" onChange={handleChange} />
        <Switch ref={IgIdxRef} text="인덱스 무시 여부" onChange={handleChange} checked={IgIdx} />
      </div>
    </form>
  );
}

export default React.memo(SortValue);
