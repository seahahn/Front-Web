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
          ],
        },
        {
          type: ROW,
          id: TRAIN,
          children: [],
        },
        {
          type: ROW,
          id: EVAL,
          children: [],
        },
      ],
    },
  ],
};

export default initialData;
