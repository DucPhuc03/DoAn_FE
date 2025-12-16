import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!phone) {
      setError("Số điện thoại là bắt buộc");
      return;
    }

    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    // Tạm thời fake: không gọi API, chỉ hiển thị thông báo
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage(
        "Nếu số điện thoại tồn tại trong hệ thống, chúng tôi đã gửi mã SMS để đặt lại mật khẩu."
      );
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
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
                      className="bi bi-shield-lock text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Quên mật khẩu</h2>
                  <p className="text-muted">
                    Nhập email của bạn để nhận mã đặt lại mật khẩu.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
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
                        id="phone"
                        name="phone"
                        className={`form-control border-start-0 ${
                          error ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập email của bạn"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (error) setError("");
                        }}
                      />
                    </div>
                    {error && (
                      <div className="invalid-feedback d-block">{error}</div>
                    )}
                  </div>

                  {successMessage && (
                    <div className="alert alert-success py-2" role="alert">
                      {successMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                    style={{ fontSize: "1.05rem" }}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Đang gửi..."
                      : "Gửi hướng dẫn đặt lại mật khẩu"}
                  </button>

                  <div className="text-center mt-2">
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold text-primary"
                    >
                      Quay lại đăng nhập
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

export default ForgotPasswordPage;
