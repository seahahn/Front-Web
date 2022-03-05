import React, { useState, useRef, useEffect } from "react";
import _ from "lodash";
import { inputStyle } from "MLComponents/componentStyle";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";

function Ordinal({ handleOptions, handleSteps, colObjArray, steps }) {
  // 옵션 상태 값 저장
  const [options, setOptions] = useState({
    cols: null,
    drop_invariant: false,
    return_df: true,
    handle_unknown: "value",
    handle_missing: "value",
    mapping: null,
  }); // 입력해야 할 파라미터 설정

  const defaultVal = {
    // cols: null,
    // drop_invariant: false,
    // return_df: true,
    // handle_unknown: "value",
    // handle_missing: "value",
    mapping: null,
  };

  const [selectedCols, setSelectedCols] = useState([]);
  const [mapping, setMapping] = useState({});
  // console.log(options);

  // 옵션 변경 시 MakePipeline 컴포넌트에 전달
  useEffect(() => {
    const mappingResult = mapping === "" ? [...Object.values(mapping)] : defaultVal.mapping;
    console.log(mappingResult);
    steps.hasOwnProperty("encoders")
      ? handleSteps({ encoders: Object.assign(steps.encoders, { ordinal_encoder: { ...options, mapping: mappingResult } }) })
      : handleSteps({ encoders: Object.assign({}, { ordinal_encoder: { ...options, mapping: mappingResult } }) });
    // setEncoders(Object.assign(encoders, { ordinal_encoder: { ...options, mapping: mappingResult } }));
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
    const { name, value, checked } = event.target;
    // console.log(event.target);
    if (event.target.type === "checkbox") {
      setOptions({
        ...options,
        [name]: checked,
      });
    } else if (event.target.type === "text") {
      try {
        if (Object.keys(JSON.parse(value)).length === 0) {
          throw new Error("매핑 값을 입력해주세요.");
        }
        setMapping({ ...mapping, [name]: { col: name, mapping: JSON.parse(value.replace("None", null)) } });
        event.target.style.border = "1px solid blue";
      } catch (err) {
        setMapping(_.omit(mapping, name));
        value === "" ? (event.target.style.border = "1px solid black") : (event.target.style.border = "1px solid red");
      }
    } else {
      value.length === 0
        ? setOptions({
            ...options,
            [name]: defaultVal[name],
          })
        : setOptions({
            ...options,
            [name]: value,
          });
    }
  };

  return (
    <div className="flex flex-col space-y-2 border border-blue-400 rounded-lg p-1">
      <h3>Ordinal Encoder</h3>
      <div className="flex flex-row space-x-2">
        <label className="self-center">대상 컬럼 선택</label>
        <MultiSelect ref={colsRef} options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
      </div>
      <div className="flex flex-col space-y-2">
        {Object.values(selectedCols).map((col) => (
          <div key={col.label} className="flex flex-row space-x-2">
            <label className="self-center">{col.label + " 값 순서 지정 : "}</label>
            <input
              className={inputStyle + " flex-1 self-center justify-self-stretch"}
              type="text"
              name={col.label}
              placeholder={'예시) {"None": 0, "a": 1, "b": 2, ...} / 미입력시 자동 지정'}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row space-x-2">
        <Switch ref={dropInvariantRef} text="dropInvariant : " onChange={handleChange} name={"drop_invariant"} checked={options.drop_invariant} />
        <Switch ref={returnDfRef} text="returnDf : " onChange={handleChange} name={"return_df"} checked={options.return_df} />
      </div>
      <div className="flex flex-row space-x-2">
        <Select
          name={"handle_unknown"}
          value={options.handle_unknown}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleUnknownRef}
          text="handleUnknown"
          onChange={handleChange}
        />
        <Select
          name={"handle_missing"}
          value={options.handle_missing}
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleMissingRef}
          text="handleMissing"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default Ordinal;
