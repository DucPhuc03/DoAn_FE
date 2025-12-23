import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register as registerApi,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "../service/auth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState(0); // giây, 300 = 5 phút
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

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Tên hiển thị là bắt buộc";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Đếm ngược thời gian OTP
  useEffect(() => {
    let timer;
    if (showOtpModal && otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpModal, otpTimeLeft]);

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpCode("");
    setOtpError("");
    setOtpTimeLeft(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    setOtpError("");
    setOtpTimeLeft(0);
    setShowOtpModal(true);
    try {
      // Gọi API gửi OTP email
      await sendRegisterOtp(formData.email);

      setOtpTimeLeft(300); // 5 phút
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Không thể gửi mã xác thực. Vui lòng thử lại.";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    if (!otpCode.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }

    if (otpTimeLeft <= 0) {
      setOtpError("Mã OTP đã hết hạn, vui lòng gửi lại mã mới.");
      return;
    }

    setOtpSubmitting(true);
    setOtpError("");

    try {
      // Xác thực OTP qua API
      await verifyRegisterOtp(formData.email, otpCode.trim());

      // OTP hợp lệ -> gọi API đăng ký thật
      await registerApi({
        username: formData.username,
        fullName: formData.displayName,
        email: formData.email,
        password: formData.password,
      });

      setShowOtpModal(false);
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.";
      setOtpError(message);
    } finally {
      setOtpSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-person-plus-circle text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Đăng Ký</h2>
                  <p className="text-muted">Tạo tài khoản mới của bạn</p>
                </div>

                {/* Register Form: username, email, password */}
                <form onSubmit={handleSubmit}>
                  {/* Username */}
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

                  {/* Display Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="displayName"
                      className="form-label fw-semibold"
                    >
                      Tên hiển thị
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-badge text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ${
                          errors.displayName ? "is-invalid" : ""
                        }`}
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Nhập tên hiển thị"
                      />
                    </div>
                    {errors.displayName && (
                      <div className="invalid-feedback d-block">
                        {errors.displayName}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password */}

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

                  {errors.general && (
                    <div className="alert alert-danger py-2" role="alert">
                      {errors.general}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                    style={{ fontSize: "1.1rem" }}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Tạo Tài Khoản"}
                  </button>

                  {/* Divider */}
                  <div className="text-center my-4">
                    <span className="text-muted">hoặc</span>
                  </div>

                  {/* Social section removed as yêu cầu tối giản */}

                  {/* Login Link */}
                  <div className="text-center">
                    <span className="text-muted">Đã có tài khoản? </span>
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Đăng nhập ngay
                    </Link>
                  </div>
                </form>

                {/* OTP Modal */}
                {showOtpModal && (
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "rgba(15,23,42,0.45)",
                      zIndex: 1050,
                    }}
                  >
                    <div
                      className="bg-white rounded-4 shadow-lg p-4"
                      style={{ width: "100%", maxWidth: 420 }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 fw-bold text-dark">
                          Xác thực email
                        </h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={handleCloseOtpModal}
                          disabled={otpSubmitting}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </div>

                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Chúng tôi đã gửi mã xác thực (OTP) tới email{" "}
                        <span className="fw-semibold">{formData.email}</span>.
                        Vui lòng kiểm tra hộp thư và nhập mã bên dưới để hoàn
                        tất đăng ký.
                      </p>

                      {otpTimeLeft > 0 ? (
                        <p
                          className="text-danger fw-semibold mb-3"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Mã sẽ hết hạn sau{" "}
                          {String(Math.floor(otpTimeLeft / 60)).padStart(
                            2,
                            "0"
                          )}
                          :{String(otpTimeLeft % 60).padStart(2, "0")}
                        </p>
                      ) : (
                        <p
                          className="text-danger fw-semibold mb-3"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Mã OTP đã hết hạn, vui lòng gửi lại mã mới.
                        </p>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Mã OTP</label>
                        <input
                          type="text"
                          className={`form-control text-center fw-bold ${
                            otpError ? "is-invalid" : ""
                          }`}
                          placeholder="Nhập mã OTP"
                          value={otpCode}
                          onChange={(e) => {
                            setOtpCode(e.target.value);
                            if (otpError) setOtpError("");
                          }}
                        />
                        {otpError && (
                          <div className="invalid-feedback d-block">
                            {otpError}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          type="button"
                          className="btn btn-link p-0"
                          disabled={otpSubmitting}
                          onClick={async () => {
                            try {
                              setOtpError("");
                              setOtpSubmitting(true);
                              await sendRegisterOtp(formData.email);
                              setOtpTimeLeft(300);
                            } catch (err) {
                              setOtpError(
                                err?.response?.data?.message ||
                                  "Không thể gửi lại mã. Vui lòng thử lại."
                              );
                            } finally {
                              setOtpSubmitting(false);
                            }
                          }}
                        >
                          Gửi lại mã
                        </button>

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleCloseOtpModal}
                            disabled={otpSubmitting}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleVerifyOtpAndRegister}
                            disabled={otpSubmitting || otpTimeLeft <= 0}
                          >
                            {otpSubmitting ? "Đang xác thực..." : "Xác nhận"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
