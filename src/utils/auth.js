import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "utils/networkConfigs";
import { setCookie } from "utils/cookie";

export const initCSRFToken = async () => {
  process.env.REACT_APP_STATUS === "development" && console.log("init CSRF token");
  const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.index));
  await fetch(targetUrl, { mode: "cors" })
    .then((response) => response.json())
    .then((data) => {
      if (data.result) {
        localStorage.setItem("aiplay_csrf_token", data.csrf_token);
        setCookie("csrftoken", data.csrf_token);
      }
    });
};

export const refreshToken = async () => {
  process.env.REACT_APP_STATUS === "development" && console.log("refresh token");
  const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.refresh_jwt));
  const response = await fetch(targetUrl, httpConfig(null, "GET"));
  const res = await response.json();
  if (res.result) {
    process.env.REACT_APP_STATUS === "development" && console.log("refreshToken success", res.result);
    localStorage.setItem("AIPLAY_USER_TOKEN", res.token);
    return { result: res.result };
  } else {
    process.env.REACT_APP_STATUS === "development" && console.log("refreshToken error: ", res.message);
    return { result: res.result };
  }
};

export const removeToken = async () => {
  process.env.REACT_APP_STATUS === "development" && console.log("remove token");
  const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.remove_jwt));
  await fetch(targetUrl, httpConfig(null, "GET"))
    .then((res) => res.json())
    .then((res) => {
      if (res.result) {
        process.env.REACT_APP_STATUS === "development" && console.log("removeToken success", res.result);
      } else {
        process.env.REACT_APP_STATUS === "development" && console.log("removeToken error: ", res.message);
      }
    })
    .catch((err) => {
      process.env.REACT_APP_STATUS === "development" && console.log("removeToken error: ", err);
    });
};
