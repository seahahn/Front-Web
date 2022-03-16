import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { equalsIgnoreOrder, colArrayToObjArray } from "MLML/MLComponents/CompoOptions/util";

function OrdinalTuning({ handleOptions, colObjArray, handleSteps, steps, step }) {
  const initialOpts = {
    // cols: null,
    // drop_invariant: false,
    // return_df: true,
    handle_unknown: [],
    handle_missing: [],
    // mapping: null,
  };
  // 옵션 상태 값 저장
  const [options, setOptions] = useState(step && equalsIgnoreOrder(Object.keys(step), Object.keys(initialOpts)) ? step : initialOpts); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // cols: null,
    // drop_invariant: false,
    // return_df: true,
    // handle_unknown: "value",
    // handle_missing: "value",
    // mapping: null,
  };

  const [selectedCols, setSelectedCols] = useState(colArrayToObjArray(options.cols ? options.cols : []));
  // const [mapping, setMapping] = useState({});

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    // const mappingResult = mapping.length > 0 ? [...Object.values(mapping)] : defaultVal.mapping;

    steps.hasOwnProperty("encoders")
      ? handleSteps({ encoders: Object.assign(steps.encoders, { ordinal_encoder: { ...options } }) })
      : handleSteps({ encoders: Object.assign({}, { ordinal_encoder: { ...options } }) });
  }, [handleSteps, options]);

  const colsRef = useRef();
  const dropInvariantRef = useRef();
  const returnDfRef = useRef();
  const handleUnknownRef = useRef();
  const handleMissingRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    setOptions({
      ...options,
      cols: [...e.map((col) => col.value)],
    });
    setSelectedCols(e);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (type === "checkbox") {
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
      // } else if (type === "text") {
      //   try {
      //     if (Object.keys(JSON.parse(value)).length === 0) {
      //       console.log("value is empty");
      //       throw new Error("매핑 값을 입력해주세요.");
      //     }
      //     setMapping({ ...mapping, [name]: { col: name, mapping: JSON.parse(value.replace("None", null)) } });
      //     event.target.style.border = "1px solid blue";
      //   } catch (err) {
      //     setMapping(_.omit(mapping, name));
      //     value === "" ? (event.target.style.border = "1px solid black") : (event.target.style.border = "1px solid red");
      //   }
      // } else {
      //   value.length === 0
      //     ? setOptions({
      //         ...options,
      //         [name]: defaultVal[name],
      //       })
      //     : setOptions({
      //         ...options,
      //         [name]: value,
      //       });
    }
  };

  const mappingFilter = (array, target) => {
    const result = array ? array.filter((elem) => elem.col === target)[0] : null;
    if (result) {
      return JSON.stringify(result.mapping);
    }
    return result;
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Ordinal Encoder</h3>
      {/* <div className="flex flex-row space-x-2">
        <label className="self-center">대상 컬럼 선택</label>
        <MultiSelect
          ref={colsRef}
          options={colObjArray}
          onChange={settingCols}
          className="flex-1"
          isMulti={true}
          closeMenuOnSelect={false}
          defaultValue={colArrayToObjArray(options.cols)}
        />
      </div> */}
      {/* <div className="flex flex-col space-y-2">
        {Object.values(selectedCols).map((col) => (
          <div key={col.label} className="flex flex-row space-x-2">
            <label className="self-center">{col.label + " 값 순서 지정 : "}</label>
            <input
              className={inputStyle + " flex-1 self-center justify-self-stretch"}
              type="text"
              name={col.label}
              placeholder={'예시) {"None": 0, "a": 1, "b": 2, ...} / 미입력시 자동 지정'}
              onChange={handleChange}
              defaultValue={mappingFilter(options.mapping, col.label)}
            />
          </div>
        ))}
      </div> */}
      <div className="flex flex-row space-x-2">
        <Switch
          ref={dropInvariantRef}
          text="dropInvariant : "
          title={"선택 시 true, false 두 경우 모두에 대하여 학습 진행"}
          onChange={handleChange}
          name={"drop_invariant"}
          checked={options.drop_invariant ? true : false}
        />
        {/* <Switch ref={returnDfRef} text="returnDf : " onChange={handleChange} name={"return_df"} checked={options.return_df} /> */}
      </div>
      <div className="flex flex-row space-x-2">
        {/* <Select
          name={"handle_unknown"}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleUnknownRef}
          text="handleUnknown"
          onChange={handleChange}
          defaultValue={options.handle_unknown}
        />
        <Select
          name={"handle_missing"}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleMissingRef}
          text="handleMissing"
          onChange={handleChange}
          defaultValue={options.handle_missing}
        /> */}
        <label className="flex-1 self-center">
          handle_unknown
          <MultiSelect
            options={handleOptions}
            onChange={(e) => {
              setOptions({
                ...options,
                handle_unknown: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.handle_unknown)}
          />
        </label>
        <label className="flex-1 self-center">
          handle_missing
          <MultiSelect
            options={handleOptions}
            onChange={(e) => {
              setOptions({
                ...options,
                handle_missing: [...e.map((col) => col.value)],
              });
            }}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={colArrayToObjArray(options.handle_missing)}
          />
        </label>
      </div>
    </div>
  );
}

export default OrdinalTuning;
