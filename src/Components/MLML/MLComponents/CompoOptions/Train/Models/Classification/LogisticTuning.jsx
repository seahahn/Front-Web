import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import MultiSelect from "react-select";
import { Switch, TuningParam } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { colArrayToObjArray } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html?highlight=logistic#sklearn.linear_model.LogisticRegression
 * Logistic Regression
 */
function LogisticTuning({ step, handleSteps, optimizer }) {
  const penalty = ["l2", "l1", "elasticnet", "none"];
  const solver = ["lbfgs", "newton-cg", "liblinear", "sag", "saga"];
  const multiClass = ["auto", "ovr", "multinomial"];

  const initialOpts = {
    penalty: [], // {‘l1’, ‘l2’, ‘elasticnet’, ‘none’}, default=’l2’
    solver: [], // {‘newton-cg’, ‘lbfgs’, ‘liblinear’, ‘sag’, ‘saga’}, default=’lbfgs’
    multi_class: [], // {‘auto’, ‘ovr’, ‘multinomial’}, default=’auto’
    // dual: false, // bool, default=False
    // fit_intercept: true, // bool, default=True
    // warm_start: false, // bool, default=False
    // class_weight: null, // dict(={class_label: weight}) or ‘balanced’, default=None
    tol: ["_randint", null, null, null], // float, default=1e-4
    C: ["_randint", null, null, null], // float, default=1.0
    intercept_scaling: ["_randint", null, null, null], // float, default=1
    max_iter: ["_randint", null, null, null], // int, default=100
    l1_ratio: ["_randint", null, null, null], // float, default=None
    // n_jobs: 1, // int, default=None
    // random_state: null, // int, RandomState instance, default=None
    // verbose: 0, // int, default=0
  };
  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step ? step : initialOpts); // 입력해야 할 파라미터 설정

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    handleSteps({ model: { ...options } });
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
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Logistic Regression</h3>
      <div className="flex flex-row space-x-2">
        <label className="flex-1 self-center">
          penalty
          <MultiSelect
            options={colArrayToObjArray(penalty)}
            onChange={(e) => {
              setOptions({
                ...options,
                penalty: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.penalty)}
          />
        </label>
        <label className="flex-1 self-center">
          solver
          <MultiSelect
            options={colArrayToObjArray(solver)}
            onChange={(e) => {
              setOptions({
                ...options,
                solver: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.solver)}
          />
        </label>
        <label className="flex-1 self-center">
          multiClass
          <MultiSelect
            options={colArrayToObjArray(multiClass)}
            onChange={(e) => {
              setOptions({
                ...options,
                multi_class: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.multi_class)}
          />
        </label>
      </div>
      <div className="flex flex-row space-x-2">
        <Switch
          text="dual : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"dual"}
          checked={options.dual ? true : false}
        />
        <Switch
          text="fit_intercept : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"fit_intercept"}
          checked={options.fit_intercept ? true : false}
        />
        <Switch
          text="warm_start : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"warm_start"}
          checked={options.warm_start ? true : false}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>tol :</label>
        <TuningParam name={"tol"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>C :</label>
        <TuningParam name={"C"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>intercept_scaling :</label>
        <TuningParam name={"intercept_scaling"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>max_iter :</label>
        <TuningParam name={"max_iter"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>l1_ratio :</label>
        <TuningParam name={"l1_ratio"} options={options} setOptions={setOptions} optimizer={optimizer} />
      </div>
    </div>
  );
}

export default React.memo(LogisticTuning);
