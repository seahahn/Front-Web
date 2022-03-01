import React from "react";

function Encoder({ encoder }) {
  const Options = Encoder[encoder]; // 선택된 인코더 객체 가져오기
  return <Options />;
}

export default Encoder;
