import React, { useState, useEffect } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import { convertNumParams } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html
 * Decision Tree Regressor
 */
function DTReg({ handleSteps }) {
  const solver = ["squared_error", "friedman_mse", "absolute_error", "poisson"];
  const splitter = ["best", "random"];
  const maxFeatures = [null, "auto", "sqrt", "log2"];
  const maxFeaturesText = ["None", "auto", "sqrt", "log2"];

  // 옵션 상태 값 저장
  const [options, setOptions] = useState({
    solver: "squared_error", // {“squared_error”, “friedman_mse”, “absolute_error”, “poisson”}, default=”squared_error”
    splitter: "best", // {“best”, “random”}, default=”best”
    max_features: null, // int, float or {“auto”, “sqrt”, “log2”}, default=None
    max_depth: null, // int, default=None
    max_leaf_nodes: null, // int, default=None
    min_samples_split: 2, // int or float, default=2
    min_samples_leaf: 1, // int or float, default=1
    min_weight_fraction_leaf: 0.0, // float, default=0.0
    min_impurity_decrease: 0.0, // float, default=0.0
    ccp_alpha: 0.0, // non-negative float, default=0.0
    random_state: null, // int, RandomState instance, default=None
  }); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // solver: "squared_error", // {“squared_error”, “friedman_mse”, “absolute_error”, “poisson”}, default=”squared_error”
    // splitter: "best", // {“best”, “random”}, default=”best”
    // max_features: null, // int, float or {“auto”, “sqrt”, “log2”}, default=None
    max_depth: null, // int, default=None
    max_leaf_nodes: null, // int, default=None
    min_samples_split: 2, // int or float, default=2
    min_samples_leaf: 1, // int or float, default=1
    min_weight_fraction_leaf: 0.0, // float, default=0.0
    min_impurity_decrease: 0.0, // float, default=0.0
    ccp_alpha: 0.0, // non-negative float, default=0.0
    random_state: null, // int, RandomState instance, default=None
  }; // 초기값 저장하여 input 미입력 시 기본값 넣기

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ model: options });
  }, [handleSteps, options]);

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setOptions({
        ...options,
        [name]: checked,
      });
    } else {
      convertNumParams(name, value, options, setOptions, defaultVal);
      // value === "" ? setOptions({ ...options, [name]: defaultVal[name] }) : setOptions({ ...options, [name]: value });
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>DTReg Regression</h3>
      <div className="flex flex-row space-x-2">
        <Select className="flex-1 self-center justify-self-stretch" options={solver} text="solver" onChange={handleChange} name="solver" />
        <Select className="flex-1 self-center justify-self-stretch" options={splitter} text="splitter" onChange={handleChange} name="splitter" />
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={maxFeatures}
          optionText={maxFeaturesText}
          text="max_features"
          onChange={handleChange}
          name="max_features"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>max_depth :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 없음"} onChange={handleChange} name="max_depth" />
        <label>max_leaf_nodes :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 없음"} onChange={handleChange} name="max_leaf_nodes" />
        <label>min_samples_split :</label>
        <input className={inputStyle} type="number" min={2} placeholder={"기본값 2"} onChange={handleChange} name="min_samples_split" />
        <label>min_samples_leaf :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 1"} onChange={handleChange} name="min_samples_leaf" />
        <label>min_weight_fraction_leaf :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 0.0"} onChange={handleChange} name="min_weight_fraction_leaf" />
        <label>min_impurity_decrease :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 0.0"} onChange={handleChange} name="min_impurity_decrease" />
        <label>ccp_alpha :</label>
        <input className={inputStyle} type="number" min={0} placeholder={"기본값 0.0"} onChange={handleChange} name="ccp_alpha" />
        <label>random_state :</label>
        <input className={inputStyle} type="number" placeholder={"기본값 없음"} onChange={handleChange} name="random_state" />
      </div>
    </div>
  );
}

export default React.memo(DTReg);
