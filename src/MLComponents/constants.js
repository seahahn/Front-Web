// import shortid from "shortid";

export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";
export const NEW_BLOCK = "newBlock";
export const PREPROCESS = "preprocess";
export const TRAIN = "train";
export const EVAL = "eval";
export const ITEM_TYPES = [PREPROCESS, TRAIN, EVAL];

export const FUNCS_CODE = {
  // EDA
  DataUpload: "DataUpload",
  Head: "Head",
  Tail: "Tail",
  Shape: "Shape",
  Dtype: "Dtype",
  ColumnList: "ColumnList",
  Unique: "Unique",
  IsNa: "IsNa",
  Corr: "Corr",
  Describe: "Describe",
  LocDf: "LocDf",
  ILocDf: "ILocDf",
  ColConditionDf: "ColConditionDf",

  // 전처리
  Transpose: "Transpose",
  Groupby: "Groupby",
  Drop: "Drop",
  DropNa: "DropNa",
  RenameCol: "RenameCol",
  SortValue: "SortValue",
  MergeDf: "MergeDf",
  ConcatDf: "ConcatDf",
  SetColumn: "SetColumn",

  // 시각화
  BoxPlot: "BoxPlot",
  HistPlot: "HistPlot",
  CountPlot: "CountPlot",
  ScatterPlot: "ScatterPlot",

  // 데이터셋 분할
  FeatureTargetSplit: "FeatureTargetSplit",
  TrainTestSplit: "TrainTestSplit",

  // 모델 훈련
  MakePipeline: "MakePipeline",
  Fit: "Fit",
  Transform: "Transform",
  ModelSteps: "ModelSteps",

  // 모델 평가
  Predict: "Predict",
  Score: "Score",

  //temporary
  Tuning: "Tuning",
  Evaluate: "Evaluate",
};

/*
id : 사이드바 아이템 각각에 지정된 기능을 나타내는 고유한 값
type : 머신 러닝 기능 구분값
func : (id와 동일한 역할)
title : 머신 러닝 기능 제목
content : 머신 러닝 기능 내용
*/
export const ITEMS_NEW_BLOCK = [
  {
    id: FUNCS_CODE.DataUpload,
    type: SIDEBAR_ITEM + "/" + NEW_BLOCK,
    func: FUNCS_CODE.DataUpload,
    title: "Data Upload",
    content: "Data Upload Function",
  },
  {
    id: FUNCS_CODE.MergeDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.MergeDf,
    title: "Merge",
    content: "Merge Function",
  },
  {
    id: FUNCS_CODE.ConcatDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ConcatDf,
    title: "Concat",
    content: "Concat Function",
  },
];

export const ITEMS_PREPROCESS = [
  {
    id: FUNCS_CODE.Head,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Head,
    title: "Head",
    content: "Head Function",
    param: {
      line: 5,
    },
  },
  {
    id: FUNCS_CODE.Tail,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Tail,
    title: "Tail",
    content: "Tail Function",
    param: { line: 5 },
  },
  {
    id: FUNCS_CODE.Shape,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Shape,
    title: "Shape",
    content: "Shape Function",
  },
  {
    id: FUNCS_CODE.Dtype,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Dtype,
    title: "Dtypes",
    content: "Dtypes Function",
  },
  {
    id: FUNCS_CODE.ColumnList,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ColumnList,
    title: "Col List",
    content: "Col List Function",
  },
  {
    id: FUNCS_CODE.Unique,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Unique,
    title: "Col Unique",
    content: "Col Unique Function",
    param: { col: null },
  },
  {
    id: FUNCS_CODE.IsNa,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.IsNa,
    title: "Is Na",
    content: "Is Na Function",
    param: { sum: false },
  },
  {
    id: FUNCS_CODE.Corr,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Corr,
    title: "Corr",
    content: "Corr Function",
    param: {
      method: "pearson", // 상관 관계 방식 ["pearson", "kendall", "spearman"]
      req_min: 1, // 결측치 제외한 최소 데이터 수(결측치가 너무 많은 컬럼 제거 목적)
      col1: "", // 기준 컬럼
      col2: "", // 대상 컬럼
    },
  },
  {
    id: FUNCS_CODE.Describe,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Describe,
    title: "Describe",
    content: "Describe Function",
    param: {
      percentiles: "", // 확인할 퍼센트 수치들
      num: true, // 수치형 컬럼 표시 여부
      obj: false, // 객체형 컬럼 표시 여부
      cat: false, // 범주형 컬럼 표시 여부
      date: false, // 날짜형 컬럼 표시 여부
      date2num: false, // 날짜형 컬럼을 수치형으로 변환할 지 여부
    },
  },
  {
    id: FUNCS_CODE.LocDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.LocDf,
    title: "Loc",
    content: "Loc Function",
    param: {
      isIdxRange: false, // 인덱스 범위 지정 여부
      isColRange: false, // 컬럼 범위 지정 여부
      idx: "", // 선택 인덱스 목록(1, 2, 3, ...)
      idx_from: "", // 범위 시작 인덱스
      idx_to: "", // 범위 종료 인덱스
      cols: "", // 선택 컬럼 목록(컬럼1, 컬럼2, ...)
      col_from: "", // 범위 시작 컬럼
      col_to: "", // 범위 종료 컬럼
    },
  },
  {
    id: FUNCS_CODE.ILocDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ILocDf,
    title: "iLoc",
    content: "iLoc Function",
    param: {
      isIdxRange: false, // 인덱스 범위 지정 여부
      isColRange: false, // 컬럼 범위 지정 여부
      idx: "", // 선택 인덱스 목록(1, 2, 3, ...)
      idx_from: "", // 범위 시작 인덱스
      idx_to: "", // 범위 종료 인덱스
      cols: "", // 선택 컬럼 목록(컬럼1, 컬럼2, ...)
      col_from: "", // 범위 시작 컬럼
      col_to: "", // 범위 종료 컬럼
    },
  },
  {
    id: FUNCS_CODE.ColConditionDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ColConditionDf,
    title: "Col Condition",
    content: "Col Condition Function",
    param: {
      col: "", // 조건의 기준이 될 컬럼
      cond1: "eq", // 조건 1 "eq", "gr", "gr_eq", "le", "le_eq"
      value1: "", // 조건 1 값
      cond2: "", // 조건 2 "gr", "gr_eq", "le", "le_eq"; 조건1이 None이면 에러 발생
      value2: "", // 조건 2 값
    },
  },

  {
    id: FUNCS_CODE.Transpose,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Transpose,
    title: "Transpose",
    content: "Transpose Function",
  },
  {
    id: FUNCS_CODE.Groupby,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Groupby,
    title: "Groupby",
    content: "Groupby Function",
    param: {
      by: "",
      func: "sum",
      axis: 0,
      as_index: true,
      sort: true,
      group_keys: true,
      observed: false,
      dropna: true,
    },
  },
  {
    id: FUNCS_CODE.Drop,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Drop,
    title: "Drop",
    content: "Drop Function",
    param: {
      labels: [],
      axis: 1,
      errors: "raise",
    },
  },
  {
    id: FUNCS_CODE.DropNa,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.DropNa,
    title: "DropNa",
    content: "DropNa Function",
    param: {
      axis: 0,
      how: "any",
      thresh: "",
      subset: [],
    },
  },
  {
    id: FUNCS_CODE.RenameCol,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.RenameCol,
    title: "Rename Col",
    content: "Rename Col Function",
    param: {
      keys: [], // MultiSelect 변경될 컬럼명
      values: "", // input text 변경할 컬럼명
      copy: true, // Switch 컬럼명 복사/삽입 여부
      errors: "ignore", // Select 없는 컬럼명 지정 시 에러 발생 여부
    },
  },
  {
    id: FUNCS_CODE.SortValue,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.SortValue,
    title: "Sort Value",
    content: "Sort Value Function",
    param: {
      by: [], // MultiSelect
      axis: 0, // Select
      ascd: true, // Select
      kind: "quicksort", // Select
      na_pos: "last", // Select
      ig_idx: false, // Switch
    },
  },
  {
    id: FUNCS_CODE.SetColumn,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.SetColumn,
    title: "Set Column",
    content: "Set Column Function",
    param: {
      isColsOps: false,
      isColRange: false,
      colsOpsCol: "",
      colsOpsVal: "",
      colsOpsOp: "+",
      col: "", // input text
      cols: [], // MultiSelect
      col_from: "", // Select
      col_to: "", // Select
      func: "sum", // Select
      cols_ops: [], // (result string)
    },
  },

  {
    id: FUNCS_CODE.BoxPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.BoxPlot,
    title: "BoxPlot",
    content: "BoxPlot Function",
    param: {
      cols: [],
      // tools: tools,
      background_fill_color: "#efefef",
      fill_color1: "#E08E79",
      fill_color2: "#3B8686",
    },
  },
  {
    id: FUNCS_CODE.HistPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.HistPlot,
    title: "HistPlot",
    content: "HistPlot Function",
    param: {
      col: "",
    },
  },
  {
    id: FUNCS_CODE.CountPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.CountPlot,
    title: "CountPlot",
    content: "CountPlot Function",
    param: {
      col: "",
      title: "",
      height: 250,
      width: 0.9,
    },
  },
  {
    id: FUNCS_CODE.ScatterPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ScatterPlot,
    title: "ScatterPlot",
    content: "ScatterPlot Function",
    param: {
      x_col: "",
      y_col: "",
    },
  },
  {
    id: FUNCS_CODE.FeatureTargetSplit,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.FeatureTargetSplit,
    title: "X / y Split",
    content: "Feature/Target Split Function",
    param: {
      cols: [], // 타겟 컬럼 MultiSelect
    },
  },
  {
    id: FUNCS_CODE.TrainTestSplit,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.TrainTestSplit,
    title: "TrainTestSplit",
    content: "Train Test Split Function",
    param: {
      test_size: 0.25, // input number 0~1
      valid_size: 0.25, // input number 0~1
      random_state: "", // input number int
      shuffle: false, // Switch
      stratify: false, // Switch
      valid: false, // Switch
    },
  },
];

export const ITEMS_TRAIN = [
  {
    id: FUNCS_CODE.MakePipeline,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.MakePipeline,
    title: "Make Pipeline",
    content: "Make Pipeline Function",
    param: {
      name: "", // input text
      encoder: [], // MultiSelect
      scaler: "", // Select
      model: "", // Select
      steps: {}, // 파이프라인 steps 파라미터 설정
    },
  },
  {
    id: FUNCS_CODE.Fit,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.Fit,
    title: "Pipeline Fit",
    content: "Pipeline Fit Function",
    param: {
      name: "",
    },
  },
  {
    id: FUNCS_CODE.Transform,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.Transform,
    title: "Pipeline Transform",
    content: "Pipeline Transform Function",
    param: {
      name: "",
      target: "",
    },
  },
  {
    id: FUNCS_CODE.ModelSteps,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.ModelSteps,
    title: "Pipeline Steps",
    content: "Pipeline Steps Function",
  },
];

export const ITEMS_EVAL = [
  {
    id: FUNCS_CODE.Predict,
    type: SIDEBAR_ITEM + "/" + EVAL,
    func: FUNCS_CODE.Predict,
    title: "Model Predict",
    content: "Model Predict Function",
    param: {
      name: "",
    },
  },
  {
    id: FUNCS_CODE.Score,
    type: SIDEBAR_ITEM + "/" + EVAL,
    func: FUNCS_CODE.Score,
    title: "Model Score",
    content: "Model Score Function",
    param: {
      modelCategory: "reg",
      metric: "r2",
    },
  },
];

// 모든 ML 기능을 담은 목록 만들기
export const ITEM_LIST = ITEMS_NEW_BLOCK.concat(ITEMS_PREPROCESS, ITEMS_TRAIN, ITEMS_EVAL);
export let ITEMS = {};
ITEM_LIST.forEach((object) => (ITEMS[object.id] = object));

// MakePipeline 함수에서 사용하는 Encoder, Scaler, Model 목록
export const ENCODERS_MAPPING = [
  { label: "OneHot", value: "onehot_encoder" },
  { label: "Ordinal", value: "ordinal_encoder" },
  { label: "Target", value: "target_encoder" },
];

export const SCALERS_MAPPING = {
  None: "None",
  standard_scaler: "Standard",
  minmax_scaler: "MinMax",
};

export const MODELS_MAPPING = {
  None: "None",
  // 회귀
  linear_regression: "Linear",
  ridge: "Ridge",
  decision_tree_regressor: "DTReg",
  random_forest_regressor: "RFReg",
  // 분류
  logistic_regression: "Logistic",
  decision_tree_classifier: "DTCls",
  random_forest_classifier: "RFCls",
};

// MLComponents/CompoOptions/Eval/Score.jsx 에서 사용될 모델 평가 지표 목록
export const METRICS_CLS = [
  // Classification
  "accuracy",
  "f1",
  "roc_auc", // requires predict_proba support
  "precision",
  "recall",
  // "balanced_accuracy",
  // "top_k_accuracy"   ,
  // "average_precision",
  // "neg_brier_score"  ,
  // "neg_log_loss"     , // requires predict_proba support
  // "jaccard"          ,
];
export const METRICS_REG = [
  // Regression
  "r2",
  "neg_mean_absolute_error",
  "neg_mean_squared_error",
  // "explained_variance"         ,
  // "max_error"                  ,
  // "neg_mean_squared_log_error" ,
  // "neg_median_absolute_error"  ,
  // "neg_mean_poisson_deviance"  ,
  // "neg_mean_gamma_deviance"    ,
  // "neg_mean_absolute_percentage_error",
];

export const NUM_PARAMS = {
  tol: "tol",
  C: "C",
  intercept_scaling: "intercept_scaling",
  max_iter: "max_iter",
  l1_ratio: "l1_ratio",
  n_jobs: "n_jobs",
  random_state: "random_state",
  min_samples_leaf: "min_samples_leaf",
  smoothing: "smoothing",
  max_depth: "max_depth",
  min_samples_split: "min_samples_split",
  min_weight_fraction_leaf: "min_weight_fraction_leaf",
  max_leaf_nodes: "max_leaf_nodes",
  min_impurity_decrease: "min_impurity_decrease",
  ccp_alpha: "ccp_alpha",
  n_estimators: "n_estimators",
  max_samples: "max_samples",
};
