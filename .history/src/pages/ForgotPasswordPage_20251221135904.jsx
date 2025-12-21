import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRegisterOtp, verifyRegisterOtp } from "../service/auth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState(0); // giây, 300 = 5 phút
  const navigate = useNavigate();

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
    setError("");
    setOtpError("");
    setOtpTimeLeft(0);
    setShowOtpModal(true);
    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Gọi API gửi OTP qua email và mở popup nhập mã
    setSubmitting(true);
    try {
      await sendRegisterOtp(email);

      setOtpTimeLeft(300); // 5 phút
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Có lỗi xảy ra khi gửi mã. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
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
      const res = await verifyRegisterOtp(email, otpCode.trim());
      console.log(res);
      setShowOtpModal(false);
      res?.data === true
        ? navigate("/reset-password", { state: { email } })
        : alert("OTP không đúng");
    } catch (err) {
      setOtpError(
        err?.response?.data?.message ||
          "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại."
      );
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
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control border-start-0 ${
                          error ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                      />
                    </div>
                    {error && (
                      <div className="invalid-feedback d-block">{error}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                    style={{ fontSize: "1.05rem" }}
                    disabled={submitting}
                  >
                    {submitting ? "Đang gửi..." : "Gửi mã đặt lại mật khẩu"}
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
                        <h5 className="mb-0 fw-bold text-dark">Xác thực OTP</h5>
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
                        className="text-muted mb-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Chúng tôi đã gửi mã OTP tới email{" "}
                        <span className="fw-semibold">{email}</span>. Vui lòng
                        nhập mã để tiếp tục đặt lại mật khẩu.
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
                              await sendRegisterOtp(email);
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
                            onClick={handleVerifyOtp}
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

export default ForgotPasswordPage;
