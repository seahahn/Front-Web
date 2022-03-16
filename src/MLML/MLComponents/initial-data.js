import { ROW, COLUMN, PREPROCESS, TRAIN, EVAL } from "./constants";

const emptyData = {
  layout: [
    {
      type: COLUMN,
      id: "",
      children: [
        {
          type: ROW,
          id: PREPROCESS,
          children: [],
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

export default emptyData;
