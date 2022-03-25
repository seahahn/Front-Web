import { targetURL, httpConfig, USER_AUTH_URL, URLS_USER_AUTH } from "MLML/MLComponents/CompoOptions/networkConfigs";

export const refreshToken = async () => {
  console.log("refresh token");
  const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.refresh_jwt));
  await fetch(targetUrl, httpConfig(null, "GET"))
    .then((res) => res.json())
    .then((res) => {
      if (res.result) {
        console.log("refreshToken success", res.result);
      } else {
        console.log("refreshToken error: ", res.message);
      }
    })
    .catch((err) => {
      console.log("refreshToken error: ", err);
    });
};

export const removeToken = async () => {
  console.log("remove token");
  const targetUrl = targetURL(USER_AUTH_URL.concat(URLS_USER_AUTH.remove_jwt));
  await fetch(targetUrl, httpConfig(null, "GET"))
    .then((res) => res.json())
    .then((res) => {
      if (res.result) {
        console.log("removeToken success", res.result);
      } else {
        console.log("removeToken error: ", res.message);
      }
    })
    .catch((err) => {
      console.log("removeToken error: ", err);
    });
};
