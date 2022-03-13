import React from "react";
import * as Encoders from ".";

function EncoderTuning({ encoder, encVal, colObjArray, handleSteps, steps, optimizer }) {
  const handleOptions = ["value", "error", "return_nan", "indicator"];
  const handleOptsObjArray = [...handleOptions.map((option) => ({ label: option, value: option }))]; // MultiSelect에서 사용하는 객체 목록

  const step = steps.hasOwnProperty("encoders") ? steps.encoders[encVal] : null;

  const Options = Encoders[encoder]; // 선택된 인코더의 옵션 가져오기
  // console.log(encoder);
  // console.log(Options);
  return <Options handleOptions={handleOptsObjArray} colObjArray={colObjArray} handleSteps={handleSteps} steps={steps} step={step} optimizer={optimizer} />;
}

export default React.memo(EncoderTuning);
