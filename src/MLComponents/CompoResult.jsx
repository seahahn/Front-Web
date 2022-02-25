import React from "react";

function CompoResult({ resultId }) {
  return <div id={resultId} className="resultArea select-text bk-root" />;
}

export default React.memo(CompoResult);
