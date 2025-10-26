import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Họ là bắt buộc";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Tên là bắt buộc";
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!agreeTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle register logic here
      console.log("Register data:", formData);
      alert("Đăng ký thành công!");
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

                {/* Register Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="firstName"
                        className="form-label fw-semibold"
                      >
                        Họ
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ${
                            errors.firstName ? "is-invalid" : ""
                          }`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Nhập họ"
                        />
                      </div>
                      {errors.firstName && (
                        <div className="invalid-feedback d-block">
                          {errors.firstName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="lastName"
                        className="form-label fw-semibold"
                      >
                        Tên
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control border-start-0 ${
                            errors.lastName ? "is-invalid" : ""
                          }`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Nhập tên"
                        />
                      </div>
                      {errors.lastName && (
                        <div className="invalid-feedback d-block">
                          {errors.lastName}
                        </div>
                      )}
                    </div>
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

                  {/* Phone Field */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Số điện thoại
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <input
                        type="tel"
                        className={`form-control border-start-0 ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    {errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
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

                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-muted"></i>
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control border-start-0 ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className={`form-check-input ${
                          errors.terms ? "is-invalid" : ""
                        }`}
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="agreeTerms"
                      >
                        Tôi đồng ý với{" "}
                        <Link
                          to="#"
                          className="text-primary text-decoration-none"
                        >
                          Điều khoản sử dụng
                        </Link>{" "}
                        và{" "}
                        <Link
                          to="#"
                          className="text-primary text-decoration-none"
                        >
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>
                    {errors.terms && (
                      <div className="invalid-feedback d-block">
                        {errors.terms}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Tạo Tài Khoản
                  </button>

                  {/* Divider */}
                  <div className="text-center my-4">
                    <span className="text-muted">hoặc</span>
                  </div>

                  {/* Social Register Buttons */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
