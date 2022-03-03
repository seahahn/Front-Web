import React, { useState, useContext, useRef } from "react";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import _ from "lodash";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";
import Encoder from "./Encoders/Encoder";
import Scaler from "./Scalers/Scaler";
import Model from "./Models/Model";

function MakePipeline({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const encoderValueList = ["onehot_encoder", "ordinal_encoder", "target_encoder"]; // 인코더 목록 가져오기
  const encoderLabelList = ["OneHot", "Ordinal", "Target"]; // 인코더 목록 가져오기
  const encoderObjArray = [...encoderValueList.map((encoder, index) => ({ label: encoderLabelList[index], value: encoder }))]; // MultiSelect에서 사용하는 객체 목록

  const scalers = ["미지정", "standard_scaler", "minmax_scaler"];
  const models = ["미지정", "linear_regression", "ridge", "decision_tree_regressor", "logistic_regression"];

  const [steps, setSteps] = useState({}); // 파이프라인 steps 파라미터 설정
  const handleSteps = (step) => {
    setSteps(Object.assign(steps, step));
  };
  // console.log(steps);

  const [name, setName] = useState(); // input text
  const [encoder, setEncoder] = useState([]); // MultiSelect
  const [scaler, setScaler] = useState(scalers[0]); // Select
  const [model, setModel] = useState(models[0]); // Select
  // const [memory, setMemory] = useState();
  const [verbose, setVerbose] = useState(false); // Switch

  // DOM 접근 위한 Ref
  const nameRef = useRef();
  // const encoderRef = useRef();
  const scalerRef = useRef();
  const modelRef = useRef();
  const verboseRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingEncoders = (e) => {
    // setEncoder([...e.map((col) => col.value)]);
    setEncoder(e);
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    switch (event.target) {
      case nameRef.current:
        setName(event.target.value);
        break;
      case scalerRef.current:
        setScaler(event.target.value);
        break;
      case modelRef.current:
        setModel(event.target.value);
        break;
      case verboseRef.current:
        setVerbose(!verbose);
        break;
      default:
        console.log("error");
        break;
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      name: name.replace(" ", "_"),
      key: "test", // TODO "사용자_고유번호/프로젝트_번호" 로 변경 예정
      encoder: [...encoder.map((enc) => enc.value)],
      scaler: scaler,
      model: model,
      verbose: verbose,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.MakePipeline), params);
    // const df = loadDf(leftBlockId, rightBlockId); // 선택된 데이터프레임(JSON) 2개 가져오기
    // console.log(JSON.stringify(df));
    console.log(steps);
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(steps)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row space-x-2">
          <label className="self-center">{"모델명 지정"}</label>
          <input
            ref={nameRef}
            className={inputStyle + " flex-1 self-center justify-self-stretch"}
            type="text"
            placeholder={"저장할 모델 이름을 입력하세요"}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <label className="self-center">인코더 선택</label>
          <MultiSelect options={encoderObjArray} onChange={settingEncoders} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div className="flex flex-col space-y-2">
          {Object.values(encoder).map((encoder) => (
            <Encoder key={encoder.value} encoder={encoder.label} handleSteps={handleSteps} steps={steps} colObjArray={colObjArray} />
          ))}
        </div>
        <hr className="border border-teal-500" />
        <Select className="flex-1 justify-self-stretch" options={scalers} ref={scalerRef} text="스케일러 선택" onChange={handleChange} />
        <Scaler scaler={scaler} handleSteps={handleSteps} />
        <hr className="border border-teal-500" />
        <Select className="flex-1 justify-self-stretch" options={models} ref={modelRef} text="모델 선택" onChange={handleChange} />
        <Model model={model} handleSteps={handleSteps} />
      </div>
    </form>
  );
}

export default React.memo(MakePipeline);
