import React from "react";
import classNames from "classnames";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";

/**
 * MakeOptimizer에서 수치형 파라미터 입력을 위한 컴포넌트
 */
function TuningParam({ name, options, setOptions, optimizer }) {
  const [selectedMethod, setSelectedMethod] = React.useState(options[name][0]);
  const [beforeSelectedMethod, SetBeforeSelectedMethod] = React.useState(options[name][0]);

  const selectRef = React.useRef();

  React.useEffect(() => {
    if (optimizer === "grid_search_cv") {
      // grid 방식에서는 무조건 이산적인 값만 입력 가능
      setOptions({
        ...options,
        [name]: ["_discrete", "", null, null],
      });
      setSelectedMethod("_discrete");
      selectRef.current.value = "_discrete";
    } else {
      setOptions({
        ...options,
        [name]: [beforeSelectedMethod, null, null, null],
      });
      setSelectedMethod(beforeSelectedMethod);
      selectRef.current.value = beforeSelectedMethod;
    }
  }, [optimizer]);

  const handleParam = (e) => {
    const { name: inputName, value, type } = e.target;
    if (type === "select-one") {
      setSelectedMethod(value); // 값 입력 방식 선택
      SetBeforeSelectedMethod(value); // 옵티마이저 변경 전후 상태 보관하기 위한 값 저장(grid 바꿨다가 random 왔을 때 이전 값 그대로 살리기 위함)
    }
    if (value === "_randexp") {
      // randexp인 경우 밑을 10으로 고정
      const newParams = options[name];
      newParams.splice(1, 1, 10);
    }

    const targetParamNum = Number(inputName.split("_")[1]); // 바꿔야 할 숫자의 위치
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
        ref={selectRef}
        onChange={handleParam}
        defaultValue={optimizer === "grid_search_cv" ? "_discrete" : selectedMethod}
        disabled={optimizer === "grid_search_cv" ? true : false}>
        <option value={"_randint"}>randint</option>
        <option value={"_randexp"}>randexp</option>
        <option value={"_uniform"}>uniform</option>
        <option value={"_discrete"}>discrete</option>
      </select>
      <input
        name={"param_1"}
        type={selectedMethod === "_discrete" ? "text" : "number"}
        className={classNames(selectedMethod === "_discrete" && "flex-1", "w-1/6", inputStyle)}
        onChange={handleParam}
        defaultValue={selectedMethod === "_randexp" ? 10 : options[name][1]}
        disabled={selectedMethod === "_randexp" ? true : false}
      />
      {selectedMethod !== "_discrete" && (
        <input name={"param_2"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} defaultValue={options[name][2]} />
      )}
      {selectedMethod === "_randexp" && (
        <input name={"param_3"} type="number" className={classNames("w-1/6", inputStyle)} onChange={handleParam} defaultValue={options[name][3]} />
      )}
    </div>
  );
}

export default TuningParam;
