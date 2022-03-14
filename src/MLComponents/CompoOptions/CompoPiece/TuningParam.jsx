import React from "react";
import classNames from "classnames";
import { inputStyle } from "MLComponents/componentStyle";

/**
 * MakeOptimizer에서 수치형 파라미터 입력을 위한 컴포넌트
 */
function TuningParam({ name, options, setOptions, optimizer }) {
  const [value, setValue] = React.useState("_randint");

  React.useEffect(() => {
    if (optimizer === "grid_search_cv") {
      // grid 방식에서는 무조건 이산적인 값만 입력 가능
      setOptions({
        ...options,
        [name]: ["_discrete", "", null, null],
      });
      setValue("_discrete");
    } else {
      setOptions({
        ...options,
        [name]: ["_randint", null, null, null],
      });
      setValue("_randint");
    }
  }, [optimizer]);

  const handleParam = (e) => {
    const { name: inputName, value, type } = e.target;
    // console.log(type);
    type === "select-one" && setValue(value); // 값 입력 방식 선택
    if (value === "_randexp") {
      // randexp인 경우 밑을 10으로 고정
      const newParams = options[name];
      newParams.splice(1, 1, 10);
    }

    // console.log(inputName, value);
    const targetParamNum = Number(inputName.split("_")[1]); // 바꿔야 할 숫자의 위치
    // console.log(targetParamNum);
    const newParams = options[name]; // 기존에 설정되어 있던 파라미터 값
    newParams.splice(targetParamNum, 1, value); // 기존 파라미터 값을 새로운 값으로 대체
    setOptions({
      ...options,
      [name]: newParams, // 내용 변경된 리스트를 넣어줌
    });
  };

  return (
    <div className="flex flex-row space-x-2">
      <select
        name={"param_0"}
        onChange={handleParam}
        value={optimizer === "grid_search_cv" ? "_discrete" : value}
        disabled={optimizer === "grid_search_cv" ? true : false}>
        <option value={"_randint"}>randint</option>
        <option value={"_randexp"}>randexp</option>
        <option value={"_uniform"}>uniform</option>
        <option value={"_discrete"}>discrete</option>
      </select>
      <input
        name={"param_1"}
        type={value === "_discrete" ? "text" : "number"}
        className={classNames(value === "_discrete" && "flex-1", "w-1/6", inputStyle)}
        onChange={handleParam}
        defaultValue={value === "_randexp" ? 10 : null}
        disabled={value === "_randexp" ? true : false}
      />
      {value !== "_discrete" && <input name={"param_2"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} />}
      {value === "_randexp" && <input name={"param_3"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} />}
    </div>
  );
}

export default TuningParam;
