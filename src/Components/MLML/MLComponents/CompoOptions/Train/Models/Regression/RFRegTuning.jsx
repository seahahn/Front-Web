import React, { useState, useEffect } from "react";
import _ from "lodash";
import MultiSelect from "react-select";
import { Switch, TuningParam } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";
import { colArrayToObjArray } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html
 * Decision Tree Regressor
 */
function RFRegTuning({ step, handleSteps, optimizer }) {
  const criterion = ["squared_error", "absolute_error", "poisson"];
  const maxFeatures = ["auto", "sqrt", "log2"];

  const initialOpts = {
    criterion: [], // {“squared_error”, “absolute_error”, “poisson”}, default=”squared_error”
    max_features: [], // int, float or {“auto”, “sqrt”, “log2”}, default=None
    n_estimators: ["_randint", null, null, null], // int, default=100
    max_depth: ["_randint", null, null, null], // int, default=None
    max_leaf_nodes: ["_randint", null, null, null], // int, default=None
    min_samples_split: ["_randint", null, null, null], // int or float, default=2
    min_samples_leaf: ["_randint", null, null, null], // int or float, default=1
    max_samples: ["_randint", null, null, null], // int or float, default=None
    min_weight_fraction_leaf: ["_randint", null, null, null], // float, default=0.0
    min_impurity_decrease: ["_randint", null, null, null], // float, default=0.0
    ccp_alpha: ["_randint", null, null, null], // non-negative float, default=0.0
    // n_jobs: 1, // int, default=None
    // bootstrap: true, // bool, default=True
    // oob_score: false, // bool, default=False
    // warm_start: false, // bool, default=False
    // random_state: null, // int, RandomState instance, default=None
  };

  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step ? step : initialOpts); // 입력해야 할 파라미터 설정

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
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Random Forest Regressor</h3>
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
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>n_estimators :</label>
        <TuningParam name={"n_estimators"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>max_depth :</label>
        <TuningParam name={"max_depth"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>max_leaf_nodes :</label>
        <TuningParam name={"max_leaf_nodes"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>min_samples_split :</label>
        <TuningParam name={"min_samples_split"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>min_samples_leaf :</label>
        <TuningParam name={"min_samples_leaf"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>max_samples :</label>
        <TuningParam name={"max_samples"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>min_weight_fraction_leaf :</label>
        <TuningParam name={"min_weight_fraction_leaf"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>min_impurity_decrease :</label>
        <TuningParam name={"min_impurity_decrease"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>ccp_alpha :</label>
        <TuningParam name={"ccp_alpha"} options={options} setOptions={setOptions} optimizer={optimizer} />
      </div>
      <div className="flex flex-row space-x-2">
        <Switch
          text="bootstrap : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"bootstrap"}
          checked={options.bootstrap ? true : false}
        />
        <Switch
          text="oob_score : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"oob_score"}
          checked={options.oob_score ? true : false}
        />
        <Switch
          text="warm_start : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"warm_start"}
          checked={options.warm_start ? true : false}
        />
      </div>
    </div>
  );
}

export default React.memo(RFRegTuning);
