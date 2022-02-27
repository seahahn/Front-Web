// import shortid from "shortid";

export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";
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

  //tempporary
  Fit: "Fit",
  Tuning: "Tuning",
  Predict: "Predict",
  Evaluate: "Evaluate",
};

/*
id : 사이드바 아이템 각각에 지정된 기능을 나타내는 고유한 값
type : 머신 러닝 기능 구분값
func : (id와 동일한 역할)
title : 머신 러닝 기능 제목
content : 머신 러닝 기능 내용
*/
export const ITEMS_PREPROCESS = [
  {
    id: FUNCS_CODE.DataUpload,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.DataUpload,
    title: "Data Upload",
    content: "Data Upload Function",
  },
  {
    id: FUNCS_CODE.Head,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Head,
    title: "DF Head",
    content: "DF Head Function",
  },
  {
    id: FUNCS_CODE.Tail,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Tail,
    title: "DF Tail",
    content: "DF Tail Function",
  },
  {
    id: FUNCS_CODE.Shape,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Shape,
    title: "DF Shape",
    content: "DF Shape Function",
  },
  {
    id: FUNCS_CODE.Dtype,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Dtype,
    title: "DF Dtypes",
    content: "DF Dtypes Function",
  },
  {
    id: FUNCS_CODE.ColumnList,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.ColumnList,
    title: "DF Col List",
    content: "DF Col List Function",
  },
  {
    id: FUNCS_CODE.Unique,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Unique,
    title: "Col Unique",
    content: "Col Unique Function",
  },
  {
    id: FUNCS_CODE.IsNa,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.IsNa,
    title: "DF Is Na",
    content: "DF Is Na Function",
  },
  {
    id: FUNCS_CODE.Corr,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Corr,
    title: "DF Corr",
    content: "DF Corr Function",
  },
  {
    id: FUNCS_CODE.Describe,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Describe,
    title: "DF Describe",
    content: "DF Describe Function",
  },
  {
    id: FUNCS_CODE.LocDf,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.LocDf,
    title: "DF Loc",
    content: "DF Loc Function",
  },
  {
    id: FUNCS_CODE.ILocDf,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.ILocDf,
    title: "DF iLoc",
    content: "DF iLoc Function",
  },
  {
    id: FUNCS_CODE.ColConditionDf,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.ColConditionDf,
    title: "DF Col Condition",
    content: "DF Col Condition Function",
  },

  {
    id: FUNCS_CODE.Transpose,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Transpose,
    title: "DF Transpose",
    content: "DF Transpose Function",
  },
  {
    id: FUNCS_CODE.Groupby,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Groupby,
    title: "DF Groupby",
    content: "DF Groupby Function",
  },
  {
    id: FUNCS_CODE.Drop,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.Drop,
    title: "DF Drop",
    content: "DF Drop Function",
  },
  {
    id: FUNCS_CODE.DropNa,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.DropNa,
    title: "DF DropNa",
    content: "DF DropNa Function",
  },
  {
    id: FUNCS_CODE.RenameCol,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.RenameCol,
    title: "DF Rename Col",
    content: "DF Rename Col Function",
  },
  {
    id: FUNCS_CODE.SortValue,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.SortValue,
    title: "DF Sort Value",
    content: "DF Sort Value Function",
  },
  {
    id: FUNCS_CODE.SetColumn,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.SetColumn,
    title: "DF Set Column",
    content: "DF Set Column Function",
  },
  // {
  //   id: FUNCS_CODE.MergeDf,
  //   type: SIDEBAR_ITEM + PREPROCESS,
  //   func: FUNCS_CODE.MergeDf,
  //   title: "DF Merge",
  //   content: "DF Merge Function",
  // },
  // {
  //   id: FUNCS_CODE.ConcatDf,
  //   type: SIDEBAR_ITEM + PREPROCESS,
  //   func: FUNCS_CODE.ConcatDf,
  //   title: "DF Concat",
  //   content: "DF Concat Function",
  // },
  {
    id: FUNCS_CODE.BoxPlot,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.BoxPlot,
    title: "BoxPlot",
    content: "BoxPlot Function",
  },
  {
    id: FUNCS_CODE.HistPlot,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.HistPlot,
    title: "HistPlot",
    content: "HistPlot Function",
  },
  {
    id: FUNCS_CODE.CountPlot,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.CountPlot,
    title: "CountPlot",
    content: "CountPlot Function",
  },
  {
    id: FUNCS_CODE.ScatterPlot,
    type: SIDEBAR_ITEM + PREPROCESS,
    func: FUNCS_CODE.ScatterPlot,
    title: "ScatterPlot",
    content: "ScatterPlot Function",
  },
];

export const ITEMS_TRAIN = [
  {
    id: FUNCS_CODE.Fit,
    type: SIDEBAR_ITEM + TRAIN,
    func: FUNCS_CODE.Fit,
    title: "Model Training",
    content: "Model Training Function",
  },
  {
    id: FUNCS_CODE.Tuning,
    type: SIDEBAR_ITEM + TRAIN,
    func: FUNCS_CODE.Tuning,
    title: "Model Tuning",
    content: "Model Tuning Function",
  },
];

export const ITEMS_EVAL = [
  {
    id: FUNCS_CODE.Predict,
    type: SIDEBAR_ITEM + EVAL,
    func: FUNCS_CODE.Predict,
    title: "Model Evaluation",
    content: "Model Evaluation Function",
  },
  {
    id: FUNCS_CODE.Evaluate,
    type: SIDEBAR_ITEM + EVAL,
    func: FUNCS_CODE.Evaluate,
    title: "PDP Isolate Function",
    content: "PDP Isolate Plot Function",
  },
];

// 모든 ML 기능을 담은 목록 만들기
export const ITEM_LIST = ITEMS_PREPROCESS.concat(ITEMS_TRAIN, ITEMS_EVAL);
export let ITEMS = {};
ITEM_LIST.forEach((object) => (ITEMS[object.id] = object));
