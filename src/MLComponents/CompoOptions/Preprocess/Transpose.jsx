import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { saveDf, showDataResult } from "MLComponents/CompoOptions/util";
import { BlockContext } from "MLComponents/Column";

function Transpose({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    // 백앤드 API URL에 파라미터 추가
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Transpose));
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        saveDf(blockId, "_df", data, true); // 데이터프레임 저장
        showDataResult(dfd, data, resultId); // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
        // saveDf("df", data); // 데이터프레임 저장
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <span>옵션 없음</span>
    </form>
  );
}

export default React.memo(Transpose);
