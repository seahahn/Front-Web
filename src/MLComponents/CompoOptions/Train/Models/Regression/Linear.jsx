import React, { useState, useEffect, useRef } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch } from "MLComponents/CompoOptions/CompoPiece";

function Linear({ handleSteps }) {
  // 옵션 상태 값 저장
  const [options, setOptions] = useState({
    fit_intercept: true,
    copy_X: true,
    n_jobs: -1,
    positive: false,
  }); // 입력해야 할 파라미터 설정
  console.log(options);

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    // console.log(options);
    handleSteps({ model: options });
  }, [handleSteps, options]);

  const fitInterceptRef = useRef();
  const copyXRef = useRef();
  const nJobsRef = useRef();
  const positiveRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    console.log(event.target);
    if (event.target.type === "checkbox") {
      setOptions({
        ...options,
        [name]: checked,
      });
    } else {
      value === "" ? setOptions({ ...options, [name]: -1 }) : setOptions({ ...options, [name]: value });
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Linear Regression</h3>
      <div className="flex flex-row space-x-2">
        <Switch ref={fitInterceptRef} text="fitIntercept : " onChange={handleChange} name={"fit_intercept"} checked={options.fit_intercept} />
        <Switch ref={copyXRef} text="copyX : " onChange={handleChange} name={"copy_X"} checked={options.copy_X} />
        <Switch ref={positiveRef} text="positive : " onChange={handleChange} name={"positive"} checked={options.positive} />
      </div>
      <label>
        n_jobs :
        <input
          ref={nJobsRef}
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"미입력시 -1(최대 자원 사용)"}
          onChange={handleChange}
          name={"n_jobs"}
        />
      </label>
    </div>
  );
}

export default React.memo(Linear);
