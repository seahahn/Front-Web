import React, { useContext, useEffect } from "react";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_EVAL, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { METRICS_CLS, METRICS_REG } from "Components/MLML/MLComponents/constants";
import { BlockContext } from "Components/MLML/MLComponents/Column";
import { showDataResult, loadYPred } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 훈련 기능을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train, y_train을 전송하여 훈련을 진행한다.
 * 만약 인코더 또는 스케일러까지만 포함된 파이프라인을 사용하는 경우, 해당 부분까지 fit 진행.
 *
 * @returns "training completed"
 */
function Score({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { blockId } = useContext(BlockContext);

  useEffect(() => {
    setParam({
      ...param,
      metric: param.modelCategory === "reg" ? METRICS_REG[0] : METRICS_CLS[0],
    });
  }, [param.modelCategory]);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
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

    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_EVAL.Score), param);
    const ys = loadYPred(blockId); // 타겟 실제 데이터와 타겟 예측 데이터 가져오기
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(ys), "POST", true))
      .then((response) => response.json())
      .then((data) => {
        if (data.hasOwnProperty("X_train")) {
          document.getElementById(resultId).innerHTML = Object.entries(data)
            .map((x) => [x[0].split("_")[1], x[1]].join(" : "))
            .join("<br/>");
        } else {
          showDataResult(data, resultId);
        }
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-row space-x-2">
        <Select
          name={"modelCategory"}
          className="flex-1 justify-self-stretch"
          options={["reg", "cls"]}
          optionText={["회귀", "분류"]}
          text="모델 유형"
          onChange={handleChange}
          defaultValue={param.modelCategory}
        />
        <Select
          name={"metric"}
          className="flex-1 justify-self-stretch"
          options={param.modelCategory === "reg" ? METRICS_REG : METRICS_CLS}
          text="평가 지표 목록"
          onChange={handleChange}
          defaultValue={param.metric}
        />
      </div>
    </form>
  );
}

export default React.memo(Score);
