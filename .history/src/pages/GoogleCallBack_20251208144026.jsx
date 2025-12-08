import React from "react";
import Cookies from "js-cookie";
import { connectNotificationWebSocket } from "../service/notificationWebSocket";
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
        const token =
          res?.accessToken ||
          res?.token ||
          res?.data?.accessToken ||
          res?.data?.token;
        const user = res?.user || res?.data?.user;
        if (token) {
          Cookies.set("access_token", token, { expires: 7 });
        }
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        if (user && user.role === "ADMIN") {
          navigate("/admin/pending_management");
          return;
        }
        connectNotificationWebSocket();
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
