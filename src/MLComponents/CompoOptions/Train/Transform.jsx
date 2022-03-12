import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig, MODEL_KEY_PREFIX, USER_IDX } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { ContainerContext } from "MLComponents/Container";
import { BlockContext } from "MLComponents/Column";
import { showDataResult, loadTrainTest, getModelSteps } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 훈련 후 중간 과정인 인코더 또는 스케일러의 결과 확인을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train을 전송하여 사용자가 선택한 인코더 또는 스케일러의 결과를 확인한다.
 *
 * @returns 정상 작동 시 가공된 데이터프레임, 파이프라인 fit을 하지 않은 경우 "훈련되지 않은 모델입니다."
 */
function Transform({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { dfd } = useContext(AppContext);
  const { modelListRef } = useContext(ContainerContext);
  const { blockId } = useContext(BlockContext);

  const initialModelList = modelListRef.current ? modelListRef.current.map((model) => model.model_name) : [];

  const [modelList, setModelList] = useState(initialModelList);
  const [targetList, setTargetList] = useState([]);

  useEffect(() => {
    modelList.length !== 0 && getModelSteps(MODEL_KEY_PREFIX + USER_IDX, param.name ? param.name : modelList[0]).then((res) => setTargetList(res));
  }, [param.name]);

  useEffect(() => {
    setModelList(modelListRef.current ? modelListRef.current.map((model) => model.model_name) : []);
  }, [render]);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value,
    });
    document.getElementById(resultId).innerHTML = "";
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것
    if (targetList.length === 0) {
      document.getElementById(resultId).innerHTML = '<span style="color: red;">확인할 모델 스텝이 없습니다!</span>';
      return;
    }

    const paramResult = {
      ...param,
      key: MODEL_KEY_PREFIX + USER_IDX,
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.Transform), paramResult);
    const df = _.pick(loadTrainTest(blockId), ["X_train"]).X_train; // 훈련 데이터셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="grid grid-rows-2 gap-2">
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={modelList}
          text="모델 목록"
          name={"name"}
          onChange={handleChange}
          defaultValue={param.name ? param.name : modelList[0]}
        />
        <Select
          className="flex-1 self-center justify-self-stretch"
          options={targetList.length !== 0 ? ["", ...targetList] : ["None"]}
          optionText={targetList.length !== 0 ? ["전체", ...targetList] : ["없음"]}
          text="스텝 목록"
          name={"target"}
          onChange={handleChange}
          disabled={targetList.length === 0 ? true : false}
        />
      </div>
    </form>
  );
}

export default React.memo(Transform);
