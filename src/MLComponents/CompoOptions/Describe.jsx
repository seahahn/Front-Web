import React, { useState, useContext } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "./networkConfigs";
import { AppContext } from "../../App";
import { inputStyle } from "../componentStyle";
import { showDataResult } from "./util";
import Switch from "./CompoPiece/Switch";

function Describe({ formId, resultId }) {
  const [percentiles, setPercentiles] = useState(""); // 확인할 퍼센트 수치들
  const [numVisible, setNumVisible] = useState(true); // 수치형 컬럼 표시 여부
  const [objVisible, setObjVisible] = useState(false); // 객체형 컬럼 표시 여부
  const [catVisible, setCatVisible] = useState(false); // 범주형 컬럼 표시 여부
  const [dateVisible, setDateVisible] = useState(false); // 날짜형 컬럼 표시 여부
  const [dateToNum, setDateToNum] = useState(false); // 날짜형 컬럼을 수치형으로 변환할 지 여부

  const { dfd, storage } = useContext(AppContext);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    // console.log(event.target.id);
    // console.log(event.target.value);
    switch (event.target.id) {
      case "percentiles":
        setPercentiles(event.target.value);
        break;
      case "numVisible":
        setNumVisible(!numVisible);
        break;
      case "objVisible":
        setObjVisible(!objVisible);
        break;
      case "catVisible":
        setCatVisible(!catVisible);
        break;
      case "dateVisible":
        setDateVisible(!dateVisible);
        break;
      case "dateToNum":
        setDateToNum(!dateToNum);
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
      percentiles: percentiles,
      num: numVisible ? "1" : "0",
      obj: objVisible ? "1" : "0",
      cat: catVisible ? "1" : "0",
      date: dateVisible ? "1" : "0",
      date2num: dateToNum,
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.Describe), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <span>기본 출력 : 수치형 컬럼</span>
      <div className="flex flex-col">
        <label htmlFor="percentiles">
          확인할 퍼센트 값(소수, 콤마로 구분) 예) 0.25, 0.5, 0.75:
          <input id="percentiles" className={inputStyle} type="text" onChange={handleChange} />
        </label>
        <Switch id="numVisible" text="수치형 컬럼 표시 여부" onChange={handleChange} checked={numVisible} />
        <Switch id="objVisible" text="객체형 컬럼 표시 여부" onChange={handleChange} checked={objVisible} />
        <Switch id="catVisible" text="범주형 컬럼 표시 여부" onChange={handleChange} checked={catVisible} />
        <Switch id="dateVisible" text="날짜형 컬럼 표시 여부" onChange={handleChange} checked={dateVisible} />
        <Switch id="dateToNum" text="날짜형->수치형 변환 여부" onChange={handleChange} checked={dateToNum} />
      </div>
    </form>
  );
}

export default React.memo(Describe);
