import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import MultiSelect from "react-select";
import { ColorPicker } from "MLComponents/CompoOptions/CompoPiece";

function BoxPlot({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [cols, setCols] = useState(columns[0]); // MultiSelect
  // const [tools, setTools] = useState(); // Select
  const [bgFillColor, setBgFillColor] = useState("#efefef"); // Color Picker
  const [fillColor1, setFillColor1] = useState("#E08E79"); // Color Picker
  const [fillColor2, setFillColor2] = useState("#3B8686"); // Color Picker

  // DOM 접근 위한 Ref
  const colsRef = useRef();

  const { dfd, storage } = useContext(AppContext);

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setCols([...e.map((col) => col.value)]);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      cols: cols,
      // tools: tools,
      background_fill_color: bgFillColor ? bgFillColor : "",
      fill_color1: fillColor1 ? fillColor1 : "",
      fill_color2: fillColor2 ? fillColor2 : "",
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS.BoxPlot), params);
    const df = storage.getItem("df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showPlot(data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row mr-4 space-x-2">
          <label className="self-center">시각화 대상 컬럼</label>
          <MultiSelect ref={colsRef} options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div className="flex flex-row">
          <ColorPicker labelText="배경색 선택" defaultColor={bgFillColor} colorState={bgFillColor} setColorState={setBgFillColor} />
          <ColorPicker labelText="상단 박스 색 선택" defaultColor={fillColor1} colorState={fillColor1} setColorState={setFillColor1} />
          <ColorPicker labelText="하단 박스 색 선택" defaultColor={fillColor2} colorState={fillColor2} setColorState={setFillColor2} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(BoxPlot);
