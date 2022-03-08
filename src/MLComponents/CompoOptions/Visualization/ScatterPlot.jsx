import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showPlot, getColumns } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLComponents/Column";

function ScatterPlot({ formId, resultId, param, setParam }) {
  const { storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS.ScatterPlot), param);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

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
        <Select options={columns} name={"x_col"} text="X축 컬럼" onChange={handleChange} defaultValue={param.x_col ? param.x_col : columns[0]} />
        <Select options={columns} name={"y_col"} text="Y축 컬럼" onChange={handleChange} defaultValue={param.y_col ? param.y_col : columns[0]} />
      </div>
    </form>
  );
}

export default React.memo(ScatterPlot);
