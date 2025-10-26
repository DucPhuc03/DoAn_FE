import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Đây là route cho trang chủ */}
          <Route path="/" element={<HomePage />} />
          {/* Route cho trang đăng nhập */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
