import axios from "axios";
import Cookies from "js-cookie";
// Lấy token từ localStorage hoặc cookie
const accessToken = Cookies.get("access_token");

// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

// Thêm Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Nếu token tồn tại, thêm nó vào header
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
