import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "App";
import { ContainerContext } from "MLComponents/Container";
import { MODEL_KEY_PREFIX, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";
import { showDataResult, getModelSteps } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 정보(steps) 확인을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인에 어떤 인코더, 스케일러, 모델이 포함되어 있는지 보여준다.
 *
 * @returns pipeline의 steps
 */
function ModelSteps({ formId, resultId, isLoading, setIsLoading, render }) {
  const { dfd } = useContext(AppContext);
  const { modelListRef } = useContext(ContainerContext);
  const initialModelList = modelListRef.current ? modelListRef.current.map((model) => model.model_name) : [];

  const [modelList, setModelList] = useState(initialModelList);
  const [modelName, setModelName] = useState(modelList[0]);

  useEffect(() => {
    setModelList(modelListRef.current ? modelListRef.current.map((model) => model.model_name) : []);
  }, [render]);

  const handleChange = (event) => {
    setModelName(event.target.value);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것
    getModelSteps(MODEL_KEY_PREFIX + USER_IDX, modelName, true).then((res) => showDataResult(dfd, res, resultId));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select className="flex-1 self-center justify-self-stretch" options={modelList} text="모델 목록" onChange={handleChange} />
    </form>
  );
}

export default React.memo(ModelSteps);
