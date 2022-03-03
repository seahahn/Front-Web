import { targetURL, MLFUNCS_URL, MLFUNCS_SUFFIX_DF, URLS_PREPROCESS, httpConfig } from "MLComponents/CompoOptions/networkConfigs";
import { funcResultConfig, funcResultLayout } from "MLComponents/CompoOptions/funcResultConfigs";

// 백앤드로 보내 가공 처리한 데이터프레임을 웹 스토리지에 저장
export const saveDf = (blockId, name, df, saveColumns = false) => {
  console.log("saveDf name : " + blockId + name);
  if (String(df).startsWith("{") || String(df).startsWith("{", 1)) {
    if (saveColumns) {
      saveColumnList(blockId, df); // 컬럼 리스트 저장
    }
    window.sessionStorage.setItem(blockId + name, df); // 웹 스토리지에 데이터프레임(JSON) 저장
  }
};

// Merge, Concat를 위해 2개의 데이터프레임 불러오기
export const loadDf = (leftBlockId, rightBlockId) => {
  const left = window.sessionStorage.getItem(leftBlockId + "_df"); // 웹 스토리지에 데이터프레임(JSON) 저장
  const right = window.sessionStorage.getItem(rightBlockId + "_df"); // 웹 스토리지에 데이터프레임(JSON) 저장
  return { left: left, right: right };
};

// 데이터셋의 특성 / 타겟 분리하여 각각 웹 스토리지에 저장
export const saveFeatureTarget = (blockId, data) => {
  if (String(data).startsWith("{") || String(data).startsWith("{", 1)) {
    console.log(JSON.parse(data).X);
    console.log(JSON.parse(data).y);
    window.sessionStorage.setItem(blockId + "_X", JSON.parse(data).X); // 웹 스토리지에 특성 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_y", JSON.parse(data).y); // 웹 스토리지에 타겟 데이터프레임(JSON) 저장
  }
};

// 데이터셋의 특성 / 타겟 불러오기
export const loadFeatureTarget = (blockId) => {
  const dfX = window.sessionStorage.getItem(blockId + "_X"); // 웹 스토리지에 특성 데이터프레임(JSON) 저장
  const dfy = window.sessionStorage.getItem(blockId + "_y"); // 웹 스토리지에 타겟 데이터프레임(JSON) 저장
  return { X: dfX, y: dfy };
};

export const saveTrainTest = (dfd, blockId, data, resultId, valid = false) => {
  if (String(data).startsWith("{") || String(data).startsWith("{", 1)) {
    // console.log(JSON.parse(data).X_train);
    // console.log(JSON.parse(data).X_test);
    // console.log(JSON.parse(data).y_train);
    // console.log(JSON.parse(data).y_test);
    window.sessionStorage.setItem(blockId + "_XTrain", JSON.parse(data).X_train); // 웹 스토리지에 특성 훈련 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_XTest", JSON.parse(data).X_test); // 웹 스토리지에 특성 테스트 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yTrain", JSON.parse(data).y_train); // 웹 스토리지에 타겟 훈련 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yTest", JSON.parse(data).y_test); // 웹 스토리지에 타겟 테스트 데이터프레임(JSON) 저장
    if (valid) {
      window.sessionStorage.setItem(blockId + "_XValid", JSON.parse(data).X_valid); // 웹 스토리지에 특성 검증 데이터프레임(JSON) 저장
      window.sessionStorage.setItem(blockId + "_yValid", JSON.parse(data).y_valid); // 웹 스토리지에 타겟 검증 데이터프레임(JSON) 저장
    }
    showShape(dfd, JSON.parse(data), resultId, valid);
  } else {
    document.getElementById(resultId).innerHTML = data; // 올바른 입력이 아니면 에러 메시지 출력
  }
};

// train_test_split 수행 후 shape 보여주기 위한 함수
export const showShape = (dfd, data, resultId, valid = false) => {
  dfd.readJSON(jsonToFile(data.X_train)).then((df) => {
    document.getElementById(resultId).innerHTML = "<p>Train Set Shape : " + df.shape + "</p>";
  });
  if (valid) {
    dfd.readJSON(jsonToFile(data.X_valid)).then((df) => {
      let p = document.createElement("p");
      p.textContent = "Valid Set Shape : " + df.shape;
      document.getElementById(resultId).append(p);
    });
  }
  dfd.readJSON(jsonToFile(data.X_test)).then((df) => {
    let p = document.createElement("p");
    p.textContent = "Test Set Shape : " + df.shape;
    document.getElementById(resultId).append(p);
  });
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
      df.print();
      df.plot(resultId).table({ config: funcResultConfig, layout: funcResultLayout }); // 결과 영역에 출력
    })
    .catch((err) => {
      console.log(err);
    });
};

// 데이터프레임과 시각화 목적에 맞는 조건을 백앤드에 보낸 후, 백앤드에서 받은 시각화 자료를 보여주기
export const showPlot = (data, resultId) => {
  if (String(data).startsWith("{")) {
    document.getElementById(resultId).innerHTML = ""; // 기존 결과 지우기
    window.Bokeh.embed.embed_item(JSON.parse(data), resultId); // 결과 영역에 출력
  } else {
    document.getElementById(resultId).innerHTML = data; // 올바른 입력이 아니면 에러 메시지 출력
  }
};

export const showDataResult = (dfd, data, resultId) => {
  if (String(data).startsWith("{") || String(data).startsWith("{", 1)) {
    showDataFrame(dfd, data, resultId);
  } else {
    document.getElementById(resultId).innerHTML = data; // 올바른 입력이 아니면 에러 메시지 출력
  }
};

// 세션 스토리지에 데이터프레임의 컬럼 목록 저장하는 함수
export const saveColumnList = async (blockId, df) => {
  const targetUrl = targetURL(MLFUNCS_URL.concat(MLFUNCS_SUFFIX_DF, URLS_PREPROCESS.ColumnList));

  await fetch(targetUrl, httpConfig(JSON.stringify(df)))
    .then((response) => response.json())
    .then((data) => {
      console.log("saveColumnList");
      window.sessionStorage.setItem(blockId + "_columns", data);
    })
    .catch((error) => console.error(error));
};

export const getColumns = (blockId) => {
  if (window.sessionStorage.getItem(blockId + "_columns") !== null) {
    return window.sessionStorage
      .getItem(blockId + "_columns")
      .replace(/['\[\]]/g, "")
      .split(",")
      .map((element) => {
        return element.trim();
      }); // 데이터프레임 컬럼 목록 가져오기
  }
  return [];
};
