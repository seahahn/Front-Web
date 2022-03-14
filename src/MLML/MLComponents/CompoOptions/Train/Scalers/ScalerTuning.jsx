import React from "react";
import * as Scalers from ".";
import { SCALERS_TUNING_MAPPING } from "MLML/MLComponents/constants";

function ScalerTuning({ scaler, step, handleSteps, optimizer }) {
  if (scaler !== "" && scaler !== "None") {
    const Options = Scalers[SCALERS_TUNING_MAPPING[scaler]]; // 선택된 스케일러의 옵션 가져오기
    return <Options step={step} handleSteps={handleSteps} optimizer={optimizer} />;
  } else {
    return null;
  }
}

export default React.memo(ScalerTuning);
