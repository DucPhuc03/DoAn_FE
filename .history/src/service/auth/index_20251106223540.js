import axios from "../../config/config-axios";

// Đăng nhập
export async function login(payload) {
  // payload: { email, password } hoặc { username, password }
  const { data } = await axios.post("/api/auth/login", payload);
  return data;
}

// Đăng ký
export async function register(payload) {
  // payload: { name, email, password, ... }
  const { data } = await axios.post("/api/auth/register", payload);
  return data;
}
