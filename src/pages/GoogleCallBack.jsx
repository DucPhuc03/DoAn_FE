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

    const handleVerify = async () => {
      try {
        const res = await loginGoogle(code);

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

        // điều hướng
        if (user && user.role === "ADMIN") {
          navigate("/admin/pending_management");
          return;
        }

        connectNotificationWebSocket();
        navigate("/explore");
      } catch (e) {
        console.error(e);
      }
    };

    handleVerify();
  }, [location.search, navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        className="spinner"
        style={{
          width: "50px",
          height: "50px",
          border: "6px solid #e8e8e8",
          borderTop: "6px solid #4285F4",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <h3 style={{ color: "#555", fontWeight: 500 }}>
        Đang đăng nhập bằng Google...
      </h3>

      <p style={{ fontSize: "14px", color: "#777" }}>
        Vui lòng chờ trong giây lát.
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleCallBack;
