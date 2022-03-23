import React from "react";
import * as Body from "./ExpBodies";

const bodyMapping = {
  hair_color_gen: "HairColorGen",
};

const ExpBody = ({ func }) => {
  const BodyComponent = Body[bodyMapping[func]];
  return (
    <div className="py-10">
      <BodyComponent />
    </div>
  );
};

export default ExpBody;
