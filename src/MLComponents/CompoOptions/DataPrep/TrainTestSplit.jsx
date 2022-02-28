import React, { useState, useContext, useRef } from "react";
import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { inputStyle } from "MLComponents/componentStyle";
import { loadFeatureTarget, saveTrainTest, showDataResult, showShape } from "MLComponents/CompoOptions/util";
import { Switch } from "MLComponents/CompoOptions/CompoPiece";
import { BlockContext } from "MLComponents/Column";

function TrainTestSplit({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  // const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  const [testSize, setTestSize] = useState(0.2); // input number 0~1
  const [trainSize, setTrainSize] = useState(0.8); // input number 0~1
  const [randomState, setRandomState] = useState(42); // input number int
  const [shuffle, setShuffle] = useState(false); // Switch
  const [stratify, setStratify] = useState(false); // Switch

  const testSizeRef = useRef();
  const trainSizeRef = useRef();
  const randomStateRef = useRef();
  const shuffleRef = useRef();
  const stratifyRef = useRef();

  // 컬럼명 입력 시 변화 감지하여 상태 값 변경
  const handleChange = (event) => {
    console.log(event.target.value);
    switch (event.target) {
      // 함수 지정 시
      case testSizeRef.current:
        setTestSize(event.target.value);
        break;
      case trainSizeRef.current:
        setTrainSize(event.target.value);
        break;
      case randomStateRef.current:
        setRandomState(event.target.value);
        break;
      case shuffleRef.current:
        setShuffle(!shuffle);
        break;
      case stratifyRef.current:
        setStratify(!stratify);
        break;
      default:
        console.log("error");
        break;
    }
  };

  /**
   *
   * TODO showDataResult -> shape 출력으로 변경하기
   */
  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const params = {
      test_size: testSize && !trainSize ? testSize : "",
      train_size: trainSize && !testSize ? trainSize : "",
      random_state: randomState ? randomState : 42,
      shuffle: shuffle,
      stratify: stratify,
    }; // 입력해야 할 파라미터 설정

    // 입력해야 할 파라미터가 규칙대로 입력되었는지 확인
    if (testSize && trainSize) {
      document.getElementById(resultId).innerHTML = "test_size 또는 train_size 둘 중 하나만 입력 가능"; // 올바른 입력이 아니면 에러 메시지 출력
      return;
    }

    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.TrainTestSplit), params);
    const df = loadFeatureTarget(blockId);

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        saveTrainTest(dfd, blockId, data, resultId);
        // String(data).startsWith("{") ? showShape(dfd, JSON.parse(data), resultId) : (document.getElementById(resultId).innerHTML = data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <div className="grid grid-rows-3 grid-cols-2 space-y-1">
          <label>테스트셋 비율</label>
          <input
            ref={testSizeRef}
            className={inputStyle}
            type="number"
            step="any"
            min={0}
            max={1}
            onChange={handleChange}
            placeholder="기본값 0.25 / 훈련셋 입력 시 이에 따라 자동 설정"
            defaultValue={testSize}
          />
          <label>훈련셋 비율</label>
          <input
            ref={trainSizeRef}
            className={inputStyle}
            type="number"
            step="any"
            min={0}
            max={1}
            onChange={handleChange}
            placeholder="테스트셋 비율에 따라 자동 설정"
            defaultValue={trainSize}
          />
          <label>시드 값</label>
          <input
            ref={randomStateRef}
            className={inputStyle}
            type="number"
            step="any"
            onChange={handleChange}
            placeholder="기본값 42"
            defaultValue={randomState}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <Switch ref={shuffleRef} text="셔플 여부" onChange={handleChange} checked={shuffle} />
          <Switch ref={stratifyRef} text="타겟 균등 분포 여부" onChange={handleChange} checked={stratify} />
        </div>
      </div>
    </form>
  );
}

export default React.memo(TrainTestSplit);
