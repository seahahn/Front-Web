import React, { useState, useEffect } from "react";
import _ from "lodash";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import { convertNumParams, equalsIgnoreOrder } from "MLML/MLComponents/CompoOptions/util";

function LinearTuning({ step, handleSteps }) {
  const initialOpts = {
    // fit_intercept: true,
    // copy_X: true,
    // n_jobs: 1,
    // positive: false,
  };
  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // fit_intercept: true,
    // copy_X: true,
    // n_jobs: 1,
    // positive: false,
  };

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ model: options });
  }, [handleSteps, options]);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setOptions(
        checked
          ? {
              ...options,
              [name]: [true, false],
            }
          : _.omit(
              {
                ...options,
              },
              [name]
            )
      );
    }
    // else {
    //   convertNumParams(name, value, options, setOptions, defaultVal);
    // }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Linear Regression</h3>
      <div className="flex flex-row space-x-2">
        <Switch
          text="fitIntercept : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"fit_intercept"}
          checked={options.fit_intercept ? true : false}
        />
        {/* <Switch text="copyX : " onChange={handleChange} name={"copy_X"} checked={options.copy_X} /> */}
        <Switch
          text="positive : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"positive"}
          checked={options.positive ? true : false}
        />
      </div>
      {/* <label>
        n_jobs :
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 1"} onChange={handleChange} name={"n_jobs"} defaultValue={options.n_jobs} />
      </label> */}
    </div>
  );
}

export default React.memo(LinearTuning);
