import React, { useState, useContext } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "./networkConfig";
import { AppContext } from "../../App";
import { inputStyle } from "../componentStyle";

function Unique({ formId, resultId }) {
  const [column, setColumn] = useState();
  const { storage } = useContext(AppContext);

  const columns = storage
    .getItem("columns")
    .replace(/['\[\]]/g, "")
    .split(",")
    .map((element) => {
      return element.trim();
    }); // 데이터프레임 컬럼 목록 가져오기

  // 컬럼명 입력 시 변화 감지하여 상태 값 변경
  const handleChange = (event) => {
    console.log(event.target.value);
    setColumn(event.target.value);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = { col: column }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.Unique), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(resultId).innerText = data; // 결과 영역에 출력
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <label>
        대상 컬럼명
        {/* <input className={inputStyle} type="number" min="1" max="50" defaultValue="5" onChange={handleChange} /> */}
        <select className={inputStyle} onChange={handleChange}>
          {columns.map((column) => {
            return (
              <option key={column.index} value={column}>
                {column}
              </option>
            );
          })}
        </select>
      </label>
    </form>
  );
}

export default React.memo(Unique);
