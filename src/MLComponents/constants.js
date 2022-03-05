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
    title: "DF Merge",
    content: "DF Merge Function",
  },
  {
    id: FUNCS_CODE.ConcatDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ConcatDf,
    title: "DF Concat",
    content: "DF Concat Function",
  },
];

export const ITEMS_PREPROCESS = [
  {
    id: FUNCS_CODE.Head,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Head,
    title: "DF Head",
    content: "DF Head Function",
  },
  {
    id: FUNCS_CODE.Tail,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Tail,
    title: "DF Tail",
    content: "DF Tail Function",
  },
  {
    id: FUNCS_CODE.Shape,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Shape,
    title: "DF Shape",
    content: "DF Shape Function",
  },
  {
    id: FUNCS_CODE.Dtype,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Dtype,
    title: "DF Dtypes",
    content: "DF Dtypes Function",
  },
  {
    id: FUNCS_CODE.ColumnList,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ColumnList,
    title: "DF Col List",
    content: "DF Col List Function",
  },
  {
    id: FUNCS_CODE.Unique,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Unique,
    title: "Col Unique",
    content: "Col Unique Function",
  },
  {
    id: FUNCS_CODE.IsNa,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.IsNa,
    title: "DF Is Na",
    content: "DF Is Na Function",
  },
  {
    id: FUNCS_CODE.Corr,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Corr,
    title: "DF Corr",
    content: "DF Corr Function",
  },
  {
    id: FUNCS_CODE.Describe,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Describe,
    title: "DF Describe",
    content: "DF Describe Function",
  },
  {
    id: FUNCS_CODE.LocDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.LocDf,
    title: "DF Loc",
    content: "DF Loc Function",
  },
  {
    id: FUNCS_CODE.ILocDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ILocDf,
    title: "DF iLoc",
    content: "DF iLoc Function",
  },
  {
    id: FUNCS_CODE.ColConditionDf,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ColConditionDf,
    title: "DF Col Condition",
    content: "DF Col Condition Function",
  },

  {
    id: FUNCS_CODE.Transpose,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Transpose,
    title: "DF Transpose",
    content: "DF Transpose Function",
  },
  {
    id: FUNCS_CODE.Groupby,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Groupby,
    title: "DF Groupby",
    content: "DF Groupby Function",
  },
  {
    id: FUNCS_CODE.Drop,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.Drop,
    title: "DF Drop",
    content: "DF Drop Function",
  },
  {
    id: FUNCS_CODE.DropNa,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.DropNa,
    title: "DF DropNa",
    content: "DF DropNa Function",
  },
  {
    id: FUNCS_CODE.RenameCol,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.RenameCol,
    title: "DF Rename Col",
    content: "DF Rename Col Function",
  },
  {
    id: FUNCS_CODE.SortValue,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.SortValue,
    title: "DF Sort Value",
    content: "DF Sort Value Function",
  },
  {
    id: FUNCS_CODE.SetColumn,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.SetColumn,
    title: "DF Set Column",
    content: "DF Set Column Function",
  },

  {
    id: FUNCS_CODE.BoxPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.BoxPlot,
    title: "BoxPlot",
    content: "BoxPlot Function",
  },
  {
    id: FUNCS_CODE.HistPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.HistPlot,
    title: "HistPlot",
    content: "HistPlot Function",
  },
  {
    id: FUNCS_CODE.CountPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.CountPlot,
    title: "CountPlot",
    content: "CountPlot Function",
  },
  {
    id: FUNCS_CODE.ScatterPlot,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.ScatterPlot,
    title: "ScatterPlot",
    content: "ScatterPlot Function",
  },
  {
    id: FUNCS_CODE.FeatureTargetSplit,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.FeatureTargetSplit,
    title: "Feature/Target Split",
    content: "Feature/Target Split Function",
  },
  {
    id: FUNCS_CODE.TrainTestSplit,
    type: SIDEBAR_ITEM + "/" + PREPROCESS,
    func: FUNCS_CODE.TrainTestSplit,
    title: "Train Test Split",
    content: "Train Test Split Function",
  },
];

export const ITEMS_TRAIN = [
  {
    id: FUNCS_CODE.MakePipeline,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.MakePipeline,
    title: "Make Pipeline",
    content: "Make Pipeline Function",
  },
  {
    id: FUNCS_CODE.Fit,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.Fit,
    title: "Pipeline Fit",
    content: "Pipeline Fit Function",
  },
  {
    id: FUNCS_CODE.Transform,
    type: SIDEBAR_ITEM + "/" + TRAIN,
    func: FUNCS_CODE.Transform,
    title: "Pipeline Transform",
    content: "Pipeline Transform Function",
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
  },
  {
    id: FUNCS_CODE.Score,
    type: SIDEBAR_ITEM + "/" + EVAL,
    func: FUNCS_CODE.Score,
    title: "Model Score",
    content: "Model Score Function",
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
  max_features: "max_features",
  max_leaf_nodes: "max_leaf_nodes",
  min_impurity_decrease: "min_impurity_decrease",
  ccp_alpha: "ccp_alpha",
  n_estimators: "n_estimators",
  max_samples: "max_samples",
};
