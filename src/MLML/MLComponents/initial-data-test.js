import shortid from "shortid";
import { COMPONENT, ROW, COLUMN, PREPROCESS, TRAIN, EVAL, FUNCS_CODE } from "./constants";

const initialData = {
  layout: [
    {
      type: COLUMN,
      id: "Block0",
      children: [
        {
          type: ROW,
          id: PREPROCESS,
          children: [
            {
              id: shortid.generate(),
              type: PREPROCESS,
              func: FUNCS_CODE.DataUpload,
            },
          ],
        },
        {
          type: ROW,
          id: TRAIN,
          children: [
            {
              id: shortid.generate(),
              type: TRAIN,
              func: FUNCS_CODE.MakePipeline,
              param: {
                name: "", // input text
                encoder: [], // MultiSelect
                scaler: "None", // Select
                model: "None", // Select
                steps: {}, // 파이프라인 steps 파라미터 설정
              },
            },
          ],
        },
        {
          type: ROW,
          id: EVAL,
          children: [
            {
              id: shortid.generate(),
              type: EVAL,
              func: FUNCS_CODE.Predict,
              param: {
                name: "",
              },
            },
          ],
        },
      ],
    },
  ],
};

export default initialData;
