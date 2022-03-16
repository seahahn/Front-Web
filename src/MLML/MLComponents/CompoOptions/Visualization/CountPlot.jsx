import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { showPlot, getColumns } from "MLML/MLComponents/CompoOptions/util";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Select } from "MLML/MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLML/MLComponents/Column";

function CountPlot({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
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
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_PLOT, URLS_PREPROCESS.CountPlot), param);
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
        <Select options={columns} name={"col"} text="시각화 대상 컬럼" onChange={handleChange} defaultValue={param.col ? param.col : columns[0]} />
        <label>
          차트 제목
          <input name={"title"} className={inputStyle} placeholder="미지정 시 제목 없음" onChange={handleChange} defaultValue={param.title} />
        </label>
        <label>
          차트 높이
          <input name={"height"} className={inputStyle} type="number" placeholder="기본값 250" onChange={handleChange} defaultValue={param.height} />
        </label>
        <label>
          막대(Bar) 너비
          <input
            name={"width"}
            className={inputStyle}
            type="number"
            min="0.001"
            step="0.001"
            placeholder="기본값 0.9"
            onChange={handleChange}
            defaultValue={param.width}
          />
        </label>
      </div>
    </form>
  );
}

export default CountPlot;
