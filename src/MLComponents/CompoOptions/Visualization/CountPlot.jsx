import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLComponents/Column";

function CountPlot({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  const [col, setCol] = useState(columns[0]); // Select
  const [title, setTitle] = useState(""); // input text
  const [height, setHeight] = useState(250); // input text
  const [width, setWidth] = useState(0.9); // input text

  // DOM 접근 위한 Ref
  const colRef = useRef();
  const titleRef = useRef();
  const heightRef = useRef();
  const widthRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    console.log(event.target.value);
    switch (event.target) {
      case colRef.current:
        setCol(event.target.value);
        break;
      case titleRef.current:
        setTitle(event.target.value);
        break;
      case heightRef.current:
        setHeight(event.target.value);
        break;
      case widthRef.current:
        setWidth(event.target.value);
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
      title: title,
      height: height,
      width: width,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS.CountPlot), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

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
        <Select options={columns} ref={colRef} text="시각화 대상 컬럼" onChange={handleChange} />
        <label>
          차트 제목
          <input ref={titleRef} className={inputStyle} placeholder="미지정 시 제목 없음" onChange={handleChange} />
        </label>
        <label>
          차트 높이
          <input ref={heightRef} className={inputStyle} type="number" placeholder="기본값 250" onChange={handleChange} />
        </label>
        <label>
          막대(Bar) 너비
          <input ref={widthRef} className={inputStyle} type="number" min="0.001" step="0.001" placeholder="기본값 0.9" onChange={handleChange} />
        </label>
      </div>
    </form>
  );
}

export default React.memo(CountPlot);
