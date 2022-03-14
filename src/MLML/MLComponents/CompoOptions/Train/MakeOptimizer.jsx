import React, { useState, useContext, useRef, useEffect } from "react";
import _ from "lodash";
import classNames from "classnames";
import {
  targetURL,
  MLTRAIN_URL,
  MLTRAIN_SUFFIX_MODEL,
  URLS_TRAIN,
  httpConfig,
  MODEL_KEY_PREFIX,
  USER_IDX,
  UPM_MODEL_URL,
} from "MLML/MLComponents/CompoOptions/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { ContainerContext } from "MLML/MLComponents/Container";
import { showDataResult, getColumns, getModelSteps } from "MLML/MLComponents/CompoOptions/util";
import { ENCODERS_TUNING_MAPPING, MODELS_TUNING_MAPPING, SCALERS_TUNING_MAPPING, REG_MODELS, METRICS_CLS, METRICS_REG } from "MLML/MLComponents/constants";
import { inputStyle } from "MLML/MLComponents/componentStyle";
import { Select, Switch } from "MLML/MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLML/MLComponents/Column";
import EncoderTuning from "./Encoders/EncoderTuning";
import ScalerTuning from "./Scalers/ScalerTuning";
import ModelTuning from "./Models/ModelTuning";

function MakeOptimizer({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd } = useContext(MLMLContext);
  const { modelListRef } = useContext(ContainerContext);
  const { blockId } = useContext(BlockContext);

  const initialModelList = modelListRef.current ? modelListRef.current.map((model) => model.model_name) : [];
  const [modelList, setModelList] = useState(initialModelList);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const scalers = Object.keys(SCALERS_TUNING_MAPPING);
  const models = Object.keys(MODELS_TUNING_MAPPING);

  const [steps, setSteps] = useState(param.steps); // 파이프라인 steps 파라미터 설정
  const handleSteps = (step) => {
    setSteps(Object.assign(steps, step));
  };

  // DOM 접근 위한 Ref
  const nameRef = useRef();

  useEffect(() => {
    console.log(modelListRef.current);
    setModelList(modelListRef.current ? modelListRef.current.map((model) => model.model_name) : []);
  }, [render]);

  // useEffect(() => {
  //   console.log(modelList[0]);
  //   setParam({
  //     ...param,
  //     name: modelList[0],
  //   });
  // }, [modelList]);

  // console.log(param);
  useEffect(() => {
    console.log(modelList[0]);

    getModelSteps(MODEL_KEY_PREFIX + USER_IDX, param.name ? param.name : modelList[0], false, true).then((res) => {
      console.log(res);
      setParam({
        ...param,
        name: param.name ? param.name : modelList[0],
        encoder: res.filter((step) => step.includes("encoder")).map((enc) => ENCODERS_TUNING_MAPPING.find((map) => map.value === enc)),
        scaler: res.filter((step) => step.includes("scaler")).toString(),
        model: res.filter((step) => !step.includes("encoder") && !step.includes("scaler")).toString(),
      });
    });
  }, [modelList, param.name]);

  useEffect(() => {
    console.log("steps changed");
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
    const { name, value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setParam({
        ...param,
        [name]: checked,
      });
    } else {
      setParam({
        ...param,
        [name]: value === "None" ? "" : value,
      });
    }

    // 스케일러 혹은 모델 미선택 시 steps에서 제거
    // if (value === "None") {
    //   setSteps(_.omit(steps, name));
    // }
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것
    document.getElementById(resultId).innerHTML = null;

    // 입력 필수 값 체크
    if (param.newName && param.save_name === "") {
      // 모델명 미입력시 포커스 주기
      nameRef.current.focus();
      setIsLoading(false); // 로딩 종료
      return;
    }
    if (param.model === "") {
      // 모델이 없는 경우 경고 메시지 띄우기
      document.getElementById(resultId).innerHTML = '<span style="color: red;">모델이 없으면 최적화가 불가능합니다!</span>';
      setIsLoading(false); // 로딩 종료
      return;
    }

    const newModelName = param.newName ? param.save_name.replace(" ", "_") : "";
    const paramResult = _.omit(
      {
        ...param,
        save_name: newModelName,
        key: MODEL_KEY_PREFIX + USER_IDX,
      },
      ["encoder", "model", "newName", "scaler", "steps"]
    ); // 입력해야 할 파라미터 설정

    const item = _.pick(
      {
        ...param.steps.encoders,
        [param.scaler]: param.steps.scaler,
        [param.model]: param.steps.model,
      },
      [[...param.encoder.map((enc) => enc.value)].toString(), param.scaler, param.model]
    ); // 전달할 데이터 설정
    console.log(item);
    console.log(paramResult);
    // return;
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.MakeOptimizer), paramResult);
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(item)))
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data.result) {
          const modelData = {
            user_idx: USER_IDX,
            model_name: newModelName ? newModelName : param.name,
          };
          const response = await fetch(UPM_MODEL_URL, httpConfig(JSON.stringify(modelData), "POST", true));
          const freshModelList = await response.json();
          showDataResult(dfd, data.message, resultId);
          modelListRef.current = freshModelList; // 모델 목록 최신화
          console.log(modelListRef.current);
        }
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-row space-x-2">
          <Select
            name="name"
            className="flex-1 self-center justify-self-stretch"
            options={modelList}
            text="모델 선택"
            onChange={handleChange}
            defaultValue={param.name ? param.name : modelList[0]}
          />
          <Select
            name="optimizer"
            className="flex-1 self-center justify-self-stretch"
            options={["randomized_search_cv", "grid_search_cv"]}
            optionText={["RandomizedSearchCV", "GridSearchCV"]}
            text="최적화 방식"
            onChange={handleChange}
            defaultValue={param.optimizer ? param.optimizer : "randomized_search_cv"}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <Switch text="다른 이름으로 저장 : " onChange={handleChange} name={"newName"} checked={param.newName} />
          {param.newName && (
            <input
              name={"save_name"}
              ref={nameRef}
              className={inputStyle + " flex-1 self-center justify-self-stretch"}
              type="text"
              placeholder={"저장할 모델 이름을 입력하세요"}
              onChange={handleChange}
              defaultValue={param.save_name}
            />
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label className="self-center">
            n_iter
            <input
              className={classNames(inputStyle, "w-1/2")}
              type="number"
              placeholder={param.optimizer === "grid_search_cv" ? "Grid에서 적용 X" : "기본값 10"}
              min={1}
              onChange={handleChange}
              name={"n_iter"}
              defaultValue={param.n_iter}
              disabled={param.optimizer === "grid_search_cv" ? true : false}
            />
          </label>
          <label className="self-center">
            cv
            <input
              className={classNames(inputStyle, "w-1/2")}
              type="number"
              placeholder={"기본값 5"}
              min={1}
              onChange={handleChange}
              name={"cv"}
              defaultValue={param.cv}
            />
          </label>
          <label className="self-center">
            random_state
            <input
              className={classNames(inputStyle, "w-1/2")}
              type="number"
              placeholder={"기본값 없음"}
              onChange={handleChange}
              name={"random_state"}
              defaultValue={param.random_state}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select
            name={"scoring"}
            className="flex-1 self-center justify-self-stretch"
            options={REG_MODELS.includes(param.model) ? METRICS_REG : METRICS_CLS}
            text="scoring"
            onChange={handleChange}
            defaultValue={param.scoring}
          />
          <Switch text="return_train_score : " onChange={handleChange} name={"return_train_score"} checked={param.return_train_score} />
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        {/* <div className="flex flex-row space-x-2">
          <label className="self-center">인코더 선택</label>
          <MultiSelect
            options={ENCODERS_TUNING_MAPPING}
            onChange={settingEncoders}
            className="flex-1"
            isMulti={true}
            closeMenuOnSelect={false}
            defaultValue={param.encoder}
          />
        </div> */}
        <div className="flex flex-col space-y-2">
          {Object.values(param.encoder).map((encoder, index) => (
            <EncoderTuning
              key={encoder.value + index}
              encoder={encoder.label}
              encVal={encoder.value}
              handleSteps={handleSteps}
              steps={steps}
              colObjArray={colObjArray}
              optimizer={param.optimizer}
            />
          ))}
        </div>
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        {/* <Select
          className="flex-1 justify-self-stretch"
          options={scalers}
          name={"scaler"}
          text="스케일러 선택"
          onChange={handleChange}
          defaultValue={param.scaler}
        /> */}
        {param.scaler && <ScalerTuning scaler={param.scaler} step={param.steps.scaler} handleSteps={handleSteps} optimizer={param.optimizer} />}
        <hr className="border-2 border-sky-700 bg-sky-700 rounded-lg" />
        {/* <Select className="flex-1 justify-self-stretch" options={models} name={"model"} text="모델 선택" onChange={handleChange} defaultValue={param.model} /> */}
        {param.model && <ModelTuning model={param.model} step={param.steps.model} handleSteps={handleSteps} optimizer={param.optimizer} />}
      </div>
    </form>
  );
}

export default MakeOptimizer;
