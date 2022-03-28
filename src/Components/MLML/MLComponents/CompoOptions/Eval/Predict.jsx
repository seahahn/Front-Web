import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_EVAL, httpConfig, MODEL_KEY_PREFIX } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { ContainerContext } from "Components/MLML/MLComponents/Container";
import { BlockContext } from "Components/MLML/MLComponents/Column";
import { showDataResult, loadTrainTest, saveYPred } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { AppContext } from "App";

/**
 * 테스트셋의 예측 결과(y_pred)를 얻기 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_test를 전송하여 결과를 가져온다.
 * 만약 분류 모델인 경우 y_pred_proba도 가져온다.
 *
 * @returns {
            "y_pred"      : pd.DataFrame(pipe.predict(X_test)).to_json(orient="records"),
            "y_pred_proba": pd.DataFrame(pipe.predict_proba(X_test)).to_json(orient="records") # 분류 모델인 경우 포함
        }
 */
function Predict({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { userIdx } = useContext(AppContext);
  const { dfd } = useContext(MLMLContext);
  const { modelListRef } = useContext(ContainerContext);
  const { blockId } = useContext(BlockContext);

  const initialModelList = modelListRef.current ? modelListRef.current.map((model) => model.model_name) : [];
  const [modelList, setModelList] = useState(initialModelList);

  useEffect(() => {
    setModelList(modelListRef.current ? modelListRef.current.map((model) => model.model_name) : []);
    setParam({
      ...param,
      name: modelListRef.current && modelListRef.current.length > 0 ? modelListRef.current[0].model_name : "",
    });
  }, [render]);

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

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      key: MODEL_KEY_PREFIX + userIdx,
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_EVAL.Predict), paramResult);
    const Xs = _.pick(loadTrainTest(blockId), ["X_train", "X_valid", "X_test"]); // 특성 데이터셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(Xs)))
      .then((response) => response.json())
      .then((data) => {
        saveYPred(blockId, data);
        // showDataResult(dfd, data.y_pred, resultId); // y_pred 결과만 보여주기
        showDataResult(dfd, "Prediction completed.", resultId); // y_pred 결과만 보여주기
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select
        name="name"
        className="flex-1 self-center justify-self-stretch"
        options={modelList}
        text="모델 목록"
        onChange={handleChange}
        defaultValue={param.name ? param.name : modelList[0]}
      />
    </form>
  );
}

export default React.memo(Predict);
