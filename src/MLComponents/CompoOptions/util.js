import { targetURL, MLFUNC_URL, MLFUNC_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { funcResultConfig, funcResultLayout } from "MLComponents/CompoOptions/funcResultConfigs";

// 백앤드로 보내 가공 처리한 데이터프레임을 웹 스토리지에 저장
export const saveDf = (name, df, saveColumns = false) => {
  console.log("saveDf");
  if (saveColumns) {
    saveColumnList(df); // 컬럼 리스트 저장
  }
  window.sessionStorage.setItem(name, df); // 웹 스토리지에 데이터프레임(JSON) 저장
};

// 백앤드에서 받은 JSON 데이터프레임 문자열을 임시 파일로 만드는 함수
export const jsonToFile = (jsonData) => {
  const jsonFile = new File([jsonData], "temp.json", { type: "application/json" });
  return jsonFile;
};

// JSON 데이터프레임 문자열을 담은 파일을 읽어서 데이터프레임으로 만든 후 보여주기
export const showDataFrame = (dfd, data, resultId) => {
  document.getElementById(resultId).innerHTML = ""; // 기존 결과 지우기
  dfd
    .readJSON(jsonToFile(data))
    .then((df) => {
      df.plot(resultId).table({ funcResultConfig, funcResultLayout }); // 결과 영역에 출력
    })
    .catch((err) => {
      console.log(err);
    });
};

export const showDataResult = (dfd, data, resultId) => {
  if (String(data).startsWith("{") || String(data).startsWith("{", 1)) {
    showDataFrame(dfd, data, resultId);
  } else {
    document.getElementById(resultId).innerHTML = data; // 결과 영역에 출력
  }
};

// 세션 스토리지에 데이터프레임의 컬럼 목록 저장하는 함수
export const saveColumnList = async (df) => {
  const targetUrl = targetURL(MLFUNC_URL.concat(MLFUNC_SUFFIX_DF, URLS_PREPROCESS.ColumnList));

  await fetch(targetUrl, httpConfig(JSON.stringify(df)))
    .then((response) => response.json())
    .then((data) => {
      console.log("saveColumnList");
      window.sessionStorage.setItem("columns", data);
    })
    .catch((error) => console.error(error));
};

export const getColumns = () => {
  if (window.sessionStorage.getItem("columns") !== null) {
    return window.sessionStorage
      .getItem("columns")
      .replace(/['\[\]]/g, "")
      .split(",")
      .map((element) => {
        return element.trim();
      }); // 데이터프레임 컬럼 목록 가져오기
  }
  return [];
};
