import React, { useState, useContext } from "react";
import { AppContext } from "App";
import { UPLOAD_ACCEPT, MLFUNCS_URL, URLS_PREPROCESS } from "utils/networkConfigs";
import { funcResultConfig, funcResultLayout } from "Components/MLML/MLComponents/CompoOptions/funcResultConfigs";
import { MLMLContext } from "pages/MLML";
import { BlockContext } from "Components/MLML/MLComponents/Column";
import { saveDf, jsonToFile } from "Components/MLML/MLComponents/CompoOptions/mlUtilFuncs";

function DataUpload({ formId, resultId, isLoading, setIsLoading, render }) {
  const { userIdx } = useContext(AppContext);
  const { dfd } = useContext(MLMLContext);
  const { blockId } = useContext(BlockContext);

  const [file, setFile] = useState();

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    setIsLoading(true); // 로딩 시작
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const url = MLFUNCS_URL.concat(URLS_PREPROCESS.DataUpload); // 백앤드 API URL
    const formData = new FormData(); // 파일 정보를 담을 FormData 객체 생성
    formData.append("file", file);
    const config = {
      method: "POST",
      mode: "cors", // 'cors'
      body: formData,
      headers: {
        "User-Id": userIdx,
        token: localStorage.getItem("AIPLAY_USER_TOKEN"),
      },
      credentials: "include",
    }; // HTTP 통신 설정

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(url, config)
      .then((response) => response.json())
      .then((data) => {
        process.env.REACT_APP_STATUS === "development" && console.log(data);
        // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
        dfd
          .readJSON(jsonToFile(data))
          .then((df) => {
            df.head().plot(resultId).table({ funcResultConfig, funcResultLayout }); // 결과 영역에 출력
            saveDf(blockId, "_df", data, true); // 데이터프레임 저장
          })
          .catch((err) => {
            process.env.REACT_APP_STATUS === "development" && console.log(err);
          });
      })
      .catch((error) => console.error(error));
    setIsLoading(false); // 로딩 종료
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <input type="file" accept={UPLOAD_ACCEPT} onChange={handleChange} />
    </form>
  );
}

export default React.memo(DataUpload);
