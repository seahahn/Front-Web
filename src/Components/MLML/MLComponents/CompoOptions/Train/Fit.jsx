import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig, MODEL_KEY_PREFIX } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { ContainerContext } from "Components/MLML/MLComponents/Container";
import { BlockContext } from "Components/MLML/MLComponents/Column";
import { showDataResult, loadTrainTest } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { AppContext } from "App";

/**
 * 모델 훈련 기능을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train, y_train을 전송하여 훈련을 진행한다.
 * 만약 인코더 또는 스케일러까지만 포함된 파이프라인을 사용하는 경우, 해당 부분까지 fit 진행.
 *
 * @returns "training completed"
 */
function Fit({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { userIdx } = useContext(AppContext);
  const { modelListRef } = useContext(ContainerContext);
  const { blockId } = useContext(BlockContext);

  const initialModelList = modelListRef.current ? modelListRef.current.map((model) => model.model_name) : [];
  const [modelList, setModelList] = useState(initialModelList);

  useEffect(() => {
    setModelList(modelListRef.current ? modelListRef.current.map((model) => model.model_name) : []);
  }, [render]);

  useEffect(() => {
    setParam({
      ...param,
      name: modelList[0],
    });
  }, [modelList]);

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

    const paramResult = {
      ...param,
      key: MODEL_KEY_PREFIX + userIdx,
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.Fit), paramResult);
    const df = _.pick(loadTrainTest(blockId), ["X_train", "y_train"]); // 훈련 데이터셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(data, resultId);
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

export default React.memo(Fit);
