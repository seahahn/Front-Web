import React from "react";
import classNames from "classnames";
import { inputStyle } from "MLComponents/componentStyle";

/**
 * MakeOptimizer에서 수치형 파라미터 입력을 위한 컴포넌트
 */
function TuningParam({ name, options, setOptions, optimizer }) {
  const [value, setValue] = React.useState("randint");

  React.useEffect(() => {
    if (optimizer === "grid_search_cv") {
      setOptions({
        ...options,
        [name]: "",
      });
      setValue("discrete");
    } else {
      setOptions({
        ...options,
        [name]: ["randint", null, null, null],
      });
      setValue("randint");
    }
  }, [optimizer]);

  const handleParam = (e) => {
    const { name: inputName, value, type } = e.target;
    console.log(type);
    type === "select-one" && setValue(value);
    console.log(inputName, value);
    const targetParamNum = Number(inputName.split("_")[1]);
    console.log(targetParamNum);
    const newParams = options[name];
    newParams.splice(targetParamNum, 1, value);
    setOptions({
      ...options,
      [name]: newParams,
    });
  };

  return (
    <div className="flex flex-row space-x-2">
      <select
        name={"param_0"}
        onChange={handleParam}
        value={optimizer === "grid_search_cv" ? "discrete" : value}
        disabled={optimizer === "grid_search_cv" ? true : false}>
        <option value={"randint"}>randint</option>
        <option value={"randexp"}>randexp</option>
        <option value={"uniform"}>uniform</option>
        <option value={"discrete"}>discrete</option>
      </select>
      <input
        name={"param_1"}
        type={value === "discrete" ? "text" : "number"}
        className={classNames(value === "discrete" && "flex-1", "w-1/6", inputStyle)}
        onChange={handleParam}
      />
      {value !== "discrete" && <input name={"param_2"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} />}
      {value === "randexp" && <input name={"param_3"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} />}
    </div>
  );
}

export default TuningParam;
