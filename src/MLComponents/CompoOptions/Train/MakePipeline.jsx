import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult, getColumns, saveDf, loadDf } from "MLComponents/CompoOptions/util";
import { inputStyle } from "MLComponents/componentStyle";
import { Select, Switch } from "MLComponents/CompoOptions/CompoPiece";
import MultiSelect from "react-select";
import { BlockContext } from "MLComponents/Column";
import Encoder from "./Encoders";

function MakePipeline({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  // 데이터프레임 목록 가져오기
  const dfs = [...Object.keys(storage)]
    .filter((df) => {
      return df.endsWith("_df"); // 맨 뒤 _df 붙은 데이터프레임만 가져오기
    })
    .map((df) => df.slice(0, -3)) // 목록에 표시하기 위해 _df 제거
    .reverse(); // 가장 처음에 저장된 것부터 나열하기 위해 reverse
  // console.log(dfs);

  const columns = getColumns(dfs[0]); // 데이터프레임 컬럼 목록 가져오기
  const colObjArray = [...columns.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const encoderList = ["onehot_encoder", "ordinal_encoder", "target_encoder"]; // 인코더 목록 가져오기
  const encoderObjArray = [...encoderList.map((column) => ({ label: column, value: column }))]; // MultiSelect에서 사용하는 객체 목록

  const scalers = ["standard_scaler", "minmax_scaler"];
  const models = ["linear_regression", "logistic_regression"];

  const [steps, setSteps] = useState({}); // 파이프라인 steps 파라미터 설정
  const handleSteps = (step) => {
    setSteps(...steps, step);
  };

  const [name, setName] = useState(); // input text
  const [encoder, setEncoder] = useState([]); // MultiSelect
  const [scaler, setScaler] = useState(); // Select
  const [model, setModel] = useState(); // Select
  // const [memory, setMemory] = useState();
  const [verbose, setVerbose] = useState(false); // Switch

  // DOM 접근 위한 Ref
  const nameRef = useRef();
  const encoderRef = useRef();
  const scalerRef = useRef();
  const modelRef = useRef();
  const verboseRef = useRef();

  // 컬럼 선택(MultiSelect)
  const settingEncoders = (e) => {
    setEncoder([...e.map((col) => col.value)]);
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
      name: name,
      encoder: encoder,
      scaler: scaler,
      model: model,
      verbose: verbose,
    }; // 입력해야 할 파라미터 설정
    console.log(params);
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.MakePipeline), params);
    // const df = loadDf(leftBlockId, rightBlockId); // 선택된 데이터프레임(JSON) 2개 가져오기
    // console.log(JSON.stringify(df));
    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(steps)))
      .then((response) => response.json())
      .then((data) => {
        // saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        // showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <label className="self-center">인코더 선택</label>
          <MultiSelect options={encoderObjArray} onChange={settingEncoders} className="flex-1" isMulti={true} closeMenuOnSelect={false} />
        </div>
        <div>
          {encoder.forEach((encoder) => {
            <Encoder encoder={encoder} />;
          })}
        </div>
        <Select className="flex-1 justify-self-stretch" options={scalers} ref={scalerRef} text="스케일러 선택" onChange={handleChange} />
        <div>{/* 스케일러 자리 */}</div>
        <Select className="flex-1 justify-self-stretch" options={models} ref={modelRef} text="모델 선택" onChange={handleChange} />
        <div className="grid grid-rows-2 grid-cols-2 space-y-1">{/* 모델 자리 */}</div>
      </div>
    </form>
  );
}

export default React.memo(MakePipeline);
