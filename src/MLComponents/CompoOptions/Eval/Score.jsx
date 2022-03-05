import React, { useState, useContext, useRef } from "react";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_EVAL, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { METRICS_CLS, METRICS_REG } from "MLComponents/constants";
import { BlockContext } from "MLComponents/Column";
import { showDataResult, loadYPred } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 훈련 기능을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train, y_train을 전송하여 훈련을 진행한다.
 * 만약 인코더 또는 스케일러까지만 포함된 파이프라인을 사용하는 경우, 해당 부분까지 fit 진행.
 *
 * @returns "training completed"
 */
function Score({ formId, resultId }) {
  const { dfd } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const [modelCategory, setModelCategory] = useState("reg");
  const [metric, setMetric] = useState();

  const modelCategoryRef = useRef();
  const metricRef = useRef();

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    switch (event.target) {
      case modelCategoryRef.current:
        setModelCategory(event.target.value);
        break;
      case metricRef.current:
        setMetric(event.target.value);
        break;
      default:
        break;
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      metric: metric,
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_EVAL.Score), params);
    const ys = loadYPred(blockId); // 타겟 실제 데이터와 타겟 예측 데이터 가져오기
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(ys)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row space-x-2">
        <Select
          ref={modelCategoryRef}
          className="flex-1 justify-self-stretch"
          options={["reg", "cls"]}
          optionText={["회귀", "분류"]}
          text="모델 유형"
          onChange={handleChange}
        />
        <Select
          ref={metricRef}
          className="flex-1 justify-self-stretch"
          options={modelCategory === "reg" ? METRICS_REG : METRICS_CLS}
          text="평가 지표 목록"
          onChange={handleChange}
        />
      </div>
    </form>
  );
}

export default React.memo(Score);
