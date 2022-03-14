import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import classNames from "classnames";
import { loadFeatureTarget, saveTrainTest, showShape } from "MLML/MLComponents/CompoOptions/util";
import { Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLML/MLComponents/Column";

function TrainTestSplit({ formId, resultId, param, setParam }) {
  const { dfd } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  // 컬럼명 입력 시 변화 감지하여 상태 값 변경
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
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.TrainTestSplit), param);
    const df = loadFeatureTarget(blockId); // 특성/타겟 나눈 데이터셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveTrainTest(dfd, blockId, data, resultId, param.valid);
        showShape(dfd, JSON.parse(data), resultId, param.valid);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className={classNames(param.valid ? "grid-rows-4" : "grid-rows-3", "grid  space-y-1")}>
          <Switch name={"valid"} text="검증셋 생성 여부" onChange={handleChange} checked={param.valid} />
          <div className={classNames("grid grid-cols-2")}>
            <label>테스트셋 비율</label>
            <input
              name={"test_size"}
              className={inputStyle}
              type="number"
              step="any"
              min={0}
              max={1}
              onChange={handleChange}
              placeholder="기본값 0.25"
              defaultValue={param.test_size}
            />
          </div>
          <div className={classNames(param.valid ? "" : "hidden", "grid grid-cols-2")}>
            <label>검증셋 비율</label>
            <input
              name={"valid_size"}
              className={inputStyle}
              type="number"
              step="any"
              min={0}
              max={1}
              onChange={handleChange}
              placeholder="기본값 0.25"
              defaultValue={param.valid_size}
            />
          </div>
          <div className={classNames("grid grid-cols-2")}>
            <label>시드 값</label>
            <input
              name={"random_state"}
              className={inputStyle}
              type="number"
              step="any"
              onChange={handleChange}
              placeholder="기본값 없음"
              defaultValue={param.random_state}
            />
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Switch name={"shuffle"} text="셔플 여부" onChange={handleChange} checked={param.shuffle} />
          <Switch name={"stratify"} text="타겟 균등 분포 여부" onChange={handleChange} checked={param.stratify} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(TrainTestSplit);
