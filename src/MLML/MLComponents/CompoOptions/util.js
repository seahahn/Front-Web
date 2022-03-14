import {
  targetURL,
  MLFUNCS_URL,
  MLFUNCS_SUFFIX_DF,
  MLTRAIN_URL,
  MLTRAIN_SUFFIX_MODEL,
  URLS_PREPROCESS,
  URLS_TRAIN,
  httpConfig,
  UPM_PROJ_URL,
  UPM_MODEL_URL,
} from "MLML/MLComponents/CompoOptions/networkConfigs";
import { NUM_PARAMS } from "MLML/MLComponents/constants";
import { funcResultConfig, funcResultLayout } from "MLML/MLComponents/CompoOptions/funcResultConfigs";

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
    window.sessionStorage.setItem(blockId + "_X", JSON.parse(data).X); // 웹 스토리지에 특성 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_y", JSON.parse(data).y); // 웹 스토리지에 타겟 데이터프레임(JSON) 저장

    // 특성 데이터프레임의 컬럼명을 웹 스토리지에 저장
    const dfX = window.sessionStorage.getItem(blockId + "_X");
    saveColumnList(blockId, dfX);
  }
};

// 데이터셋의 특성 / 타겟 불러오기
export const loadFeatureTarget = (blockId) => {
  const dfX = window.sessionStorage.getItem(blockId + "_X"); // 웹 스토리지에 저장된 특성 데이터프레임(JSON) 불러오기
  const dfy = window.sessionStorage.getItem(blockId + "_y"); // 웹 스토리지에 저장된 타겟 데이터프레임(JSON) 불러오기
  return { X: dfX, y: dfy };
};

export const saveTrainTest = (dfd, blockId, data, resultId, valid = false) => {
  if (String(data).startsWith("{") || String(data).startsWith("{", 1)) {
    window.sessionStorage.setItem(blockId + "_XTrain", JSON.parse(data).X_train); // 웹 스토리지에 특성 훈련 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_XTest", JSON.parse(data).X_test); // 웹 스토리지에 특성 테스트 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yTrain", JSON.parse(data).y_train); // 웹 스토리지에 타겟 훈련 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yTest", JSON.parse(data).y_test); // 웹 스토리지에 타겟 테스트 데이터프레임(JSON) 저장
    if (valid) {
      window.sessionStorage.setItem(blockId + "_XValid", JSON.parse(data).X_valid); // 웹 스토리지에 특성 검증 데이터프레임(JSON) 저장
      window.sessionStorage.setItem(blockId + "_yValid", JSON.parse(data).y_valid); // 웹 스토리지에 타겟 검증 데이터프레임(JSON) 저장
    }
  } else {
    document.getElementById(resultId).innerHTML = data; // 올바른 입력이 아니면 에러 메시지 출력
  }
};

export const loadTrainTest = (blockId) => {
  const XTrain = window.sessionStorage.getItem(blockId + "_XTrain"); // 웹 스토리지에 저장된 특성 훈련 데이터프레임(JSON) 불러오기
  const XTest = window.sessionStorage.getItem(blockId + "_XTest"); // 웹 스토리지에 저장된 특성 테스트 데이터프레임(JSON) 불러오기
  const yTrain = window.sessionStorage.getItem(blockId + "_yTrain"); // 웹 스토리지에 저장된 타겟 훈련 데이터프레임(JSON) 불러오기
  const yTest = window.sessionStorage.getItem(blockId + "_yTest"); // 웹 스토리지에 저장된 타겟 테스트 데이터프레임(JSON) 불러오기
  const XValid = window.sessionStorage.getItem(blockId + "_XValid"); // 웹 스토리지에 저장된 특성 검증 데이터프레임(JSON) 불러오기
  const yValid = window.sessionStorage.getItem(blockId + "_yValid"); // 웹 스토리지에 저장된 타겟 검증 데이터프레임(JSON) 불러오기
  console.log(XValid);
  // console.log(yValid)
  return {
    X_train: XTrain,
    X_test: XTest,
    y_train: yTrain,
    y_test: yTest,
    X_valid: XValid,
    y_valid: yValid,
  };
};

export const saveYPred = (blockId, data) => {
  console.log(data); // X_train, (X_valid), X_test
  console.log(Object.keys(data)); // X_train, (X_valid), X_test
  Object.keys(data).forEach((key) => {
    const realKey = key.split("_")[1];
    console.log(key, realKey);
    // const y = window.sessionStorage.getItem(blockId + "_yTest"); // 웹 스토리지에 저장된 타겟 테스트 데이터프레임(JSON) 불러오기
    // window.sessionStorage.setItem(blockId + "_yTrue_"+realKey, y); // 웹 스토리지에 실제 결과 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yPred_" + realKey, data[key].y_pred); // 웹 스토리지에 예측 결과 데이터프레임(JSON) 저장
    window.sessionStorage.setItem(blockId + "_yPredProba_" + realKey, data[key].y_pred_proba); // 웹 스토리지에 예측 결과 확률 데이터프레임(JSON) 저장
  });

  // const yTest = window.sessionStorage.getItem(blockId + "_yTest"); // 웹 스토리지에 저장된 타겟 테스트 데이터프레임(JSON) 불러오기
  // window.sessionStorage.setItem(blockId + "_yTrue", yTest); // 웹 스토리지에 실제 결과 데이터프레임(JSON) 저장
  // window.sessionStorage.setItem(blockId + "_yPred", data.y_pred); // 웹 스토리지에 예측 결과 데이터프레임(JSON) 저장
  // window.sessionStorage.setItem(blockId + "_yPredProba", data.y_pred_proba); // 웹 스토리지에 예측 결과 확률 데이터프레임(JSON) 저장
};

export const loadYPred = (blockId) => {
  // const yTrue = window.sessionStorage.getItem(blockId + "_yTrue"); // 웹 스토리지에 저장된 예측 결과 데이터프레임(JSON) 불러오기
  const yPreds = {};
  const yTrain = window.sessionStorage.getItem(blockId + "_yTrain"); // 웹 스토리지에 저장된 타겟 훈련 데이터프레임(JSON) 불러오기
  const yValid = window.sessionStorage.getItem(blockId + "_yValid"); // 웹 스토리지에 저장된 타겟 검증 데이터프레임(JSON) 불러오기
  const yTest = window.sessionStorage.getItem(blockId + "_yTest"); // 웹 스토리지에 저장된 타겟 테스트 데이터프레임(JSON) 불러오기
  const ys = [yTrain, yValid, yTest];
  const keys = ["X_train", "X_valid", "X_test"];

  keys.forEach((key, index) => {
    const realKey = key.split("_")[1];
    const yPred = window.sessionStorage.getItem(blockId + "_yPred_" + realKey); // 웹 스토리지에 저장된 예측 결과 데이터프레임(JSON) 불러오기
    const yPredProba = window.sessionStorage.getItem(blockId + "_yPredProba_" + realKey); // 웹 스토리지에 저장된 예측 결과 확률 데이터프레임(JSON) 불러오기
    yPreds[key] = {
      y_true: ys[index],
      y_pred: yPred,
      y_pred_proba: yPredProba,
    };
  });
  console.log(yPreds);
  return yPreds;
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
  dfd
    .readJSON(jsonToFile(data))
    .then((df) => {
      // df.print();
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
  document.getElementById(resultId).innerHTML = ""; // 기존 결과 지우기
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

export const getModelSteps = async (key, modelName, detail = false, includeModel = false) => {
  const params = {
    name: modelName,
    key: key,
  };
  const targetUrl = targetURL(MLTRAIN_URL.concat(MLTRAIN_SUFFIX_MODEL, detail ? URLS_TRAIN.ModelStepsDetail : URLS_TRAIN.ModelSteps), params);
  return await fetch(targetUrl, httpConfig(null, "GET"))
    .then((response) => response.json())
    .then((data) => {
      console.log("getModelSteps");
      console.log(data);
      return !detail && !includeModel ? data.filter((step) => step.includes("encoder") || step.includes("scaler")) : data;
    })
    .catch((error) => console.error(error));
};

export const convertNumParams = (name, value, options, setOptions, defaultVal) => {
  // 수치형인 경우 Number로 변환
  value === ""
    ? setOptions({ ...options, [name]: defaultVal[name] })
    : NUM_PARAMS.hasOwnProperty(name)
    ? setOptions({ ...options, [name]: Number(value) })
    : setOptions({ ...options, [name]: value });
};

// 순서 상관 없이 배열이 같은지 찾아내는 함수(두 객체가 동일한 키 목록을 갖고 있는지 확인 시 사용함)
export const equalsIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
};

export const colArrayToObjArray = (cols) => {
  if (!cols) return null;
  const objArray = [];
  for (const col of cols) {
    objArray.push({ label: col, value: col });
  }
  return objArray;
};

export const getProjList = async (userIdx, ref) => {
  const response = await fetch(UPM_PROJ_URL + "/list/" + userIdx, httpConfig(null, "GET"));
  const projList = await response.json();
  ref.current = projList;
  return projList;
  // console.log(ref.current);
};

// 테스트용 임시 모델 목록
export const modelList = ["refac_test", "ahn_model"];

export const getModelList = async (userIdx, ref) => {
  const response = await fetch(UPM_MODEL_URL + "/list/" + userIdx, httpConfig(null, "GET"));
  const modelList = await response.json();
  ref.current = modelList;
  // console.log(ref.current);
  return modelList;
};
