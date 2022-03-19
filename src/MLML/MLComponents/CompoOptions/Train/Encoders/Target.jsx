import React, { useState, useRef, useEffect } from "react";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { convertNumParams, equalsIgnoreOrder, colArrayToObjArray } from "MLML/MLComponents/CompoOptions/util";

function Target({ handleOptions, colObjArray, handleSteps, steps, step }) {
  const initialOpts = {
    cols: null,
    drop_invariant: false,
    return_df: true,
    handle_unknown: "value",
    handle_missing: "value",
    min_samples_leaf: 1,
    smoothing: 1.0,
  };
  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // cols: null,
    // drop_invariant: false,
    // return_df: true,
    // handle_unknown: "value",
    // handle_missing: "value",
    min_samples_leaf: 1,
    smoothing: 1.0,
  };

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    steps.hasOwnProperty("encoders")
      ? handleSteps({ encoders: Object.assign(steps.encoders, { target_encoder: options }) })
      : handleSteps({ encoders: Object.assign({}, { target_encoder: options }) });
  }, [handleSteps, options]);

  const colsRef = useRef();
  const dropInvariantRef = useRef();
  const returnDfRef = useRef();
  const handleUnknownRef = useRef();
  const handleMissingRef = useRef();

  const minSamplesLeafRef = useRef();
  const smoothingRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setOptions({
      ...options,
      cols: [...e.map((col) => col.value)],
    });
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setOptions({
        ...options,
        [name]: checked,
      });
    } else {
      // 수치형인 경우 Number로 변환
      convertNumParams(name, value, options, setOptions, defaultVal);
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Target Encoder</h3>
      <div className="flex flex-row space-x-2">
        <label className="self-center">대상 컬럼 선택</label>
        <MultiSelect
          ref={colsRef}
          options={colObjArray}
          onChange={settingCols}
          className="flex-1"
          isMulti={true}
          closeMenuOnSelect={false}
          defaultValue={colArrayToObjArray(options.cols)}
        />
      </div>
      <div className="flex flex-row space-x-2">
        <Switch ref={dropInvariantRef} text="dropInvariant : " onChange={handleChange} name={"drop_invariant"} checked={options.drop_invariant} />
        <Switch ref={returnDfRef} text="returnDf : " onChange={handleChange} name={"return_df"} checked={options.return_df} />
      </div>
      <div className="flex flex-row space-x-2">
        <Select
          name={"handle_unknown"}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleUnknownRef}
          text="handleUnknown"
          onChange={handleChange}
          defaultValue={options.handle_unknown}
        />
        <Select
          name={"handle_missing"}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleMissingRef}
          text="handleMissing"
          onChange={handleChange}
          defaultValue={options.handle_missing}
        />
      </div>
      <div className="flex flex-row space-x-2">
        <label className="self-center">
          minSamplesLeaf
          <input
            ref={minSamplesLeafRef}
            className={inputStyle}
            type="number"
            placeholder={"기본값 1"}
            min={1}
            onChange={handleChange}
            name={"min_samples_leaf"}
            defaultValue={options.min_samples_leaf}
          />
        </label>
        <label className="self-center">
          smoothing
          <input
            ref={smoothingRef}
            className={inputStyle}
            type="number"
            step="any"
            placeholder={"기본값 1.0"}
            min={0}
            onChange={handleChange}
            name={"smoothing"}
            defaultValue={options.smoothing}
          />
        </label>
      </div>
    </div>
  );
}

export default React.memo(Target);
