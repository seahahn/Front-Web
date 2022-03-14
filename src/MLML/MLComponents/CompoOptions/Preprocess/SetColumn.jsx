import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { saveDf, showDataResult, getColumns } from "MLML/MLComponents/CompoOptions/util";
import classNames from "classnames";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLML/MLComponents/Column";

/**
 * 새로운 컬럼을 생성하거나 기존의 컬럼을 변경하기 위한 컴포넌트.
 * - 사용 방법 2가지(둘 다 동시에 사용할 수 없음)
 * 1. cols or col_from:col_to / func
 * 2. cols_ops
 */
function SetColumn({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  const colFromArray = ["처음", ...columns];
  const colToArray = ["끝", ...columns];
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // const colSetMethod = [false, true];
  const isColsOpsText = ["함수 지정", "사칙 연산"];

  const colFuncs = ["sum", "count", "mean", "min", "max", "std", "median", "size"];
  const colOps = ["+", "-", "*", "/", "^"];

  const colsOpsWarning = ["컬럼 또는 값을 먼저 입력해주세요!", "연산자를 먼저 입력해주세요!", "삭제할 요소가 없습니다!"];
  const [isWarning, setIsWarning] = useState(false);
  const [warningTopic, setWarningTopic] = useState(false); // 0:컬럼 or 값 / 1:연산자 / 2:삭제할 요소가 없음

  // DOM 접근 위한 Ref
  const colRef = useRef();
  const colsRef = useRef();

  const colsOpsRef = useRef();
  const colsOpsColRef = useRef();
  const colsOpsValRef = useRef();
  const colsOpsOpRef = useRef();
  const colsOpsPopRef = useRef();

  const colsOpsColRefBtn = useRef();
  const colsOpsValRefBtn = useRef();
  const colsOpsOpRefBtn = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setParam({
      ...param,
      cols: e,
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
        [name]: name === "isColsOps" ? JSON.parse(value) : value, // Boolean(value)하면 value가 있기만 하면 죄다 true됨
      });
    }
  };

  const handleInput = (event) => {
    switch (event.target) {
      case colsOpsColRefBtn.current:
        if (param.cols_ops.length % 2 === 0) {
          // 연산식 길이가 짝수일 경우 컬럼 입력 가능
          setParam({
            ...param,
            cols_ops: [...param.cols_ops, param.colsOpsCol],
          });
          setIsWarning(false);
        } else {
          // 짝수일 아닌 경우 경고문과 함께 연산자를 입력하도록 유도
          colsOpsOpRef.current.focus();
          setIsWarning(true);
          setWarningTopic(1);
        }
        break;
      case colsOpsValRefBtn.current:
        if (param.cols_ops.length % 2 === 0) {
          // 연산식 길이가 짝수일 경우 값 입력 가능
          setParam({
            ...param,
            cols_ops: [...param.cols_ops, param.colsOpsVal],
          });
          setIsWarning(false);
        } else {
          // 짝수일 아닌 경우 경고문과 함께 연산자를 입력하도록 유도
          colsOpsOpRef.current.focus();
          setIsWarning(true);
          setWarningTopic(1);
        }
        break;
      case colsOpsOpRefBtn.current:
        if (param.cols_ops.length % 2 !== 0) {
          // 연산식 길이가 홀수일 경우 연산자 입력 가능
          setParam({
            ...param,
            cols_ops: [...param.cols_ops, param.colsOpsOp],
          });
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
        if (param.cols_ops.length > 0) {
          setParam({
            ...param,
            cols_ops: param.cols_ops.slice(0, -1),
          }); // 연산식의 마지막 요소 삭제
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

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    // 입력해야 할 파라미터가 있는지 확인
    if (param.col === "") {
      // 생성 또는 변경할 컬럼명 입력 여부 확인
      colRef.current.focus();
      return;
    }
    if (param.isColsOps && param.cols_ops === "") {
      // 사칙 연산 선택 시 연산식 입력 여부 확인
      colsOpsRef.current.focus();
      return;
    } else if (!param.isColsOps && !param.isColRange && param.cols.length === 0) {
      // 함수 지정 & 범위 지정X 시 컬럼 선택 여부 확인
      colsRef.current.focus();
      return;
    }

    const paramResult = {
      col: param.col,
      cols: !param.isColsOps && !param.isColRange ? [...param.cols.map((col) => col.value)] : "",
      col_from: !param.isColsOps && param.isColRange ? param.col_from : "",
      col_to: !param.isColsOps && param.isColRange ? param.col_to : "",
      func: !param.isColsOps ? param.func : "",
      cols_ops: param.isColsOps ? param.cols_ops : "",
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.SetColumn), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className={classNames("mb-3 space-y-2")}>
          <label>
            생성 또는 변경할 컬럼명
            <input ref={colRef} name="col" className={inputStyle} type="text" onChange={handleChange} defaultValue={param.col} />
          </label>
          <Select
            options={[false, true]}
            optionText={isColsOpsText}
            name="isColsOps"
            text="컬럼 생성 방식"
            onChange={handleChange}
            defaultValue={param.isColsOps}
          />
        </div>
        {/* 컬럼 생성 방식 : 함수 부분*/}
        <div className={classNames(param.isColsOps ? "hidden" : "", "flex flex-col flex-1 mr-4 space-y-2")}>
          <Switch name="isColRange" text="범위 지정 여부" onChange={handleChange} checked={param.isColRange} />
          <div className={classNames(param.isColRange ? "hidden" : "", "flex flex-row items-center")}>
            <span className="mr-2">컬럼 선택</span>
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
          <div className={classNames(param.isColRange ? "" : "hidden", "flex flex-row align-middle space-x-2")}>
            <Select options={colFromArray} name="col_from" text="시작 컬럼" onChange={handleChange} defaultValue={param.col_from} />
            <Select options={colToArray} name="col_to" text="종료 컬럼" onChange={handleChange} defaultValue={param.col_to} />
          </div>
          <Select options={colFuncs} name="func" text="연산 함수" onChange={handleChange} defaultValue={param.func} />
        </div>
        {/* 컬럼 생성 방식 : 사칙연산 부분 */}
        <div className={classNames(param.isColsOps ? "" : "hidden", "flex flex-col flex-1 space-y-2")}>
          <div className={classNames("flex flex-col space-y-2")}>
            <div className={classNames("flex flex-row space-x-2")}>
              <span>연산식 : </span>
              <p className="border-blue-400 border-2 flex-1 rounded-lg ">{param.cols_ops}</p>
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
              <Select
                options={columns}
                name="colsOpsCol"
                ref={colsOpsColRef}
                text="계산 대상 컬럼"
                onChange={handleChange}
                defaultValue={param.colsOpsCol ? param.colsOpsCol : columns[0]}
              />
              <button type="button" ref={colsOpsColRefBtn} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                컬럼 입력
              </button>
              <label>
                계산 대상 값
                <input
                  name="colsOpsVal"
                  ref={colsOpsValRef}
                  className={inputStyle}
                  type="number"
                  step="any"
                  onChange={handleChange}
                  defaultValue={param.colsOpsVal}
                />
              </label>
              <button type="button" ref={colsOpsValRefBtn} onClick={handleInput} className="border-blue-400 border-2 rounded-lg">
                값 입력
              </button>
            </div>
            <div className="flex flex-row space-x-2">
              <Select options={colOps} name="colsOpsOp" ref={colsOpsOpRef} text="수행할 연산" onChange={handleChange} defaultValue={param.colsOpsOp} />
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

export default SetColumn;
