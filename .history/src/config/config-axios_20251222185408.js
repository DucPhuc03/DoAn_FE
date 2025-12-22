import axios from "axios";
import Cookies from "js-cookie";

// Dev: dùng proxy "/api" để tránh CORS; Prod: dùng VITE_BASE_URL
const baseURL = import.meta?.env?.DEV
  ? "/api"
  : import.meta?.env?.VITE_BASE_URL || "http://13.214.139.27:8080";

// Tạo một instance của axios
const axiosInstance = axios.create({ baseURL });

// Thêm Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token mới nhất từ cookie cho mỗi request
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi gửi request
    return Promise.reject(error);
  }
);

export default axiosInstance;
