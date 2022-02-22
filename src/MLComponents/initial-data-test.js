import shortid from "shortid";
import { COMPONENT, ROW, COLUMN, PREPROCESS, TRAIN, EVAL } from "./constants";

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
              func: "DataUpload",
            },
            {
              id: shortid.generate(),
              type: PREPROCESS,
              func: "IsNa",
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
              func: "Fit",
            },
            {
              id: shortid.generate(),
              type: TRAIN,
              func: "Tuning",
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
              func: "Evaluate",
            },
            {
              id: shortid.generate(),
              type: EVAL,
              func: "PdpIsolate",
            },
          ],
        },
      ],
    },
  ],
};

export default initialData;
