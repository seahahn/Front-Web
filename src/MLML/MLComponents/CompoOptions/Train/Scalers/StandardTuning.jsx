import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";

function StandardTuning({ step, handleSteps }) {
  const initialOpts = {
    // copy: true,
    // with_mean: true,
    // with_std: true,
  };

  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step ? step : initialOpts); // 입력해야 할 파라미터 설정

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ scaler: options });
  }, [handleSteps, options]);

  const copyRef = useRef();
  const withMeanRef = useRef();
  const withStdRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, checked } = event.target;
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
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Standard Scaler</h3>
      <div className="flex flex-row space-x-2">
        <Switch
          ref={withMeanRef}
          text="withMean : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"with_mean"}
          checked={options.with_mean ? true : false}
        />
        <Switch
          ref={withStdRef}
          text="withStd : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"with_std"}
          checked={options.with_std ? true : false}
        />
      </div>
    </div>
  );
}

export default React.memo(StandardTuning);
