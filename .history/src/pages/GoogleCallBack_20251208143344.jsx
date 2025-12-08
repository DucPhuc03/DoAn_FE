import React from "react";

import { loginGoogle } from "../service/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const GoogleCallBack = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    console.log("Google OAuth code:", code);

    // Gửi code lên backend để verify
    const handleVerify = async () => {
      try {
        const res = await loginGoogle(code);
        // res.data = AuthResponse { accessToken, refreshToken, email, name, avatar }

        // chuyển về trang home (hoặc /dashboard tuỳ bạn)
        navigate("/explore");
      } catch (e) {
        console.error(e);
      }
    };

    handleVerify();
  }, [location.search, navigate]);
  return <div>GoogleCallBack</div>;
};

export default GoogleCallBack;
