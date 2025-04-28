// http.js
import axios from "axios";
import { store } from "../redux/store"
import { default_loading } from "../redux/reducers/LoadingReducer"; //导入

//加了以后用不了，先注释掉
// const instance = axios.create({
//   baseURL: "http://localhost:3000", // 建议加上 baseURL
//   timeout: 5000,
// });


//loading失败，以后再改
const instance = axios.create();
instance.interceptors.request.use(function (config) {
 // 在发送请求前设置 loading 为 true
    store.dispatch(default_loading(true));
    return config;
}, function (error) {
   // 发生请求错误，也设置 loading 为 false
    store.dispatch(default_loading(false));
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // 接收到响应，关闭 loading
    store.dispatch(default_loading(false));
    return response;
}, function (error) {
   // 响应错误，关闭 loading
    store.dispatch(default_loading(false));
    return Promise.reject(error);
});
  export default instance; // 导出 axios 实例
// 这样在其他文件中就可以直接使用 import axios from '../util/http' 来使用这个实例了