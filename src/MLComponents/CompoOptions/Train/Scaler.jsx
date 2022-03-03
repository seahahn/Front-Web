import React from "react";
import * as Scalers from "./Scalers";

function Scaler({ scaler, handleSteps }) {
  // console.log(scaler);
  const scalerNameMapping = {
    standard_scaler: "Standard",
    minmax_scaler: "MinMax",
  };
  if (scaler !== "미지정") {
    // console.log(scalerNameMapping[scaler]);
    const Options = Scalers[scalerNameMapping[scaler]]; // 선택된 스케일러의 옵션 가져오기
    return <Options handleSteps={handleSteps} />;
  } else {
    return null;
  }
}

export default React.memo(Scaler);
