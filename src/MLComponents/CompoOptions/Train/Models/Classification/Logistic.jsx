import React, { useState, useEffect, useRef } from "react";
import { inputStyle } from "MLComponents/componentStyle";
import { Switch, Select } from "MLComponents/CompoOptions/CompoPiece";
import classNames from "classnames";
import { convertNumParams } from "MLComponents/CompoOptions/util";

/**
 * https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html?highlight=logistic#sklearn.linear_model.LogisticRegression
 * Logistic Regression
 */
function Logistic({ handleSteps }) {
  const penalty = ["l2", "l1", "elasticnet", "none"];
  const solver = ["lbfgs", "newton-cg", "liblinear", "sag", "saga"];
  const multiClass = ["auto", "ovr", "multinomial"];

  // 옵션 상태 값 저장
  const [options, setOptions] = useState({
    penalty: "l2", // {‘l1’, ‘l2’, ‘elasticnet’, ‘none’}, default=’l2’
    solver: "lbfgs", // {‘newton-cg’, ‘lbfgs’, ‘liblinear’, ‘sag’, ‘saga’}, default=’lbfgs’
    multi_class: "auto", // {‘auto’, ‘ovr’, ‘multinomial’}, default=’auto’
    dual: false, // bool, default=False
    fit_intercept: true, // bool, default=True
    warm_start: false, // bool, default=False
    class_weight: null, // dict(={class_label: weight}) or ‘balanced’, default=None
    tol: 1e-4, // float, default=1e-4
    C: 1.0, // float, default=1.0
    intercept_scaling: 1.0, // float, default=1
    max_iter: 100, // int, default=100
    l1_ratio: null, // float, default=None
    n_jobs: -1, // int, default=None
    random_state: null, // int, RandomState instance, default=None
    // verbose: 0, // int, default=0
  }); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // penalty: "l2", // {‘l1’, ‘l2’, ‘elasticnet’, ‘none’}, default=’l2’
    // solver: "lbfgs", // {‘newton-cg’, ‘lbfgs’, ‘liblinear’, ‘sag’, ‘saga’}, default=’lbfgs’
    // multi_class: "auto", // {‘auto’, ‘ovr’, ‘multinomial’}, default=’auto’
    // dual: false, // bool, default=False
    // fit_intercept: true, // bool, default=True
    // warm_start: false, // bool, default=False
    class_weight: null, // dict(={class_label: weight}) or ‘balanced’, default=None
    tol: 1e-4, // float, default=1e-4
    C: 1.0, // float, default=1.0
    intercept_scaling: 1.0, // float, default=1
    max_iter: 100, // int, default=100
    l1_ratio: null, // float, default=None
    n_jobs: -1, // int, default=None
    random_state: null, // int, RandomState instance, default=None
    // verbose: 0, // int, default=0
  }; // 초기값 저장하여 input 미입력 시 기본값 넣기

  // 수치형 입력 값 구분하기 위한 리스트
  // const nums = ["tol", "C", "intercept_scaling", "max_iter", "l1_ratio", "n_jobs", "random_state"];

  // const [classWeight, setClassWeight] = useState(null); // 클래스 비율 설정

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    const classW = options.class_weight === "unbalanced" ? null : options.class_weight;
    // console.log(classW);
    handleSteps({ model: { ...options, class_weight: classW } });
  }, [handleSteps, options]);

  const classWeightRef = useRef();
  // const copyXRef = useRef();
  // const nJobsRef = useRef();
  // const positiveRef = useRef();

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
        console.log(value);
        setOptions({ ...options, class_weight: JSON.parse(value) });
      } catch (error) {
        setOptions({ ...options, class_weight: "unbalanced" });
        classWeightRef.current.style.border = "1px solid red";
      }
    } else {
      // 수치형인 경우 Number로 변환
      convertNumParams(name, value, options, setOptions, defaultVal);
      // value === ""
      //   ? setOptions({ ...options, [name]: defaultVal[name] })
      //   : NUM_PARAMS.hasOwnProperty(name)
      //   ? setOptions({ ...options, [name]: Number(value) })
      //   : setOptions({ ...options, [name]: value });
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Logistic Regression</h3>
      <div className="flex flex-row space-x-2">
        <Select className="flex-1 self-center justify-self-stretch" options={penalty} text="penalty" onChange={handleChange} name={"penalty"} />
        <Select className="flex-1 self-center justify-self-stretch" options={solver} text="solver" onChange={handleChange} name={"solver"} />
        <Select className="flex-1 self-center justify-self-stretch" options={multiClass} text="multiClass" onChange={handleChange} name={"multi_class"} />
      </div>
      <div className="flex flex-row space-x-2">
        <Switch text="dual : " onChange={handleChange} name={"dual"} checked={options.dual} />
        <Switch text="fit_intercept : " onChange={handleChange} name={"fit_intercept"} checked={options.fit_intercept} />
        <Switch text="warm_start : " onChange={handleChange} name={"warm_start"} checked={options.warm_start} />
      </div>
      <div className="flex flex-row space-x-2">
        <Select
          className="self-center justify-self-stretch"
          options={["", "balanced", "unbalanced"]}
          optionText={["미지정", "balanced", "unbalanced"]}
          text="class_weight :"
          onChange={handleChange}
          name={"class_weight"}
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
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label>tol :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 1e-4"} onChange={handleChange} name={"tol"} />
        <label>C :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 1.0"} onChange={handleChange} name={"C"} />
        <label>intercept_scaling :</label>
        <input className={inputStyle} type="number" step="any" placeholder={"기본값 1.0"} onChange={handleChange} name={"intercept_scaling"} />
        <label>max_iter :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"기본값 100"} onChange={handleChange} name={"max_iter"} />
        <label>l1_ratio :</label>
        <input className={inputStyle} type="number" min={0} max={1} step="any" placeholder={"기본값 None"} onChange={handleChange} name={"l1_ratio"} />
        <label>n_jobs :</label>
        <input className={inputStyle} type="number" min={1} placeholder={"미입력시 -1(최대 자원 사용)"} onChange={handleChange} name={"n_jobs"} />
        <label>random_state :</label>
        <input className={inputStyle} type="number" placeholder={"기본값 None"} onChange={handleChange} name={"random_state"} />
      </div>
    </div>
  );
}

export default React.memo(Logistic);
