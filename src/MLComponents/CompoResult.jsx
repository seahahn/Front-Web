import React from "react";

function CompoResult({ resultId }) {
  return <div id={resultId} className="resultArea select-text" />;
}

export default React.memo(CompoResult);
