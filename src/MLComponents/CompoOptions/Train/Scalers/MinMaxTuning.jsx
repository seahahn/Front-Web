import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch } from "MLComponents/CompoOptions/CompoPiece";
import { equalsIgnoreOrder } from "MLComponents/CompoOptions/util";

function MinMaxTuning({ step, handleSteps }) {
  const initialOpts = {
    // feature_range: [0, 1],
    // copy: true,
    // clip: false,
  };
  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ scaler: options });
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
    //   name === "minRange"
    //     ? setOptions({ ...options, feature_range: [Number(value), options.feature_range[1]] })
    //     : setOptions({ ...options, feature_range: [options.feature_range[0], Number(value)] });
    // }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>MinMax Scaler</h3>
      {/* <div className="flex flex-row space-x-2">
        <label className="self-center">
          최솟값
          <input className={inputStyle} type="number" onChange={handleChange} name={"minRange"} defaultValue={options.feature_range[0]} />
        </label>
        <label className="self-center">
          최댓값
          <input className={inputStyle} type="number" onChange={handleChange} name={"maxRange"} defaultValue={options.feature_range[1]} />
        </label>
      </div> */}
      <div className="flex flex-row space-x-2">
        {/* <Switch text="copy : " onChange={handleChange} name={"copy"} checked={options.copy} /> */}
        <Switch
          text="clip : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"clip"}
          checked={options.clip ? true : false}
        />
      </div>
    </div>
  );
}

export default React.memo(MinMaxTuning);
