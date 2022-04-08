import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { getColumns, showDataResult } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import Select from "Components/MLML/MLComponents/CompoOptions/CompoPiece/Select";
import { BlockContext } from "Components/MLML/MLComponents/Column";

function Unique({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  // 컬럼명 입력 시 변화 감지하여 상태 값 변경
  const handleChange = (event) => {
    const { name, value } = event.target;
    setParam({
      ...param,
      [name]: value,
    });
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Unique), param);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        showDataResult(data, resultId);
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Select options={columns} name={"col"} text="대상 컬럼명" onChange={handleChange} defaultValue={param.col ? param.col : columns[0]} />
    </form>
  );
}

export default Unique;
