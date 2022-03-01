import React, { useState, useRef } from "react";
import { getColumns } from "MLComponents/CompoOptions/util";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";

function Ordinal({ blockId, handleSteps }) {
  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const handleOptions = ["value", "error", "return_nan", "indicator"];

  // 공통 옵션 상태 값 저장
  const [cols, setCols] = useState([]); // MultiSelect
  const [dropInvariant, setDropInvariant] = useState(false); // Switch
  const [returnDf, setReturnDf] = useState(true); // Switch
  const [handleUnknown, setHandleUnknown] = useState("value"); // Select
  const [handleMissing, setHandleMissing] = useState("value"); // Select

  // Ordinal 전용 옵션 상태 값 저장
  const [mapping, setMapping] = useState({}); // input text (multi) by cols

  const options = {
    ordinal_encoder: {
      cols: cols,
      drop_invariant: dropInvariant,
      return_df: returnDf,
      handle_unknown: handleUnknown,
      handle_missing: handleMissing,
      mapping: mapping,
    },
  }; // 입력해야 할 파라미터 설정

  const colsRef = useRef();
  const dropInvariantRef = useRef();
  const returnDfRef = useRef();
  const handleUnknownRef = useRef();
  const handleMissingRef = useRef();

  const mappingRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingCols = (e) => {
    // console.log(e);
    setCols([...e.map((col) => col.value)]);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case dropInvariantRef.current:
        setDropInvariant(!dropInvariant);
        break;
      case returnDfRef.current:
        setReturnDf(!returnDf);
        break;
      case handleUnknownRef.current:
        setHandleUnknown(event.target.value);
        break;
      case handleMissingRef.current:
        setHandleMissing(event.target.value);
        break;
      case mappingRef.current:
        setMapping(event.target.value);
        break;
      default:
        console.log("error");
        break;
    }
    handleSteps(options);
  };

  return (
    <div>
      <h3>Ordinal Encoder</h3>
      <div className="flex flex-row space-x-2">
        <label className="self-center">대상 컬럼 선택</label>
        <MultiSelect options={colObjArray} onChange={settingCols} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
      </div>
      <div className="flex flex-col">
        {cols.forEach((col) => (
          <label>
            {col + " 값 순서 지정"}
            <input ref={mappingRef} type="text" />
          </label>
        ))}
      </div>
      <div className="flex flex-row space-x-2">
        <Switch ref={dropInvariantRef} text="dropInvariant : " onChange={handleChange} checked={dropInvariant} />
        <Switch ref={returnDfRef} text="returnDf : " onChange={handleChange} checked={returnDf} />
      </div>
      <div className="flex flex-row space-x-2">
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={handleOptions}
          ref={handleUnknownRef}
          text="handleUnknown"
          onChange={handleChange}
        />
        <Select
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
