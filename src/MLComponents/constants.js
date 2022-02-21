import shortid from "shortid";

export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";
export const PREPROCESS = "preprocess";
export const TRAIN = "train";
export const EVAL = "eval";
export const ITEM_TYPES = [PREPROCESS, TRAIN, EVAL];

/*
id : 사이드바 아이템 각각에 지정된 기능을 나타내는 고유한 값
type : 머신 러닝 기능 구분값
func : (id와 동일한 역할)
title : 머신 러닝 기능 제목
content : 머신 러닝 기능 내용
*/
export const ITEMS_PREPROCESS = [
  {
    id: "DataUpload",
    type: SIDEBAR_ITEM + PREPROCESS,
    func: "DataUpload",
    title: "Data Upload",
    content: "Data Upload Function",
  },
  {
    id: "IsNa",
    type: SIDEBAR_ITEM + PREPROCESS,
    func: "IsNa",
    title: "DF Is Na",
    content: "DF Is Na Function",
  },
];

export const ITEMS_TRAIN = [
  {
    id: "Fit",
    type: SIDEBAR_ITEM + TRAIN,
    func: "Fit",
    title: "Model Training",
    content: "Model Training Function",
  },
  {
    id: "Tuning",
    type: SIDEBAR_ITEM + TRAIN,
    func: "Tuning",
    title: "Model Tuning",
    content: "Model Tuning Function",
  },
];

export const ITEMS_EVAL = [
  {
    id: "Evaluate",
    type: SIDEBAR_ITEM + EVAL,
    func: "Evaluate",
    title: "Model Evaluation",
    content: "Model Evaluation Function",
  },
  {
    id: "PdpIsolate",
    type: SIDEBAR_ITEM + EVAL,
    func: "PdpIsolate",
    title: "PDP Isolate Function",
    content: "PDP Isolate Plot Function",
  },
];

// 모든 ML 기능을 담은 목록 만들기
export const ITEM_LIST = ITEMS_PREPROCESS.concat(ITEMS_TRAIN, ITEMS_EVAL);
export let ITEMS = {};
ITEM_LIST.forEach((object) => (ITEMS[object.id] = object));
