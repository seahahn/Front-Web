import React, { useState, useContext, useRef, useEffect } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { saveDf, showDataResult, getColumns, saveColumnList } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import classNames from "classnames";

function Drop({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [labelsCol, setLabelsCol] = useState([]); // MultiSelect
  const [labelsIndex, setLabelsIndex] = useState(0); // input text
  const [axis, setAxis] = useState(1); // Select
  const [errors, setErrors] = useState("raise"); // Select

  const [colOptions, setColOptions] = useState(colObjArray); // MultiSelect Options

  // DOM 접근 위한 Ref
  const labelsColRef = useRef();
  const labelsIndexRef = useRef();
  const axisRef = useRef();
  const errorsRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 컬럼 선택(MultiSelect)
  const settingLabelsCol = (e) => {
    setLabelsCol([...e.map((col) => col.value)]);
  };

  const clearInputs = () => {
    setLabelsIndex(""); // 인덱스 상태 값 초기화
    labelsIndexRef.current.value = ""; // 인덱스 입력 값 초기화

    // 컬럼 입력 값 초기화(onChange되면서 settingLabelsCol에서 상태 값도 초기화됨)
    labelsColRef.current.clearValue();
    return;
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case labelsIndexRef.current:
        setLabelsIndex(event.target.value);
        break;
      case axisRef.current:
        setAxis(event.target.value);
        break;
      case errorsRef.current:
        setErrors(event.target.value);
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
      labels: axis == 1 ? labelsCol : labelsIndex,
      axis: axis,
      errors: errors,
    }; // 입력해야 할 파라미터 설정
    console.log(params);

    // 축 선택에 맞는 값을 입력하지 않은 경우 입력칸에 포커스 주기
    if (axis == 1 && labelsCol.length === 0) {
      labelsColRef.current.focus();
      return;
    } else if (axis == 0 && labelsIndex.length === 0) {
      labelsIndexRef.current.focus();
      return;
    }
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.Drop), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf("df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);

        // 컬럼 삭제한 경우 새로운 컬럼 목록 가져와서 입력 목록에 넣기
        if (axis == 1) {
          const newColOptions = columns.filter((col) => !labelsCol.includes(col));
          setColOptions([...newColOptions.map((col) => ({ label: col, value: col }))]);
        }

        clearInputs(); // 실행 후 입력 초기화
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row space-x-2">
        <div className="flex flex-col flex-1">
          <Select options={[0, 1]} optionText={["행", "열"]} ref={axisRef} text="축 선택" onChange={handleChange} defaultValue={1} />
          <Select options={["raise", "ignore"]} ref={errorsRef} text="에러 표시 여부" onChange={handleChange} />
        </div>
        <div className="flex-1">
          <div className={classNames(axis == 1 ? "" : "hidden", "flex items-center space-x-2")}>
            <label>삭제 대상 컬럼</label>
            <MultiSelect
              ref={labelsColRef}
              options={colOptions}
              onChange={settingLabelsCol}
              className="inline-block flex-auto"
              isMulti={true}
              closeMenuOnSelect={false}
            />
          </div>
          <div className={classNames(axis == 1 ? "hidden" : "")}>
            <label>
              삭제 대상 인덱스
              <input ref={labelsIndexRef} className={inputStyle} type="text" onChange={handleChange} />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(Drop);
