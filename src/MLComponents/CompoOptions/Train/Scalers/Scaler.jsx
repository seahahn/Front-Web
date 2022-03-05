import React from "react";
import * as Scalers from ".";
import { SCALERS_MAPPING } from "MLComponents/constants";

function Scaler({ scaler, handleSteps }) {
  if (scaler !== "None") {
    const Options = Scalers[SCALERS_MAPPING[scaler]]; // 선택된 스케일러의 옵션 가져오기
    return <Options handleSteps={handleSteps} />;
  } else {
    return null;
  }
}

export default React.memo(Scaler);
