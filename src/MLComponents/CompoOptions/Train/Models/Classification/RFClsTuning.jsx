import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import MultiSelect from "react-select";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch, TuningParam } from "MLComponents/CompoOptions/CompoPiece";
import classNames from "classnames";
import { colArrayToObjArray, equalsIgnoreOrder } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html
 * Decision Tree Regressor
 */
function RFClsTuning({ step, handleSteps, optimizer }) {
  const criterion = ["gini", "entropy"];
  const maxFeatures = ["auto", "sqrt", "log2"];
  // const maxFeaturesText = ["auto", "sqrt", "log2", "None"];

  const initialOpts = {
    criterion: [], // {“gini”, “entropy”}, default=”gini”
    max_features: [], // {“auto”, “sqrt”, “log2”}, int or float, default=”auto”
    // class_weight: null, // {“balanced”, “balanced_subsample”}, dict or list of dicts, default=None
    n_estimators: ["randint", null, null, null], // int, default=100
    max_depth: ["randint", null, null, null], // int, default=None
    max_leaf_nodes: ["randint", null, null, null], // int, default=None
    min_samples_split: ["randint", null, null, null], // int or float, default=2
    min_samples_leaf: ["randint", null, null, null], // int or float, default=1
    max_samples: ["randint", null, null, null], // int or float, default=None
    min_weight_fraction_leaf: ["randint", null, null, null], // float, default=0.0
    min_impurity_decrease: ["randint", null, null, null], // float, default=0.0
    ccp_alpha: ["randint", null, null, null], // non-negative float, default=0.0
    // n_jobs: 1, // int, default=None
    // bootstrap: true, // bool, default=True
    // oob_score: false, // bool, default=False
    // warm_start: false, // bool, default=False
    // random_state: null, // int, RandomState instance, default=None
  };

  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // criterion: "gini", // {“gini”, “entropy”}, default=”gini”
    // max_features: "auto", // {“auto”, “sqrt”, “log2”}, int or float, default=”auto”
    // class_weight: null, // {“balanced”, “balanced_subsample”}, dict or list of dicts, default=None
    // n_estimators: 100, // int, default=100
    // max_depth: null, // int, default=None
    // max_leaf_nodes: null, // int, default=None
    // min_samples_split: 2, // int or float, default=2
    // min_samples_leaf: 1, // int or float, default=1
    // max_samples: null, // int or float, default=None
    // min_weight_fraction_leaf: 0.0, // float, default=0.0
    // min_impurity_decrease: 0.0, // float, default=0.0
    // ccp_alpha: 0.0, // non-negative float, default=0.0
    // n_jobs: 1, // int, default=None
    // bootstrap: true, // bool, default=True
    // oob_score: false, // bool, default=False
    // warm_start: false, // bool, default=False
    // random_state: null, // int, RandomState instance, default=None
  }; // 초기값 저장하여 input 미입력 시 기본값 넣기

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    // const classW = options.class_weight === "unbalanced" ? null : options.class_weight;
    handleSteps({ model: { ...options } });
  }, [handleSteps, options]);

  const classWeightRef = useRef();

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
    // else if (name === "class_weight") {
    //   value === "" ? setOptions({ ...options, [name]: null }) : setOptions({ ...options, [name]: value });
    // } else if (name === "class_weight_dict") {
    //   try {
    //     console.log(value);
    //     setOptions({ ...options, class_weight: JSON.parse(value) });
    //   } catch (error) {
    //     setOptions({ ...options, class_weight: "unbalanced" });
    //     classWeightRef.current.style.border = "1px solid red";
    //   }
    // } else {
    //   // 수치형인 경우 Number로 변환
    //   convertNumParams(name, value, options, setOptions, defaultVal);
    // }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Random Forest Classifier</h3>
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
          maxFeatures
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
        />
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={maxFeatures}
          optionText={maxFeaturesText}
          text="max_features"
          onChange={handleChange}
          name="max_features"
          defaultValue={options.max_features}
        /> */}
      </div>
      {/* <div className="flex flex-row space-x-2">
        <Select
          className="self-center justify-self-stretch"
          options={["", "balanced", "balanced_subsample", "unbalanced"]}
          optionText={["미지정", "balanced", "balanced_subsample", "unbalanced"]}
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
      </div> */}
      <div className="grid grid-cols-2 gap-2">
        <label>n_estimators :</label>
        <TuningParam name={"n_estimators"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 100"}
          onChange={handleChange}
          name="n_estimators"
          defaultValue={options.n_estimators}
        /> */}
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
          step="any"
          placeholder={"기본값 2"}
          onChange={handleChange}
          name="min_samples_split"
          defaultValue={options.min_samples_split}
        />*/}
        <label>min_samples_leaf :</label>
        <TuningParam name={"min_samples_leaf"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          min={1}
          step="any"
          placeholder={"기본값 1"}
          onChange={handleChange}
          name="min_samples_leaf"
          defaultValue={options.min_samples_leaf}
        />*/}
        <label>max_samples :</label>
        <TuningParam name={"max_samples"} options={options} setOptions={setOptions} optimizer={optimizer} />
        {/* <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_samples"
          defaultValue={options.max_samples}
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
          step="any"
          placeholder={"기본값 0.0"}
          onChange={handleChange}
          name="ccp_alpha"
          defaultValue={options.ccp_alpha}
        />*/}
        {/* <label>n_jobs :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 1"} onChange={handleChange} name="n_jobs" defaultValue={options.n_jobs} />
        <label>random_state :</label>
        <input
          className={inputStyle}
          type="number"
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="random_state"
          defaultValue={options.random_state}
        /> */}
      </div>
      <div className="flex flex-row space-x-2">
        <Switch text="bootstrap : " onChange={handleChange} name={"bootstrap"} checked={options.bootstrap} />
        <Switch text="oob_score : " onChange={handleChange} name={"oob_score"} checked={options.oob_score} />
        <Switch text="warm_start : " onChange={handleChange} name={"warm_start"} checked={options.warm_start} />
      </div>
    </div>
  );
}

export default React.memo(RFClsTuning);
