// http.js
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000", // 可加可不加 `/`
  timeout: 5000,
});

// 请求拦截器（可选）
http.interceptors.request.use((config) => {
  // 可在这里加 token
  return config;
});

// 响应拦截器（可选）
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("请求出错:", error);
    return Promise.reject(error);
  }
);

export default http;