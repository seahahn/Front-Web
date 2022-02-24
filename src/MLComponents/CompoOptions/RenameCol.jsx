import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "./networkConfigs";
import { AppContext } from "../../App";
import { saveDf, showDataResult, getColumns } from "./util";
import { inputStyle } from "../componentStyle";
import { Select } from "./CompoPiece";

function RenameCol({ formId, resultId }) {
  // const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  // const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [keys, setKeys] = useState([]); // input text 변경될 컬럼명
  const [values, setValues] = useState([]); // input text 변경할 컬럼명
  // const [copy, setCopy] = useState(true); // Switch 컬럼명 복사/삽입 여부
  const [errors, setErrors] = useState("ignore"); // Select 없는 컬럼명 지정 시 에러 발생 여부

  // DOM 접근 위한 Ref
  const keysRef = useRef();
  const valuesRef = useRef();
  // const copyRef = useRef();
  const errorsRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case keysRef.current:
        setKeys(event.target.value);
        break;
      case valuesRef.current:
        setValues(event.target.value);
        break;
      // case copyRef.current:
      //   setCopy(event.target.value);
      //   break;
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
      keys: keys,
      values: values,
      // copy: copy,
      errors: errors,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.RenameCol), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf("df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row">
          <label className="flex-none">변경 전 컬럼명(keys)</label>
          <input ref={keysRef} className={inputStyle + " w-full"} type="text" placeholder="변경 대상 컬럼명들을 입력해주세요" onChange={handleChange} />
        </div>
        <div className="flex flex-row">
          <label className="flex-none">변경 후 컬럼명(values)</label>
          <input ref={valuesRef} className={inputStyle + " w-full"} type="text" placeholder="변경 후의 컬럼명들을 입력해주세요" onChange={handleChange} />
        </div>
        {/* <Switch ref={copyRef} text="Copy" onChange={handleChange} checked={copy} /> */}
        <Select options={["ignore", "raise"]} ref={errorsRef} text="에러 표시 여부" onChange={handleChange} />
      </div>
    </form>
  );
}

export default React.memo(RenameCol);
