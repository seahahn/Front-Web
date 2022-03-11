import React, { useState, useContext, useRef, useEffect } from "react";
import _ from "lodash";
import {
  targetURL,
  MLTRAIN_URL,
  MLTRAIN_SUFFIX_MODEL,
  URLS_TRAIN,
  httpConfig,
  MODEL_KEY_PREFIX,
  USER_IDX,
  UPM_MODEL_URL,
} from "MLComponents/CompoOptions/networkConfigs";
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

function MakePipeline({ formId, resultId, param, setParam }) {
  const { dfd } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const scalers = Object.keys(SCALERS_MAPPING);
  const models = Object.keys(MODELS_MAPPING);

  const [steps, setSteps] = useState(param.steps); // 파이프라인 steps 파라미터 설정
  const handleSteps = (step) => {
    setSteps(Object.assign(steps, step));
  };

  // DOM 접근 위한 Ref
  const nameRef = useRef();

  useEffect(() => {
    setParam({
      ...param,
      steps: steps,
    });
  }, [steps]);

  // 컬럼 선택(MultiSelect)
  const settingEncoders = (e) => {
    setParam({
      ...param,
      encoder: e,
    });

    // 선택한 인코더에 맞춰 steps의 encoders 수정하기
    const encArray = [...e.map((enc) => enc.value)];
    setSteps({ ...steps, encoders: _.pick(steps.encoders, encArray) });
  };

  // 옵션 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value === "None" ? "" : value,
    });

    // 스케일러 혹은 모델 미선택 시 steps에서 제거
    if (value === "None") {
      setSteps(_.omit(steps, name));
    }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 입력 필수 값 체크
    if (param.name === "") {
      // 모델명 미입력시 포커스 주기
      nameRef.current.focus();
      return;
    }
    if (param.encoder.length === 0 && param.scaler === "" && param.model === "") {
      // 인코더, 스케일러, 모델 모두 선택 안 했을 시 경고 메시지 띄우기
      document.getElementById(resultId).innerHTML = '<span style="color: red;">인코더, 스케일러, 모델 중 최소 한 가지는 선택해주세요!</span>';
      return;
    }
    const modelName = param.name.replace(" ", "_");
    const paramResult = {
      ...param,
      name: modelName,
      encoder: [...param.encoder.map((enc) => enc.value)],
      key: MODEL_KEY_PREFIX + USER_IDX,
    }; // 입력해야 할 파라미터 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.MakePipeline), paramResult);
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(steps)))
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.result) {
          const modelData = {
            user_idx: USER_IDX,
            model_name: modelName,
          };
          const response = await fetch(UPM_MODEL_URL, httpConfig(JSON.stringify(modelData), "POST", true));
          const freshModelList = await response.json();
          console.log(freshModelList);
          showDataResult(dfd, data.message, resultId);
        }
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
            defaultValue={param.name}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <label className="self-center">인코더 선택</label>
          <MultiSelect
            options={ENCODERS_MAPPING}
            onChange={settingEncoders}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={param.encoder}
          />
        </div>
        <div className="flex flex-col space-y-2">
          {Object.values(param.encoder).map((encoder) => (
            <Encoder key={encoder.value} encoder={encoder.label} encVal={encoder.value} handleSteps={handleSteps} steps={steps} colObjArray={colObjArray} />
          ))}
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        <Select
          className="flex-1 justify-self-stretch"
          options={scalers}
          name={"scaler"}
          text="스케일러 선택"
          onChange={handleChange}
          defaultValue={param.scaler}
        />
        <Scaler scaler={param.scaler} step={param.steps.scaler} handleSteps={handleSteps} />
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        <Select className="flex-1 justify-self-stretch" options={models} name={"model"} text="모델 선택" onChange={handleChange} defaultValue={param.model} />
        <Model model={param.model} step={param.steps.model} handleSteps={handleSteps} />
      </div>
    </form>
  );
}

export default MakePipeline;
