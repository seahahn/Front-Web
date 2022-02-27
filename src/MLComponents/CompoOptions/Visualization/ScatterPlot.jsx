import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

function ScatterPlot({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기

  const [xCol, setXCol] = useState(columns[0]); // Select
  const [yCol, setYCol] = useState(columns[0]); // Select

  // DOM 접근 위한 Ref
  const xColRef = useRef();
  const yColRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    console.log(event.target.value);
    switch (event.target) {
      case xColRef.current:
        setXCol(event.target.value);
        break;
      case yColRef.current:
        setYCol(event.target.value);
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
      x_col: xCol,
      y_col: yCol,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS.ScatterPlot), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showPlot(data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <Select options={columns} ref={xColRef} text="X축 컬럼" onChange={handleChange} />
        <Select options={columns} ref={yColRef} text="Y축 컬럼" onChange={handleChange} />
      </div>
    </form>
  );
}

export default React.memo(ScatterPlot);
