import React, { useState, useEffect } from "react";
import _ from "lodash";
import MultiSelect from "react-select";
import { Switch, TuningParam } from "MLML/MLComponents/CompoOptions/CompoPiece";
import { colArrayToObjArray } from "MLML/MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html
 * Ridge Regression
 */
function RidgeTuning({ step, handleSteps, optimizer }) {
  const solver = ["auto", "svd", "cholesky", "lsqr", "sparse_cg", "sag", "saga", "lbfgs"];

  const initialOpts = {
    solver: [], // {‘auto’, ‘svd’, ‘cholesky’, ‘lsqr’, ‘sparse_cg’, ‘sag’, ‘saga’, ‘lbfgs’}, default=’auto’
    // fit_intercept: true, // bool, default=True
    // copy_X: true, // bool, default=True
    // positive: false, // bool, default=False
    max_iter: ["_randint", null, null, null], // int, default=None
    tol: ["_randint", null, null, null], // float, default=1e-3
    alpha: ["_randint", null, null, null], // {float, ndarray of shape (n_targets,)}, default=1.0
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
      <h3>Ridge Regression</h3>
      <div className="flex flex-row space-x-2">
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
      </div>
      <div className="flex flex-row space-x-2">
        <Switch
          text="fit_intercept : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name="fit_intercept"
          checked={options.fit_intercept ? true : false}
        />
        <Switch
          text="positive : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name="positive"
          checked={options.positive ? true : false}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>max_iter :</label>
        <TuningParam name={"max_iter"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>tol :</label>
        <TuningParam name={"tol"} options={options} setOptions={setOptions} optimizer={optimizer} />
        <label>alpha :</label>
        <TuningParam name={"alpha"} options={options} setOptions={setOptions} optimizer={optimizer} />
      </div>
    </div>
  );
}

export default React.memo(RidgeTuning);
