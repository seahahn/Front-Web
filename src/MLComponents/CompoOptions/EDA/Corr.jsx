import React, { useState, useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { showDataFrame, getColumns } from "MLComponents/CompoOptions/util";
import { BlockContext } from "MLComponents/Column";

function Corr({ formId, resultId }) {
  const [method, setMethod] = useState("pearson"); // 상관 관계 방식
  const [reqMin, setReqMin] = useState(1); // 결측치 제외한 최소 데이터 수(결측치가 너무 많은 컬럼 제거 목적)
  const [colFirst, setColFirst] = useState(""); // 기준 컬럼
  const [colSecond, setColSecond] = useState(""); // 대상 컬럼

  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  // 상관 관계 옵션 상태 값 저장
  const handleChange = (event) => {
    // console.log(event.target.value);
    switch (event.target.id) {
      case "method":
        setMethod(event.target.value);
        break;
      case "reqMin":
        setReqMin(event.target.value);
        break;
      case "colFirst":
        setColFirst(event.target.value);
        break;
      case "colSecond":
        setColSecond(event.target.value);
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
      method: method,
      req_min: reqMin,
      col1: colFirst,
      col2: colSecond,
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Corr), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(typeof data);
        if (typeof data !== "number") {
          // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
          showDataFrame(dfd, data, resultId);
        } else {
          document.getElementById(resultId).innerHTML = data; // 결과 영역에 출력
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label for="method">
          상관 관계 계산 방식
          <select id="method" className={inputStyle} onChange={handleChange}>
            <option key="pearson" value="pearson">
              Pearson
            </option>
            <option key="kendall" value="kendall">
              Kendall
            </option>
            <option key="spearman" value="spearman">
              Spearman
            </option>
          </select>
        </label>
        <label for="reqMin">
          최소 데이터 수
          <input id="reqMin" className={inputStyle} type="number" min="1" defaultValue="1" onChange={handleChange} />
        </label>
        <label for="colFirst">
          기준 컬럼
          <select id="colFirst" className={inputStyle} onChange={handleChange}>
            <option key="" value="">
              전체
            </option>
            {columns.map((column) => {
              return (
                <option key={column.index} value={column}>
                  {column}
                </option>
              );
            })}
          </select>
        </label>
        <label for="colSecond">
          대상 컬럼
          <select id="colSecond" className={inputStyle} onChange={handleChange}>
            <option key="" value="">
              전체
            </option>
            {columns.map((column) => {
              return (
                <option key={column.index} value={column}>
                  {column}
                </option>
              );
            })}
          </select>
        </label>
      </div>
    </form>
  );
}

export default React.memo(Corr);
