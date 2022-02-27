import React, { useState, useContext } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import classNames from "classnames";
import Select from "MLComponents/CompoOptions/CompoPiece/Select";

function ColConditionDf({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기

  const [col, setCol] = useState(columns[0]); // 조건의 기준이 될 컬럼
  const [cond1, setCond1] = useState("eq"); // 조건 1 "eq", "gr", "gr_eq", "le", "le_eq"
  const [value1, setValue1] = useState(""); // 조건 1 값
  const [cond2, setCond2] = useState(""); // 조건 2 "gr", "gr_eq", "le", "le_eq"; 조건1이 None이면 에러 발생
  const [value2, setValue2] = useState(""); // 조건 2 값
  const [cond2Temp, setCond2Temp] = useState(""); // 조건 2 임시 저장
  const [value2Temp, setValue2Temp] = useState(""); // 조건 2 값 임시 저장
  const [cond2Visible, setCond2Visible] = useState(false); // 조건 2 표시 여부(조건 1이 "eq"가 아니면 표시)

  const { dfd, storage } = useContext(AppContext);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    // console.log(event.target.id);
    // console.log(event.target.value);
    switch (event.target.id) {
      case "col":
        setCol(event.target.value);
        break;
      case "cond1":
        if (event.target.value === "eq") {
          // 조건 2 숨겨지면 값 지우기
          setCond2Visible(false);
          setCond2("");
          setValue2("");
        } else {
          // 조건 2 표시되면 이전 조건 2 값을 다시 불러오기
          setCond2Visible(true);
          setCond2(cond2Temp);
          setValue2(value2Temp);
        }
        setCond1(event.target.value);
        break;
      case "value1":
        setValue1(event.target.value);
        break;
      case "cond2":
        setCond2(event.target.value);
        setCond2Temp(event.target.value);
        break;
      case "value2":
        setValue2(event.target.value);
        setValue2Temp(event.target.value);
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
      cond1: cond1,
      value1: value1,
      cond2: cond2,
      value2: value2,
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.ColConditionDf), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  const conditions = ["eq", "gr", "gr_eq", "le", "le_eq"];
  const conditionTexts = ["=", ">", ">=", "<", "<="];
  const conditionsG = ["", "gr", "gr_eq"];
  const conditionTextsG = ["없음", ">", ">="];
  const conditionsL = ["", "le", "le_eq"];
  const conditionTextsL = ["없음", "<", "<="];

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <Select options={columns} id="col" text="기준 컬럼" onChange={handleChange} />
        <div className="flex flex-row justify-between mt-1">
          <div className="flex flex-col">
            <label>
              조건 1
              <Select options={conditions} optionText={conditionTexts} id="cond1" text="" onChange={handleChange} defaultValue={cond1} />
              <input id="value1" className={inputStyle} type="text" onChange={handleChange} />
            </label>
          </div>
          <div className={classNames(cond2Visible ? "" : "hidden", "flex flex-col")}>
            <label>
              조건 2
              <Select
                options={cond1[0] === "g" ? conditionsL : conditionsG}
                optionText={cond1[0] === "g" ? conditionTextsL : conditionTextsG}
                id="cond2"
                text=""
                onChange={handleChange}
                defaultValue={cond2}
              />
              <input id="value2" className={inputStyle} type="text" onChange={handleChange} defaultValue={value2} />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(ColConditionDf);
