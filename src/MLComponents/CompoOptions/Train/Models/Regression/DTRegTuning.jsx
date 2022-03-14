import React, { useState, useEffect } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import MultiSelect from "react-select";
import { Select, TuningParam } from "MLComponents/CompoOptions/CompoPiece";
import { convertNumParams, equalsIgnoreOrder, colArrayToObjArray } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html
 * Decision Tree Regressor
 */
function DTRegTuning({ step, handleSteps, optimizer }) {
  const criterion = ["squared_error", "friedman_mse", "absolute_error", "poisson"];
  const splitter = ["best", "random"];
  const maxFeatures = ["auto", "sqrt", "log2"];
  // const maxFeaturesText = ["None", "auto", "sqrt", "log2"];

  const initialOpts = {
    criterion: [], // {“squared_error”, “friedman_mse”, “absolute_error”, “poisson”}, default=”squared_error”
    splitter: [], // {“best”, “random”}, default=”best”
    max_features: [], // int, float or {“auto”, “sqrt”, “log2”}, default=None
    max_depth: ["_randint", null, null, null], // int, default=None
    max_leaf_nodes: ["_randint", null, null, null], // int, default=None
    min_samples_split: ["_randint", null, null, null], // int or float, default=2
    min_samples_leaf: ["_randint", null, null, null], // int or float, default=1
    min_weight_fraction_leaf: ["_randint", null, null, null], // float, default=0.0
    min_impurity_decrease: ["_randint", null, null, null], // float, default=0.0
    ccp_alpha: ["_randint", null, null, null], // non-negative float, default=0.0
    // random_state: null, // int, RandomState instance, default=None
  };

  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // criterion: "squared_error", // {“squared_error”, “friedman_mse”, “absolute_error”, “poisson”}, default=”squared_error”
    // splitter: "best", // {“best”, “random”}, default=”best”
    // max_features: null, // int, float or {“auto”, “sqrt”, “log2”}, default=None
    // max_depth: null, // int, default=None
    // max_leaf_nodes: null, // int, default=None
    // min_samples_split: 2, // int or float, default=2
    // min_samples_leaf: 1, // int or float, default=1
    // min_weight_fraction_leaf: 0.0, // float, default=0.0
    // min_impurity_decrease: 0.0, // float, default=0.0
    // ccp_alpha: 0.0, // non-negative float, default=0.0
    // random_state: null, // int, RandomState instance, default=None
  }; // 초기값 저장하여 input 미입력 시 기본값 넣기

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ model: options });
  }, [handleSteps, options]);

  // 옵션 상태 값 저장
  // const handleChange = (event) => {
  //   const { name, value, checked } = event.target;
  //   if (event.target.type === "checkbox") {
  //     setOptions({
  //       ...options,
  //       [name]: checked,
  //     });
  //   } else {
  //     convertNumParams(name, value, options, setOptions, defaultVal);
  //   }
  // };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Decision Tree Regressor</h3>
      <div className="flex flex-row space-x-2">
        <label className="flex-1 self-center">
          criterion
          <MultiSelect
            options={colArrayToObjArray(criterion)}
            onChange={(e) => {
              setOptions({
                ...options,
                criterion: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.criterion)}
          />
        </label>
        <label className="flex-1 self-center">
          splitter
          <MultiSelect
            options={colArrayToObjArray(splitter)}
            onChange={(e) => {
              setOptions({
                ...options,
                splitter: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.splitter)}
          />
        </label>
        <label className="flex-1 self-center">
          max_features
          <MultiSelect
            options={colArrayToObjArray(maxFeatures)}
            onChange={(e) => {
              setOptions({
                ...options,
                max_features: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.max_features)}
          />
        </label>
        {/* <Select
          className="flex-1 self-center justify-self-stretch"
          options={criterion}
          text="criterion"
          onChange={handleChange}
          name="criterion"
          defaultValue={options.criterion}
        /> */}
        {/* <Select
          className="flex-1 self-center justify-self-stretch"
          options={splitter}
          text="splitter"
          onChange={handleChange}
          name="splitter"
          defaultValue={options.splitter}
        /> */}
        {/* <Select
          className="flex-1 self-center justify-self-stretch"
          options={maxFeatures}
          optionText={maxFeaturesText}
          text="max_features"
          onChange={handleChange}
          name="max_features"
          defaultValue={options.max_features}
        /> */}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>max_depth :</label>
        <TuningParam name={"max_depth"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_depth"
          defaultValue={options.max_depth}
        /> */}
        <label>max_leaf_nodes :</label>
        <TuningParam name={"max_leaf_nodes"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_leaf_nodes"
          defaultValue={options.max_leaf_nodes}
        /> */}
        <label>min_samples_split :</label>
        <TuningParam name={"min_samples_split"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={2}
          placeholder={"기본값 2"}
          onChange={handleChange}
          name="min_samples_split"
          defaultValue={options.min_samples_split}
        /> */}
        <label>min_samples_leaf :</label>
        <TuningParam name={"min_samples_leaf"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 1"}
          onChange={handleChange}
          name="min_samples_leaf"
          defaultValue={options.min_samples_leaf}
        /> */}
        <label>min_weight_fraction_leaf :</label>
        <TuningParam name={"min_weight_fraction_leaf"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="min_weight_fraction_leaf"
          defaultValue={options.min_weight_fraction_leaf}
        /> */}
        <label>min_impurity_decrease :</label>
        <TuningParam name={"min_impurity_decrease"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="min_impurity_decrease"
          defaultValue={options.min_impurity_decrease}
        /> */}
        <label>ccp_alpha :</label>
        <TuningParam name={"ccp_alpha"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={0}
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="ccp_alpha"
          defaultValue={options.ccp_alpha}
        /> */}
        {/* <label>random_state :</label>
        <input
          className={inputStyle}
          type="number"
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="random_state"
          defaultValue={options.random_state}
        /> */}
      </div>
    </div>
  );
}

export default React.memo(DTRegTuning);
