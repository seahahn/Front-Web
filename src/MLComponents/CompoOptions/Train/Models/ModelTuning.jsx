import React from "react";
import * as Models from ".";
import { MODELS_TUNING_MAPPING } from "MLComponents/constants";

function ModelTuning({ model, step, handleSteps, optimizer }) {
  if (model !== "" && model !== "None") {
    const Options = Models[MODELS_TUNING_MAPPING[model]]; // 선택된 모델의 옵션 가져오기
    console.log(model);
    return <Options step={step} handleSteps={handleSteps} optimizer={optimizer} />;
  } else {
    return null;
  }
}

export default React.memo(ModelTuning);
