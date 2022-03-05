import React, { useState, useEffect, useRef } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch } from "MLComponents/CompoOptions/CompoPiece";

function MinMax({ handleSteps }) {
  // 옵션 상태 값 저장
  const [options, setOptions] = useState({
    feature_range: (0, 1),
    copy: true,
    clip: false,
  }); // 입력해야 할 파라미터 설정

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    // console.log(options);
    handleSteps({ scaler: options });
  }, [handleSteps, options]);

  const minRangeRef = useRef();
  const maxRangeRef = useRef();
  const copyRef = useRef();
  const clipRef = useRef();

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
      name === "minRange"
        ? setOptions({ ...options, feature_range: (value, options.feature_range[1]) })
        : setOptions({ ...options, feature_range: (options.feature_range[0], value) });
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>MinMax Scaler</h3>
      <div className="flex flex-row space-x-2">
        <label className="self-center">
          최솟값
          <input ref={minRangeRef} className={inputStyle} type="number" onChange={handleChange} name={"minRange"} />
        </label>
        <label className="self-center">
          최댓값
          <input ref={maxRangeRef} className={inputStyle} type="number" onChange={handleChange} name={"maxRange"} />
        </label>
      </div>
      <div className="flex flex-row space-x-2">
        <Switch ref={copyRef} text="copy : " onChange={handleChange} name={"copy"} checked={options.copy} />
        <Switch ref={clipRef} text="clip : " onChange={handleChange} name={"clip"} checked={options.clip} />
      </div>
    </div>
  );
}

export default React.memo(MinMax);
