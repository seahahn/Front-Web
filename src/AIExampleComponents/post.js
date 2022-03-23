import { targetURL, httpConfig, DL_API_URL, URLS_DL_API } from "MLML/MLComponents/CompoOptions/networkConfigs";

export const getPosts = async (div) => {
  const targetUrl = targetURL(DL_API_URL.concat(URLS_DL_API.posts, div));
  const response = await fetch(targetUrl, httpConfig(null, "GET"));
  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export const deletePost = async (postId) => {
  if (window.confirm("정말로 삭제하시겠습니까?")) {
    const targetUrl = targetURL(DL_API_URL.concat(URLS_DL_API.posts, postId));
    const response = await fetch(targetUrl, httpConfig(null, "DELETE"));
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }
};
