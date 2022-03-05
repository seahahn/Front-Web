import React, { useState, useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { AppContext } from "App";
import { showDataResult } from "MLComponents/CompoOptions/util";
import { BlockContext } from "MLComponents/Column";
import { Select } from "MLComponents/CompoOptions/CompoPiece";

function IsNa({ formId, resultId }) {
  const { dfd, storage } = useContext(AppContext);
  const { blockId } = useContext(BlockContext);

  const [params, setParams] = useState({ sum: false });

  // 결측치 개수 합계 표시 여부 상태 값 저장
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParams({ [name]: value });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.IsNa), params);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
        showDataResult(dfd, data, resultId);
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select options={[false, true]} optionText={["데이터프레임", "컬럼별 결측치 수"]} name={"sum"} text="결측치 확인 방식" onChange={handleChange} />
    </form>
  );
}

export default React.memo(IsNa);
