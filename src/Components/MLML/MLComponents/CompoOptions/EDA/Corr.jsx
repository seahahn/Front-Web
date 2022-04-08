import React, { useContext } from "react";
import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "utils/networkConfigs";
import { MLMLContext } from "pages/MLML";
import { inputStyle } from "Components/MLML/MLComponents/componentStyle";
import { showDataResult, getColumns } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";
import { BlockContext } from "Components/MLML/MLComponents/Column";
import { Select } from "Components/MLML/MLComponents/CompoOptions/CompoPiece";

function Corr({ formId, resultId, param, setParam, isLoading, setIsLoading, render }) {
  const { storage } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const columns = getColumns(blockId); // 데이터프레임 컬럼 목록 가져오기

  // 상관 관계 옵션 상태 값 저장
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
    const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.Corr), param);
    const df = storage.getItem(blockId + "_df"); // 기존에 스토리지에 저장되어 있던 데이터프레임(JSON) 가져오기

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(targetUrl, httpConfig(JSON.stringify(df)))
      .then((response) => response.json())
      .then((data) => {
        if (typeof data !== "number") {
          // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
          showDataResult(data, resultId);
        } else {
          document.getElementById(resultId).innerHTML = data; // 결과 영역에 출력
        }
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-1">
        <Select options={["pearson", "kendall", "spearman"]} name={"method"} text="상관 관계 계산 방식" onChange={handleChange} defaultValue={param.method} />
        <label>
          최소 데이터 수
          <input name="req_min" className={inputStyle} type="number" min="1" defaultValue="1" onChange={handleChange} />
        </label>
        <Select options={["", ...columns]} optionText={["전체", ...columns]} name={"col1"} text="기준 컬럼" onChange={handleChange} defaultValue={param.col1} />
        <Select options={["", ...columns]} optionText={["전체", ...columns]} name={"col2"} text="대상 컬럼" onChange={handleChange} defaultValue={param.col2} />
      </div>
    </form>
  );
}

export default Corr;
