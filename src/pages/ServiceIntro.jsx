import React, { useEffect } from "react";
import Navbar from "Components/MLML/Navbar/Navbar";
import Footer from "Components/ServiceIntro/Footer";
import { Outlet } from "react-router-dom";
import { targetURL, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import { setCookie } from "utils/cookie";

function ServiceIntro() {
  const initCSRFToken = async () => {
    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.index));
    await fetch(targetUrl, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          localStorage.setItem("aiplay_csrf_token", data.csrf_token);
          setCookie("csrftoken", data.csrf_token);
        }
      });
  };

  useEffect(() => {
    initCSRFToken();
  }, []);

  return (
    <>
      <Navbar isMLML={false} />
      <main className="mt-16 h-auto min-h-full pb-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default ServiceIntro;
