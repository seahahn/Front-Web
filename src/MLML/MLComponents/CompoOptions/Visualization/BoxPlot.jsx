import React, { useContext, useRef } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { showPlot, getColumns } from "MLML/MLComponents/CompoOptions/util";
import MultiSelect from "react-select";
import { ColorPicker } from "MLML/MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLML/MLComponents/Column";

function BoxPlot({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  // DOM 접근 위한 Ref
  const colsRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setParam({
      ...param,
      cols: e,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      cols: [...param.cols.map((col) => col.value)],
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS.BoxPlot), paramResult);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showPlot(data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row mr-4 space-x-2">
          <label className="self-center">시각화 대상 컬럼</label>
          <MultiSelect
            ref={colsRef}
            options={colObjArray}
            onChange={settingCols}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={param.cols}
          />
        </div>
        <div className="flex flex-row">
          <ColorPicker
            labelText="배경색 선택"
            defaultColor={param.background_fill_color}
            colorState={param.background_fill_color}
            setColorState={(value) =>
              setParam({
                ...param,
                background_fill_color: value,
              })
            }
          />
          <ColorPicker
            labelText="상단 박스 색 선택"
            defaultColor={param.fill_color1}
            colorState={param.fill_color1}
            setColorState={(value) =>
              setParam({
                ...param,
                fill_color1: value,
              })
            }
          />
          <ColorPicker
            labelText="하단 박스 색 선택"
            defaultColor={param.fill_color2}
            colorState={param.fill_color2}
            setColorState={(value) =>
              setParam({
                ...param,
                fill_color2: value,
              })
            }
          />
        </div>
      </div>
    </form>
  );
}

export default BoxPlot;
