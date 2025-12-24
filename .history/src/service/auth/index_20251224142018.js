import axios from "../../config/config-axios";

// Đăng nhập
export async function login(payload) {
  // payload: { email, password } hoặc { username, password }
  const { data } = await axios.post("/api/auth/login", payload);
  return data;
}

export async function loginGoogle(code) {
  const { data } = await axios.post(`/api/auth/login-google?code=${code}`);
  return data;
}

// Gửi OTP xác thực email khi đăng ký
// payload: { email }
export async function sendRegisterOtp(email) {
  const { data } = await axios.post(`/api/auth/send-email-otp?email=${email}`);
  return data;
}

// Xác thực OTP email khi đăng ký
// payload: { email, otp }
export async function verifyRegisterOtp(email, otp) {
  const { data } = await axios.post(
    `/api/auth/verify-email-otp?email=${email}&otp=${otp}`
  );
  return data;
}

// Đăng ký (chỉ gọi sau khi verify OTP thành công)
export async function register(payload) {
  // payload: { name, email, password, ... }
  const { data } = await axios.post("/api/auth/register", payload);
  return data;
}
export async function resetPassword(email, password) {
  // payload: { name, email, password, ... }
  const { data } = await axios.post("/api/auth//reset-password", {
    email: email,
    password: password,
  });
  return data;
}
