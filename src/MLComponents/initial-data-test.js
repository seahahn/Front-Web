import shortid from "shortid";
import { ROW, COLUMN, PREPROCESS, TRAIN, EVAL, FUNCS_CODE } from "./constants";

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
            {
              id: shortid.generate(),
              type: PREPROCESS,
              func: FUNCS_CODE.BoxPlot,
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
              func: FUNCS_CODE.Fit,
            },
            {
              id: shortid.generate(),
              type: TRAIN,
              func: FUNCS_CODE.Tuning,
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
            },
            {
              id: shortid.generate(),
              type: EVAL,
              func: FUNCS_CODE.Evaluate,
            },
          ],
        },
      ],
    },
  ],
};

export default initialData;
