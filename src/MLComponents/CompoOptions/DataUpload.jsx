import React, { useState, useContext } from "react";
import { UPLOAD_ACCEPT, MLFUNC_URL, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { funcResultConfig, funcResultLayout } from "MLComponents/CompoOptions/funcResultConfigs";
import { AppContext } from "App";
import { saveDf, jsonToFile } from "MLComponents/CompoOptions/util";

function DataUpload({ formId, resultId }) {
  const [file, setFile] = useState();
  const { dfd, storage } = useContext(AppContext);

  // 파일 선택 시 선택한 파일 데이터를 file State에 저장
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  // 백앤드로 데이터 전송
  const handleSubmit = async (event) => {
    event.preventDefault(); // 실행 버튼 눌러도 페이지 새로고침 안 되도록 하는 것

    // 백앤드 전송을 위한 설정
    const url = MLFUNC_URL.concat(URLS_PREPROCESS.DataUpload); // 백앤드 API URL
    const formData = new FormData(); // 파일 정보를 담을 FormData 객체 생성
    formData.append("file", file);
    // const config = httpConfig(formData); // HTTP 통신 설정

    // 데이터 전송 후 받아온 데이터프레임을 사용자에게 보여주기 위한 코드
    await fetch(url, httpConfig(formData))
      .then((response) => response.json())
      .then((data) => {
        // JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
        dfd
          .readJSON(jsonToFile(data))
          .then((df) => {
            df.head().plot(resultId).table({ funcResultConfig, funcResultLayout }); // 결과 영역에 출력
            saveDf("df", data, true); // 데이터프레임 저장
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => console.error(error));
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <input type="file" accept={UPLOAD_ACCEPT} onChange={handleChange} />
    </form>
  );
}

export default React.memo(DataUpload);
