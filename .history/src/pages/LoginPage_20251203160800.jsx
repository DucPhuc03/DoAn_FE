import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { login as loginApi } from "../service/auth";
import { connectNotificationWebSocket } from "../service/notificationWebSocket";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    try {
      const res = await loginApi({
        username: formData.username,
        password: formData.password,
      });
      // Chuẩn hóa dữ liệu dựa theo response mẫu bạn cung cấp
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

      // Điều hướng về trang chủ
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-person-circle text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Đăng Nhập</h2>
                  <p className="text-muted">Chào mừng bạn quay trở lại!</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="username"
                      className="form-label fw-semibold"
                    >
                      Tên đăng nhập
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                    {errors.username && (
                      <div className="invalid-feedback d-block">
                        {errors.username}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Mật khẩu
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control border-start-0 ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="rememberMe"
                      >
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none text-primary"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  {errors.general && (
                    <div className="alert alert-danger py-2" role="alert">
                      {errors.general}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                    style={{ fontSize: "1.1rem" }}
                    disabled={submitting}
                  >
                    {submitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                  </button>

                  {/* Divider */}
                  <div className="text-center my-4">
                    <span className="text-muted">hoặc</span>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100 py-2 rounded-3"
                      >
                        <i className="bi bi-google me-2"></i>
                        Google
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-outline-primary w-100 py-2 rounded-3"
                      >
                        <i className="bi bi-facebook me-2"></i>
                        Facebook
                      </button>
                    </div>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <span className="text-muted">Chưa có tài khoản? </span>
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Đăng ký ngay
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
