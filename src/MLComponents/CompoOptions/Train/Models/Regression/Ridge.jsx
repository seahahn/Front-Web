import React, { useState, useEffect } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch, Select } from "MLComponents/CompoOptions/CompoPiece";
import { convertNumParams, equalsIgnoreOrder } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html
 * Ridge Regression
 */
function Ridge({ step, handleSteps }) {
  const solver = ["auto", "svd", "cholesky", "lsqr", "sparse_cg", "sag", "saga", "lbfgs"];

  const initialOpts = {
    solver: "auto", // {‘auto’, ‘svd’, ‘cholesky’, ‘lsqr’, ‘sparse_cg’, ‘sag’, ‘saga’, ‘lbfgs’}, default=’auto’
    fit_intercept: true, // bool, default=True
    copy_X: true, // bool, default=True
    positive: false, // bool, default=False
    max_iter: null, // int, default=None
    tol: 1e-3, // float, default=1e-3
    alpha: 1.0, // {float, ndarray of shape (n_targets,)}, default=1.0
    random_state: null, // int, RandomState instance, default=None
  };

  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // solver: "auto", // {‘auto’, ‘svd’, ‘cholesky’, ‘lsqr’, ‘sparse_cg’, ‘sag’, ‘saga’, ‘lbfgs’}, default=’auto’
    // fit_intercept: true, // bool, default=True
    // copy_X: true, // bool, default=True
    // positive: false, // bool, default=False
    max_iter: null, // int, default=None
    tol: 1e-3, // float, default=1e-3
    alpha: 1.0, // {float, ndarray of shape (n_targets,)}, default=1.0
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
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Ridge Regression</h3>
      <div className="flex flex-row space-x-2">
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={solver}
          text="solver"
          onChange={handleChange}
          name="solver"
          defaultValue={options.solver}
        />
      </div>
      <div className="flex flex-row space-x-2">
        <Switch text="fit_intercept : " onChange={handleChange} name="fit_intercept" checked={options.fit_intercept} />
        <Switch text="copy_X : " onChange={handleChange} name="copy_X" checked={options.copy_X} />
        <Switch text="positive : " onChange={handleChange} name="positive" checked={options.positive} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>max_iter :</label>
        <input
          className={inputStyle}
          type="number"
          step="any"
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="max_iter"
          defaultValue={options.max_iter}
        />
        <label>tol :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 1e-3"} onChange={handleChange} name="tol" defaultValue={options.tol} />
        <label>alpha :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 1.0"} onChange={handleChange} name="alpha" defaultValue={options.alpha} />
        <label>random_state :</label>
        <input
          className={inputStyle}
          type="number"
          min={1}
          placeholder={"기본값 없음"}
          onChange={handleChange}
          name="random_state"
          defaultValue={options.random_state}
        />
      </div>
    </div>
  );
}

export default React.memo(Ridge);
