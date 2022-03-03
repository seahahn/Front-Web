import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_TRAIN, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { BlockContext } from "MLComponents/Column";
import { showDataResult, loadTrainTest, getModelSteps } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 모델 훈련 후 중간 과정인 인코더 또는 스케일러의 결과 확인을 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_train을 전송하여 사용자가 선택한 인코더 또는 스케일러의 결과를 확인한다.
 *
 * @returns 정상 작동 시 가공된 데이터프레임, 파이프라인 fit을 하지 않은 경우 "훈련되지 않은 모델입니다."
 */
function Transform({ formId, resultId }) {
  // TODO DB 구현되면 DB에서 목록 가져오기
  const modelList = ["ahn", "ahn_test", "ahn_new", "ahngyeongho", "ahngyeongho1", "ahngyeongho2"];

  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const [targetList, setTargetList] = useState([]);
  const [params, setParams] = useState({
    name: modelList[0],
    key: "test", // TODO "사용자_고유번호/프로젝트_번호" 로 변경 예정
    target: "",
  });

  useEffect(() => {
    getModelSteps("test", params.name).then((res) => setTargetList(res));
  }, [params.name]);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
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

    // 백앤드 전송을 위한 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_TRAIN.Transform), params);
    const df = _.pick(loadTrainTest(blockId), ["X_train"]); // 훈련 데이터셋 가져오기
    console.log(df);
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
      <div className="grid grid-rows-2 gap-2">
        <Select className="flex-1 self-center justify-self-stretch" options={modelList} text="모델 목록" name={"name"} onChange={handleChange} />
        <Select className="flex-1 self-center justify-self-stretch" options={targetList} text="스텝 목록" name={"target"} onChange={handleChange} />
      </div>
    </form>
  );
}

export default React.memo(Transform);
