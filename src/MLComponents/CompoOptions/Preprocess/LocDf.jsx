import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import classNames from "classnames";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
// import { MultiSelect } from "react-multi-select-component";
import MultiSelect from "react-select";

function LocDf({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  const colFromArray = [...columns];
  const colToArray = [...columns];
  colFromArray.unshift("처음");
  colToArray.unshift("끝");
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // 선택 : 불러올 인덱스 또는 컬럼을 개별 선택 / 범위 : 시작부터 종료까지의 범위 선택
  // 선택을 하면 범위 지정 불가. 반대도 마찬가지.
  // 인덱스는 선택, 컬럼은 범위 지정 가능. 반대도 마찬가지.
  const [idx, setIdx] = useState(""); // 선택 인덱스 목록(1, 2, 3, ...)
  const [cols, setCols] = useState(columns[0]); // 선택 컬럼 목록(컬럼1, 컬럼2, ...)
  const [idxFrom, setIdxFrom] = useState(""); // 범위 시작 인덱스
  const [idxTo, setIdxTo] = useState(""); // 범위 종료 인덱스
  const [colFrom, setColFrom] = useState(""); // 범위 시작 컬럼
  const [colTo, setColTo] = useState(""); // 범위 종료 컬럼
  // console.log(cols);
  console.log(colFrom);
  console.log(colTo);

  const [isIdxRange, setIsIdxRange] = useState(false); // 인덱스 범위 지정 여부
  const [isColRange, setIsColRange] = useState(false); // 컬럼 범위 지정 여부

  // DOM 접근 위한 Ref
  const idxRef = useRef();
  // const colsRef = useRef();
  const idxFromRef = useRef();
  const idxToRef = useRef();
  const colFromRef = useRef();
  const colToRef = useRef();

  const isIdxRangeRef = useRef();
  const idxDiscreteRef = useRef();
  const idxRangeRef = useRef();

  const isColRangeRef = useRef();
  const colDiscreteRef = useRef();
  const colRangeRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    // console.log(e);
    setCols([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case isIdxRangeRef.current:
        // console.log(isIdxRangeRef.current.value);
        setIsIdxRange(!isIdxRange);
        // console.log(isIdxRange);
        // if (isIdxRange) {
        //   setIdxFrom("");
        //   idxFromRef.current.value = "";
        //   setIdxTo("");
        //   idxToRef.current.value = "";
        // } else {
        //   setIdx("");
        //   idxRef.current.value = "";
        // }
        break;
      case isColRangeRef.current:
        // console.log(isColRangeRef.current.value);
        setIsColRange(!isColRange);
        // if (isColRange) {
        //   setColFrom("");
        //   idxFromRef.current.value = "";
        //   setColTo("");
        //   idxToRef.current.value = "";
        // } else {
        //   settingCols([]);
        //   idxRef.current.value = "";
        // }
        break;
      case idxRef.current:
        // console.log(idxRef.current.value);
        setIdx(event.target.value);
        break;
      // case colsRef.current:
      //   setCols(event.target.value);
      //   break;
      case idxFromRef.current:
        // console.log(idxFromRef.current.value);
        setIdxFrom(event.target.value);
        break;
      case idxToRef.current:
        // console.log(idxToRef.current.value);
        setIdxTo(event.target.value);
        break;
      case colFromRef.current:
        // console.log(colFromRef.current.value);
        setColFrom(event.target.value);
        break;
      case colToRef.current:
        // console.log(colToRef.current.value);
        setColTo(event.target.value);
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
      idx: isIdxRange ? "" : idx,
      idx_from: isIdxRange ? idxFrom : "",
      idx_to: isIdxRange ? idxTo : "",
      cols: isColRange ? "" : cols,
      col_from: isColRange ? colFrom : "",
      col_to: isColRange ? colTo : "",
    }; // 입력해야 할 파라미터 설정
    if (!isIdxRange && idx === "") {
      idxRef.current.focus();
      return;
    }
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.LocDf), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // console.log(typeof data);
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1 mr-4">
          <Switch ref={isIdxRangeRef} text="범위 지정 여부" onChange={handleChange} checked={isIdxRange} />
          <div ref={idxDiscreteRef} className={classNames(isIdxRange ? "hidden" : "", "flex flex-row items-center")}>
            <label>
              인덱스 지정
              <input ref={idxRef} className={inputStyle} type="text" onChange={handleChange} />
            </label>
          </div>
          <div ref={idxRangeRef} className={classNames(isIdxRange ? "" : "hidden", "flex flex-col")}>
            <label>
              시작 인덱스
              <input ref={idxFromRef} placeholder="미지정시 처음 인덱스" className={inputStyle} type="text" onChange={handleChange} />
            </label>
            <label>
              종료 인덱스
              <input ref={idxToRef} placeholder="미지정시 마지막 인덱스" className={inputStyle} type="text" onChange={handleChange} />
            </label>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <Switch ref={isColRangeRef} text="범위 지정 여부" onChange={handleChange} checked={isColRange} />
          <div ref={colDiscreteRef} className={classNames(isColRange ? "hidden" : "", "flex flex-row items-center")}>
            <span className="mr-2">컬럼 선택</span>
            <MultiSelect
              options={colObjArray}
              onChange={settingCols}
              className="flex-1"
              isMulti={true}
              closeMenuOnSelect={false}
              defaultInputValue={columns[0]}
            />
          </div>
          <div ref={colRangeRef} className={classNames(isColRange ? "" : "hidden", "flex flex-col align-middle")}>
            <Select options={colFromArray} ref={colFromRef} text="시작 컬럼" onChange={handleChange} />
            <Select options={colToArray} ref={colToRef} text="종료 컬럼" onChange={handleChange} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(LocDf);
