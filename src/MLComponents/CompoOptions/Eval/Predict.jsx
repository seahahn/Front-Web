import React, { useContext } from "react";
import _ from "lodash";
import { targetURL, MLTRAIN_URL, MLTRAIN_SUFFIX_MODEL, URLS_EVAL, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { BlockContext } from "MLComponents/Column";
import { showDataResult, loadTrainTest, saveYPred, modelList } from "MLComponents/CompoOptions/util";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

/**
 * 테스트셋의 예측 결과(y_pred)를 얻기 위한 컴포넌트.
 * MakePipeline에서 만든 파이프라인(모델)에 X_test를 전송하여 결과를 가져온다.
 * 만약 분류 모델인 경우 y_pred_proba도 가져온다.
 *
 * @returns {
            "y_pred"      : pd.DataFrame(pipe.predict(X_test)).to_json(orient="records"),
            "y_pred_proba": pd.DataFrame(pipe.predict_proba(X_test)).to_json(orient="records") # 분류 모델인 경우 포함
        }
 */
function Predict({ formId, resultId, param, setParam }) {
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

    // 백앤드 전송을 위한 설정
    const paramResult = {
      ...param,
      key: "test", // TODO "사용자_고유번호/프로젝트_번호" 로 변경 예정
    }; // 입력해야 할 파라미터 설정
    const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, URLS_EVAL.Predict), paramResult);
    const XTest = _.pick(loadTrainTest(blockId), ["X_test"]).X_test; // 테스트셋 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(XTest)))
      .then((response) => response.json())
      .then((data) => {
        saveYPred(blockId, data);
        showDataResult(dfd, data.y_pred, resultId); // y_pred 결과만 보여주기
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

export default React.memo(Predict);
