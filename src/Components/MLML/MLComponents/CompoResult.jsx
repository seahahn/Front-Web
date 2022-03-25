import React from "react";

function CompoResult({ resultId }) {
  return <div id={resultId} className="select-text bk-root" />;
}

export default React.memo(CompoResult);
