import React, { useContext } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { BlockContext } from "MLComponents/Column";
import { showDataResult, loadTrainTest, modelList } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 훈련 기능을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train, y_train을 전송하여 훈련을 진행한다.
 * 만약 인코더 또는 스케일러까지만 포함된 파이프라인을 사용하는 경우, 해당 부분까지 fit 진행.
 *
 * @returns "training completed"
 */
function Fit({ formId, resultId, param, setParam }) {
  const { dfd } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    const paramResult = {
      ...param,
      key: "test", // TODO "사용자_고유번호/프로젝트_번호" 로 변경 예정
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.Fit), paramResult);
    const df = _.pick(loadTrainTest(blockId), ["X_train", "y_train"]); // 훈련 데이터셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select
        className="flex-1 self-center justify-self-stretch"
        options={modelList}
        text="모델 목록"
        onChange={handleChange}
        defaultValue={param.name ? param.name : modelList[0]}
      />
    </form>
  );
}

export default React.memo(Fit);
