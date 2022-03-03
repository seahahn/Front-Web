import React from "react";
import * as Models from "./Models";

function Model({ model, handleSteps }) {
  // console.log(model);
  const modelNameMapping = {
    linear_regression: "Linear",
    logistic_regression: "Logistic",
  };
  if (model !== "미지정") {
    // console.log(modelNameMapping[model]);
    const Options = Models[modelNameMapping[model]]; // 선택된 모델의 옵션 가져오기
    return <Options handleSteps={handleSteps} />;
  } else {
    return null;
  }
}

export default React.memo(Model);
