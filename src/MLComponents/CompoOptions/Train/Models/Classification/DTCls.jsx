import React, { useState, useEffect, useRef } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import classNames from "classnames";
import { convertNumParams, equalsIgnoreOrder } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html
 * Decision Tree Classifier
 */
function DTCls({ step, handleSteps }) {
  const criterion = ["gini", "entropy"];
  const splitter = ["best", "random"];
  const maxFeatures = [null, "auto", "sqrt", "log2"];
  const maxFeaturesText = ["None", "auto", "sqrt", "log2"];

  const initialOpts = {
    criterion: "gini", // {“gini”, “entropy”}, default=”gini”
    splitter: "best", // {“best”, “random”}, default=”best”
    max_features: null, // int, float or {“auto”, “sqrt”, “log2”}, default=None
    max_depth: null, // int, default=None
    min_samples_split: 2, // int or float, default=2
    min_samples_leaf: 1, // int or float, default=1
    min_weight_fraction_leaf: 0.0, // float, default=0.0
    max_leaf_nodes: null, // int, default=None
    min_impurity_decrease: 0.0, // float, default=0.0
    class_weight: null, // dict, list of dict or “balanced”, default=None
    ccp_alpha: 0.0, // non-negative float, default=0.0
    random_state: null, // int, RandomState instance, default=None
  };

  // 옵션 상태 값 저장

  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // criterion: "gini", // {“gini”, “entropy”}, default=”gini”
    // splitter: "best", // {“best”, “random”}, default=”best”
    max_depth: null, // int, default=None
    min_samples_split: 2, // int or float, default=2
    min_samples_leaf: 1, // int or float, default=1
    min_weight_fraction_leaf: 0.0, // float, default=0.0
    max_features: null, // int, float or {“auto”, “sqrt”, “log2”}, default=None
    max_leaf_nodes: null, // int, default=None
    min_impurity_decrease: 0.0, // float, default=0.0
    class_weight: null, // dict, list of dict or “balanced”, default=None
    ccp_alpha: 0.0, // non-negative float, default=0.0
    random_state: null, // int, RandomState instance, default=None
  }; // 초기값 저장하여 input 미입력 시 기본값 넣기

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    const classW = options.class_weight === "unbalanced" ? null : options.class_weight;
    handleSteps({ model: { ...options, class_weight: classW } });
  }, [handleSteps, options]);

  const classWeightRef = useRef();

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setOptions({
        ...options,
        [name]: checked,
      });
    } else if (name === "class_weight") {
      value === "" ? setOptions({ ...options, [name]: null }) : setOptions({ ...options, [name]: value });
    } else if (name === "class_weight_dict") {
      try {
        setOptions({ ...options, class_weight: JSON.parse(value) });
      } catch (error) {
        setOptions({ ...options, class_weight: "unbalanced" });
        classWeightRef.current.style.border = "1px solid red";
      }
    } else {
      // 수치형인 경우 Number로 변환
      convertNumParams(name, value, options, setOptions, defaultVal);
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Decision Tree Classifier</h3>
      <div className="flex flex-row space-x-2">
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={criterion}
          text="criterion"
          onChange={handleChange}
          name="criterion"
          defaultValue={options.criterion}
        />
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={splitter}
          text="splitter"
          onChange={handleChange}
          name="splitter"
          defaultValue={options.splitter}
        />
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={maxFeatures}
          optionText={maxFeaturesText}
          text="max_features"
          onChange={handleChange}
          name="max_features"
          defaultValue={options.max_features}
        />
      </div>
      <div className="flex flex-row space-x-2">
        <Select
          className="self-center justify-self-stretch"
          options={["", "balanced", "unbalanced"]}
          optionText={["미지정", "balanced", "unbalanced"]}
          text="class_weight :"
          onChange={handleChange}
          name={"class_weight"}
          defaultValue={options.class_weight}
        />
        <div className={classNames([null, "balanced"].includes(options.class_weight) ? "hidden" : "", "flex flex-row flex-1")}>
          <label className="self-center">weight 쌍 입력 :</label>
          <input
            ref={classWeightRef}
            className={inputStyle + " flex-auto focus:ring-2 focus:ring-red-500"}
            type="text"
            placeholder={'예시) {"class_label1": weight1, "class_label2": weight2, ...}'}
            onChange={handleChange}
            name={"class_weight_dict"}
            defaultValue={["", "balanced"].includes(options.class_weight) ? "" : JSON.stringify(options.class_weight)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>max_depth :</label>
        <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_depth"
          defaultValue={options.max_depth}
        />
        <label>max_leaf_nodes :</label>
        <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_leaf_nodes"
          defaultValue={options.max_leaf_nodes}
        />
        <label>min_samples_split :</label>
        <input
          className={inputStyle}
          type="number"
          min={2}
          placeholder={"기본값 2"}
          onChange={handleChange}
          name="min_samples_split"
          defaultValue={options.min_samples_split}
        />
        <label>min_samples_leaf :</label>
        <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 1"}
          onChange={handleChange}
          name="min_samples_leaf"
          defaultValue={options.min_samples_leaf}
        />
        <label>min_weight_fraction_leaf :</label>
        <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="min_weight_fraction_leaf"
          defaultValue={options.min_weight_fraction_leaf}
        />
        <label>min_impurity_decrease :</label>
        <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="min_impurity_decrease"
          defaultValue={options.min_impurity_decrease}
        />
        <label>ccp_alpha :</label>
        <input
          className={inputStyle}
          type="number"
          min={0}
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="ccp_alpha"
          defaultValue={options.ccp_alpha}
        />
        <label>random_state :</label>
        <input
          className={inputStyle}
          type="number"
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="random_state"
          defaultValue={options.random_state}
        />
      </div>
    </div>
  );
}

export default React.memo(DTCls);
