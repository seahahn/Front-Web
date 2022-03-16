import React, { useEffect } from "react";
import Navbar from "MLML/Navbar/Navbar";
import Footer from "ServiceIntro/Footer";
import { Outlet } from "react-router-dom";
import { targetURL, USER_AUTH_URL, URLS_USER_AUTH } from "MLML/MLComponents/CompoOptions/networkConfigs";
import { setCookie } from "utils/cookie";

function ServiceIntro() {
  const initCSRFToken = async () => {
    const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.index));
    await fetch(targetUrl, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          window.localStorage.setItem("aiplay_csrf_token", data.csrf_token);
          setCookie("csrftoken", data.csrf_token);
        }
      });
  };

  useEffect(() => {
    initCSRFToken();
  }, []);

  return (
    <div>
      <Navbar isMLML={false} />
      <main className="mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ServiceIntro;
