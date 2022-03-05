import React, { useState, useContext } from "react";
import { AppContext } from "App";
import { showDataResult, getModelSteps, modelList } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 정보(steps) 확인을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인에 어떤 인코더, 스케일러, 모델이 포함되어 있는지 보여준다.
 *
 * @returns pipeline의 steps
 */
function ModelSteps({ formId, resultId }) {
  const { dfd } = useContext(AppContext);

  const [modelName, setModelName] = useState(modelList[0]);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    setModelName(event.target.value);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것
    getModelSteps("test", modelName).then((res) => showDataResult(dfd, res, resultId));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select className="flex-1 self-center justify-self-stretch" options={modelList} text="모델 목록" onChange={handleChange} />
    </form>
  );
}

export default React.memo(ModelSteps);
