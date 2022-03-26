import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { showDataResult, getColumns } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import classNames from "classnames";
import Select from "Components/MLML/MLComponents/CompoOptions/CompoPiece/Select";
import { BlockContext } from "Components/MLML/MLComponents/Column";

function ColConditionDf({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  const conditions = ["eq", "gr", "gr_eq", "le", "le_eq"];
  const conditionTexts = ["=", ">", ">=", "<", "<="];
  const conditionsG = ["", "gr", "gr_eq"];
  const conditionTextsG = ["없음", ">", ">="];
  const conditionsL = ["", "le", "le_eq"];
  const conditionTextsL = ["없음", "<", "<="];

  const [cond2Visible, setCond2Visible] = useState(param.cond1 !== "eq" ? true : false); // 조건 2 표시 여부(조건 1이 "eq"가 아니면 표시)

  const value1Ref = useRef();
  const cond2Ref = useRef();
  const value2Ref = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "cond1" && value === "eq") {
      // 조건 2 숨겨지면 값 지우기
      setCond2Visible(false);
      setParam({
        ...param,
        cond2: "",
        value2: "",
      });
      value2Ref.current.value = "";
    } else if (name === "cond1" && value !== "eq") {
      setCond2Visible(true);
    }
    setParam({
      ...param,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    // 조건 1 값이 없으면 포커스 주기
    if (param.value1 === "") {
      value1Ref.current.focus();
      return;
    }
    // 조건 2에 지정 또는 입력해야 할 값이 없으면 포커스 주기
    if ((param.cond2 !== "" && param.value2 === "") || (param.cond2 === "" && param.value2 !== "")) {
      value2Ref.current.focus();
      return;
    }

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.ColConditionDf), param);
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
        <Select options={columns} name="col" text="기준 컬럼" onChange={handleChange} defaultValue={param.col ? param.col : columns[0]} />
        <div className="flex flex-row justify-between mt-1">
          <div className="flex flex-row space-x-2">
            <Select options={conditions} optionText={conditionTexts} name="cond1" text="조건 1" onChange={handleChange} defaultValue={param.cond1} />
            <input ref={value1Ref} name="value1" className={inputStyle} type="text" onChange={handleChange} defaultValue={param.value1} />
          </div>
          <div className={classNames(cond2Visible ? "" : "hidden", "flex flex-row space-x-2")}>
            <Select
              ref={cond2Ref}
              options={param.cond1[0] === "g" ? conditionsL : conditionsG}
              optionText={param.cond1[0] === "g" ? conditionTextsL : conditionTextsG}
              name="cond2"
              text="조건 2"
              onChange={handleChange}
              defaultValue={param.cond2}
            />
            <input ref={value2Ref} name="value2" className={inputStyle} type="text" onChange={handleChange} defaultValue={param.value2} />
          </div>
        </div>
      </div>
    </form>
  );
}

export default ColConditionDf;
