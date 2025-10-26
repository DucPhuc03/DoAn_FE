import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Đây là route cho trang chủ */}
          <Route path="/" element={<HomePage />} />
          {/* Route cho trang đăng nhập */}
          <Route path="/login" element={<LoginPage />} />
          {/* Route cho trang đăng ký */}
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
