import React from "react";
import axios from "../../config/config-axios";
import { loginGoogle } from "../service/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
const GoogleCallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    console.log("Google OAuth code:", code);

    // Gửi code lên backend để verify
    const handleVerify = async () => {
      try {
        const res = await loginGoogle(code);
        // res.data = AuthResponse { accessToken, refreshToken, email, name, avatar }
        login(res.data);
        setStatus("Đăng nhập thành công, đang chuyển hướng...");
        // chuyển về trang home (hoặc /dashboard tuỳ bạn)
        navigate("/explore", { replace: true });
      } catch (e) {
        console.error(e);
        setStatus("Lỗi khi xác thực với server.");
      }
    };

    handleVerify();
  }, [location.search, login, navigate]);
  return <div>GoogleCallBack</div>;
};

export default GoogleCallBack;
