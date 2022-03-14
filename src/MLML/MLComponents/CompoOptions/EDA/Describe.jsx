import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { showDataResult } from "MLML/MLComponents/CompoOptions/util";
import Switch from "MLML/MLComponents/CompoOptions/CompoPiece/Switch";
import { BlockContext } from "MLML/MLComponents/Column";

function Describe({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd, storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

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
        [name]: value,
      });
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      num: param.num ? "1" : "0",
      obj: param.obj ? "1" : "0",
      cat: param.cat ? "1" : "0",
      date: param.date ? "1" : "0",
    }; // 입력해야 할 파라미터 설정
    console.log(paramResult);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Describe), paramResult);
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
      <span>기본 출력 : 수치형 컬럼</span>
      <div className="flex flex-col">
        <label htmlFor="percentiles">
          확인할 퍼센트 값(소수, 콤마로 구분) 예) 0.25, 0.5, 0.75:
          <input name={"percentiles"} className={inputStyle} type="text" onChange={handleChange} defaultValue={param.percentiles} />
        </label>
        <Switch name={"num"} text="수치형 컬럼 표시 여부" onChange={handleChange} checked={param.num} />
        <Switch name={"obj"} text="객체형 컬럼 표시 여부" onChange={handleChange} checked={param.obj} />
        <Switch name={"cat"} text="범주형 컬럼 표시 여부" onChange={handleChange} checked={param.cat} />
        <Switch name={"date"} text="날짜형 컬럼 표시 여부" onChange={handleChange} checked={param.date} />
        <Switch name={"date2num"} text="날짜형->수치형 변환 여부" onChange={handleChange} checked={param.date2num} />
      </div>
    </form>
  );
}

export default React.memo(Describe);
