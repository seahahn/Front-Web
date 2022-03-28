import { memo, useEffect } from "react";
import Navbar from "Components/MLML/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { initCSRFToken } from "utils/auth";

function WholeCover() {
  useEffect(() => {
    // 접속 시 CSRF 토큰 발급
    initCSRFToken();
  });

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default memo(WholeCover);
