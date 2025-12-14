import axios from "axios";

const baseURL = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL,
  // QUAN TRỌNG: Cho phép gửi và nhận cookie tự động
  withCredentials: true,
});

// Bạn có thể xóa bỏ Interceptor cũ vì trình duyệt sẽ tự đính kèm cookie
// Nhưng nếu Backend của bạn vẫn yêu cầu header "Authorization: Bearer ...",
// bạn chỉ cần giữ lại interceptor nếu bạn vẫn gửi token qua Body lúc login.
// Tuy nhiên, với HttpOnly Cookie, thông thường ta sẽ xác thực bằng Cookie trực tiếp ở Backend.

export default axiosInstance;
