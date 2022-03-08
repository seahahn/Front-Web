import React from "react";
import * as Encoders from ".";

function Encoder({ encoder, encVal, colObjArray, handleSteps, steps }) {
  const handleOptions = ["value", "error", "return_nan", "indicator"];

  const step = steps.hasOwnProperty("encoders") ? steps.encoders[encVal] : null;

  const Options = Encoders[encoder]; // 선택된 인코더의 옵션 가져오기
  return <Options handleOptions={handleOptions} colObjArray={colObjArray} handleSteps={handleSteps} steps={steps} step={step} />;
}

export default React.memo(Encoder);
