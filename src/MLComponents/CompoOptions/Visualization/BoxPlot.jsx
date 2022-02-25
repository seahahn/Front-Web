import React, { useState, useContext, useRef, useCallback } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import MultiSelect from "react-select";
import { HexColorPicker } from "react-colorful";
import { ColorPicker } from "MLComponents/CompoOptions/CompoPiece";

function BoxPlot({ formId, resultId }) {
  const columns = getColumns(); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const [cols, setCols] = useState(columns[0]); // MultiSelect
  // const [tools, setTools] = useState(); // Select
  const [bgFillColor, setBgFillColor] = useState("#efefef"); // Color Picker
  const [fillColor1, setFillColor1] = useState("#E08E79"); // Color Picker
  const [fillColor2, setFillColor2] = useState("#3B8686"); // Color Picker

  const [isBgFillColorPickOpened, setIsBgFillColorPickOpened] = useState(false);
  const [isFillColor1PickOpened, setIsFillColor1PickOpened] = useState(false);
  const [isFillColor2PickOpened, setIsFillColor2PickOpened] = useState(false);

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

  // 선택한 색에 맞춰 해당 버튼 색 변경
  const bgColorBtn = {
    backgroundColor: bgFillColor,
  };
  const fillColor1Btn = {
    backgroundColor: fillColor1,
  };
  const fillColor2Btn = {
    backgroundColor: fillColor2,
  };

  // 색 선택창 열려 있으면 다른 영역 아무 곳이나 클릭 시 선택창 닫기
  const handleColorPickerClose = () => {
    setIsBgFillColorPickOpened(false);
    setIsFillColor1PickOpened(false);
    setIsFillColor2PickOpened(false);
  };

  const handleBgFillColor = useCallback(
    (color) => {
      setBgFillColor(color);
    },
    [bgColorBtn]
  );

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row mr-4 space-x-2">
          <label className="self-center">시각화 대상 컬럼</label>
          <MultiSelect ref={colsRef} options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div className="flex flex-row">
          <ColorPicker defaultColor={bgFillColor} setColorState={handleBgFillColor} />
          <div className="flex flex-col">
            <button
              type="button"
              style={bgColorBtn}
              className="text-black focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setIsBgFillColorPickOpened(!isBgFillColorPickOpened)}>
              배경색 선택
            </button>
            {isBgFillColorPickOpened ? (
              <div className="relative">
                {/* relative는 버튼 위치 기준으로 나오게 하기 위함 */}
                <div className="absolute z-10">
                  {/* absolute는 다른 요소 위에 겹쳐서 표시되게 하기 위함 */}
                  {/* fixed는 색 선택 창 외 전체화면 영역 어디든 클릭하면 닫히게 만드는 부분 만들기 위함 */}
                  <div className="fixed top-0 right-0 bottom-0 left-0" onClick={handleColorPickerClose} />
                  <HexColorPicker color={bgFillColor} onChange={setBgFillColor} />
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              style={fillColor1Btn}
              className="text-white focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setIsFillColor1PickOpened(!isFillColor1PickOpened)}>
              상단 박스 색 선택
            </button>
            {isFillColor1PickOpened ? (
              <div className="relative">
                {/* relative는 버튼 위치 기준으로 나오게 하기 위함 */}
                <div className="absolute z-10">
                  {/* absolute는 다른 요소 위에 겹쳐서 표시되게 하기 위함 */}
                  {/* fixed는 색 선택 창 외 전체화면 영역 어디든 클릭하면 닫히게 만드는 부분 만들기 위함 */}
                  <div className="fixed top-0 right-0 bottom-0 left-0" onClick={handleColorPickerClose} />
                  <HexColorPicker color={fillColor1} onChange={setFillColor1} />
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              style={fillColor2Btn}
              className="text-white focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => setIsFillColor2PickOpened(!isFillColor2PickOpened)}>
              하단 박스 색 선택
            </button>
            {isFillColor2PickOpened ? (
              <div className="relative">
                {/* relative는 버튼 위치 기준으로 나오게 하기 위함 */}
                <div className="absolute z-10">
                  {/* absolute는 다른 요소 위에 겹쳐서 표시되게 하기 위함 */}
                  {/* fixed는 색 선택 창 외 전체화면 영역 어디든 클릭하면 닫히게 만드는 부분 만들기 위함 */}
                  <div className="fixed top-0 right-0 bottom-0 left-0" onClick={handleColorPickerClose} />
                  <HexColorPicker color={fillColor2} onChange={setFillColor2} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}

export default React.memo(BoxPlot);
