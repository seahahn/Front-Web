import React, { useState, useContext } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataResult } from "MLComponents/CompoOptions/util";

function Head({ formId, resultId }) {
  const [lineNum, setLineNum] = useState();
  const { dfd, storage } = useContext(AppContext);

  // 숫자 입력 시 변화 감지하여 상태 값 변경
  const handleChange = (event) => {
    setLineNum(event.target.value);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = { line: lineNum }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.Head), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <label>
        출력할 행 수
        <input className={inputStyle} type="number" min="1" defaultValue="5" onChange={handleChange} />
      </label>
    </form>
  );
}

export default React.memo(Head);
