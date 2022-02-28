import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import classNames from "classnames";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";

/**
 * 새로운 컬럼을 생성하거나 기존의 컬럼을 변경하기 위한 컴포넌트.
 * - 사용 방법 2가지(둘 다 동시에 사용할 수 없음)
 * 1. cols or col_from:col_to / func
 * 2. cols_ops
 */
function SetColumn({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  const colFromArray = [...columns];
  const colToArray = [...columns];
  colFromArray.unshift("처음");
  colToArray.unshift("끝");
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const colSetMethod = ["함수 지정", "사칙 연산"];

  const colFuncs = ["sum", "count", "mean", "min", "max", "std", "median", "size"];
  const colOps = ["+", "-", "*", "/", "^"];

  // 방법 1 관련 상태 값
  const [col, setCol] = useState(""); // 새로 생성 또는 변경할 컬럼 input text / Select

  const [cols, setCols] = useState([]); // 선택 컬럼 목록(컬럼1, 컬럼2, ...) MultiSelect
  // console.log(cols);
  const [colFrom, setColFrom] = useState(""); // 범위 시작 컬럼 Select
  const [colTo, setColTo] = useState(""); // 범위 종료 컬럼 Select
  const [func, setFunc] = useState(colFuncs[0]); // 연산 함수(sum, mean, ...) Select

  // 방법 2 관련 상태 값
  const [colsOps, setColsOps] = useState([]); // 사칙연산에 필요한 컬럼과 연산자들 input text readonly
  // console.log(colsOps);
  const [colsOpsCol, setColsOpsCol] = useState(columns[0]); // 사칙연산에 필요한 컬럼 선택 Select
  const [colsOpsVal, setColsOpsVal] = useState(0); // 사칙연산에 필요한 컬럼 선택 Select
  const [colsOpsOp, setColsOpsOp] = useState(colOps[0]); // 사칙연산에 필요한 연산자 선택 Select

  // 방법 선택 관련 상태 값
  const [isColsOps, setIsColsOps] = useState(false); // 사칙연산 방식 선택 여부 Select
  const [isColRange, setIsColRange] = useState(false); // 컬럼 범위 지정 여부 Switch

  const colsOpsWarning = ["컬럼 또는 값을 먼저 입력해주세요!", "연산자를 먼저 입력해주세요!", "삭제할 요소가 없습니다!"];
  const [isWarning, setIsWarning] = useState(false);
  const [warningTopic, setWarningTopic] = useState(false); // 0:컬럼 or 값 / 1:연산자 / 2:삭제할 요소가 없음

  // DOM 접근 위한 Ref
  const colRef = useRef();
  const colsRef = useRef();
  const colFromRef = useRef();
  const colToRef = useRef();
  const funcRef = useRef();

  const colsOpsRef = useRef();
  const colsOpsColRef = useRef();
  const colsOpsValRef = useRef();
  const colsOpsOpRef = useRef();
  const colsOpsPopRef = useRef();

  const colsOpsColRefBtn = useRef();
  const colsOpsValRefBtn = useRef();
  const colsOpsOpRefBtn = useRef();

  const isColsOpsRef = useRef();
  const isColRangeRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    // console.log(e);
    setCols([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      // 함수 지정 시
      case colRef.current:
        setCol(event.target.value);
        break;
      case colsRef.current:
        setCols(event.target.value);
        break;
      case colFromRef.current:
        setColFrom(event.target.value);
        break;
      case colToRef.current:
        setColTo(event.target.value);
        break;
      case funcRef.current:
        setFunc(event.target.value);
        break;
      // 사칙 연산 시
      case colsOpsColRef.current:
        setColsOpsCol(event.target.value);
        break;
      case colsOpsValRef.current:
        setColsOpsVal(event.target.value);
        break;
      case colsOpsOpRef.current:
        setColsOpsOp(event.target.value);
        break;
      // 함수 지정 / 사칙 연산 선택
      case isColsOpsRef.current:
        setIsColsOps(!isColsOps);
        break;
      // 함수 지정 시 범위 지정 여부
      case isColRangeRef.current:
        setIsColRange(!isColRange);
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
      col: col,
      cols: !isColsOps && !isColRange ? cols : "",
      col_from: !isColsOps && isColRange ? colFrom : "",
      col_to: !isColsOps && isColRange ? colTo : "",
      func: !isColsOps ? func : "",
      cols_ops: isColsOps ? colsOps : "",
    }; // 입력해야 할 파라미터 설정

    // 입력해야 할 파라미터가 있는지 확인
    if (col === "") {
      // 생성 또는 변경할 컬럼명 입력 여부 확인
      colRef.current.focus();
      return;
    }

    if (isColsOps && colsOps === "") {
      // 사칙 연산 선택 시 연산식 입력 여부 확인
      colsOpsRef.current.focus();
      return;
    } else if (!isColsOps && !isColRange && cols.length === 0) {
      // 함수 지정 & 범위 지정X 시 컬럼 선택 여부 확인
      colsRef.current.focus();
      return;
    }
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.SetColumn), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

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

  const handleInput = (event) => {
    switch (event.target) {
      case colsOpsColRefBtn.current:
        if (colsOps.length % 2 === 0) {
          // 연산식 길이가 짝수일 경우 컬럼 입력 가능
          setColsOps([...colsOps, colsOpsCol]);
          setIsWarning(false);
        } else {
          // 짝수일 아닌 경우 경고문과 함께 연산자를 입력하도록 유도
          colsOpsOpRef.current.focus();
          setIsWarning(true);
          setWarningTopic(1);
        }
        break;
      case colsOpsValRefBtn.current:
        if (colsOps.length % 2 === 0) {
          // 연산식 길이가 짝수일 경우 값 입력 가능
          setColsOps([...colsOps, colsOpsVal]);
          setIsWarning(false);
        } else {
          // 짝수일 아닌 경우 경고문과 함께 연산자를 입력하도록 유도
          colsOpsOpRef.current.focus();
          setIsWarning(true);
          setWarningTopic(1);
        }
        break;
      case colsOpsOpRefBtn.current:
        if (colsOps.length % 2 !== 0) {
          // 연산식 길이가 홀수일 경우 연산자 입력 가능
          setColsOps([...colsOps, colsOpsOp]);
          setIsWarning(false);
        } else {
          // 홀수가 아닌 경우 경고문과 함께 연산자를 입력하도록 유도
          colsOpsColRef.current.focus();
          colsOpsValRef.current.focus();
          setIsWarning(true);
          setWarningTopic(0);
        }
        break;
      case colsOpsPopRef.current:
        if (colsOps.length > 0) {
          setColsOps(colsOps.slice(0, -1)); // 연산식의 마지막 요소 삭제
          setIsWarning(false);
        } else {
          setIsWarning(true);
          setWarningTopic(2);
        }
        break;
      default:
        console.log("error");
        break;
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className={classNames("mb-3 space-y-2")}>
          <label>
            생성 또는 변경할 컬럼명
            <input ref={colRef} className={inputStyle} type="text" onChange={handleChange} />
          </label>
          <Select options={colSetMethod} ref={isColsOpsRef} text="컬럼 생성 방식" onChange={handleChange} />
        </div>
        {/* 컬럼 생성 방식 : 함수 부분*/}
        <div className={classNames(isColsOps ? "hidden" : "", "flex flex-col flex-1 mr-4 space-y-2")}>
          <Switch ref={isColRangeRef} text="범위 지정 여부" onChange={handleChange} checked={isColRange} />
          <div className={classNames(isColRange ? "hidden" : "", "flex flex-row items-center")}>
            <span className="mr-2">컬럼 선택</span>
            <MultiSelect ref={colsRef} options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
          </div>
          <div className={classNames(isColRange ? "" : "hidden", "flex flex-row align-middle space-x-2")}>
            <Select options={colFromArray} ref={colFromRef} text="시작 컬럼" onChange={handleChange} />
            <Select options={colToArray} ref={colToRef} text="종료 컬럼" onChange={handleChange} />
          </div>
          <Select options={colFuncs} ref={funcRef} text="연산 함수" onChange={handleChange} />
        </div>
        {/* 컬럼 생성 방식 : 사칙연산 부분 */}
        <div className={classNames(isColsOps ? "" : "hidden", "flex flex-col flex-1 space-y-2")}>
          <div className={classNames("flex flex-col space-y-2")}>
            <div className={classNames("flex flex-row space-x-2")}>
              <span>연산식 : </span>
              <p className="border-blue-400 border-2 flex-1 rounded-lg ">{colsOps}</p>
              <button type="button" ref={colsOpsPopRef} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                마지막 요소 삭제
              </button>
            </div>
            <span className={classNames(isWarning ? "" : "hidden", "text-xs text-red-500")}>
              {warningTopic === 0 ? colsOpsWarning[0] : warningTopic === 1 ? colsOpsWarning[1] : colsOpsWarning[2]}
            </span>
          </div>
          <div className={classNames("flex flex-col align-middle space-y-2")}>
            <div className="flex flex-row space-x-2">
              <Select options={columns} ref={colsOpsColRef} text="계산 대상 컬럼" onChange={handleChange} />
              <button type="button" ref={colsOpsColRefBtn} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                컬럼 입력
              </button>
              <label>
                계산 대상 값
                <input ref={colsOpsValRef} className={inputStyle} type="number" step="any" onChange={handleChange} />
              </label>
              <button type="button" ref={colsOpsValRefBtn} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                값 입력
              </button>
            </div>
            <div className="flex flex-row space-x-2">
              <Select options={colOps} ref={colsOpsOpRef} text="수행할 연산" onChange={handleChange} />
              <button type="button" ref={colsOpsOpRefBtn} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                연산자 입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(SetColumn);
