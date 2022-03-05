import React from "react";
import * as Encoders from ".";

function Encoder({ encoder, handleSteps, colObjArray, steps }) {
  const handleOptions = ["value", "error", "return_nan", "indicator"];

  const Options = Encoders[encoder]; // 선택된 인코더의 옵션 가져오기
  return <Options handleOptions={handleOptions} handleSteps={handleSteps} steps={steps} colObjArray={colObjArray} />;
}

export default React.memo(Encoder);
