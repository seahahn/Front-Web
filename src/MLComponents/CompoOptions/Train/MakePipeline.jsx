import React, { useState, useContext, useRef } from "react";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult, getColumns } from "MLComponents/CompoOptions/util";
import { ENCODERS_MAPPING, MODELS_MAPPING, SCALERS_MAPPING } from "MLComponents/constants";
import { inputStyle } from "MLComponents/componentStyle";
import { Select } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";
import Encoder from "./Encoders/Encoder";
import Scaler from "./Scalers/Scaler";
import Model from "./Models/Model";

function MakePipeline({ formId, resultId }) {
  const { dfd } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const scalers = Object.keys(SCALERS_MAPPING);
  const models = Object.keys(MODELS_MAPPING);

  const [steps, setSteps] = useState({}); // 파이프라인 steps 파라미터 설정
  const handleSteps = (step) => {
    setSteps(Object.assign(steps, step));
  };

  const [params, setParams] = useState({
    name: "", // input text
    key: "test", // TODO "사용자_고유번호/프로젝트_번호" 로 변경 예정
    encoder: [], // MultiSelect
    scaler: scalers[0], // Select
    model: models[0], // Select
    // verbose: verbose,
  });

  // DOM 접근 위한 Ref
  const nameRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingEncoders = (e) => {
    setParams({
      ...params,
      encoder: e,
    });
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParams({
      ...params,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    console.log(params);
    // 입력 필수 값 체크
    if (params.name === "") {
      // 모델명 미입력시 포커스 주기
      nameRef.current.focus();
      return;
    }
    if (params.encoder.length === 0 && params.scaler === "None" && params.model === "None") {
      // 인코더, 스케일러, 모델 모두 선택 안 했을 시 경고 메시지 띄우기
      document.getElementById(resultId).innerHTML = '<span style="color: red;">인코더, 스케일러, 모델 중 최소 한 가지는 선택해주세요!</span>';
      return;
    }

    const paramResult = {
      ...params,
      name: params.name.replace(" ", "_"),
      encoder: [...params.encoder.map((enc) => enc.value)],
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.MakePipeline), paramResult);
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(steps)))
      .then((response) => response.json())
      .then((data) => {
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
            name={"name"}
            ref={nameRef}
            className={inputStyle + " flex-1 self-center justify-self-stretch"}
            type="text"
            placeholder={"저장할 모델 이름을 입력하세요"}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <label className="self-center">인코더 선택</label>
          <MultiSelect options={ENCODERS_MAPPING} onChange={settingEncoders} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div className="flex flex-col space-y-2">
          {Object.values(params.encoder).map((encoder) => (
            <Encoder key={encoder.value} encoder={encoder.label} handleSteps={handleSteps} steps={steps} colObjArray={colObjArray} />
          ))}
        </div>
        <hr className="border border-teal-500" />
        <Select className="flex-1 justify-self-stretch" options={scalers} name={"scaler"} text="스케일러 선택" onChange={handleChange} />
        <Scaler scaler={params.scaler} handleSteps={handleSteps} />
        <hr className="border border-teal-500" />
        <Select className="flex-1 justify-self-stretch" options={models} name={"model"} text="모델 선택" onChange={handleChange} />
        <Model model={params.model} handleSteps={handleSteps} />
      </div>
    </form>
  );
}

export default MakePipeline;
