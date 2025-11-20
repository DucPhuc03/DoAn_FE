import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const userId = JSON.parse(localStorage.getItem("user")).id;

  return (
    <header className="bg-white border-bottom border-1 border-light shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <div className="row align-items-center py-3">
          {/* Left side - Logo and Navigation */}
          <div className="col-auto d-flex align-items-center">
            {/* Logo */}
            <Link to="/" className="text-decoration-none me-5">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-3 p-2 me-2">
                  <i className="bi bi-arrow-repeat text-white fs-5"></i>
                </div>
                <span className="fw-bold text-dark fs-4">TraoDoiDo</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="d-flex align-items-center">
              <Link
                to="/"
                className="text-decoration-none text-dark me-4 fw-medium px-3 py-2 rounded-3 hover-bg-light transition-all header-nav-link"
              >
                Trang chủ
              </Link>
              <Link
                to="/explore"
                className="text-decoration-none text-dark fw-medium px-3 py-2 rounded-3 hover-bg-light transition-all header-nav-link"
              >
                Khám phá
              </Link>
            </nav>
          </div>

          {/* Right side - Icons */}
          <div className="col-auto ms-auto d-flex align-items-center">
            <div className="d-flex align-items-center gap-4">
              {/* Plus Icon */}
              <Link
                to="/new-post"
                className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Đăng bài mới"
              >
                <i className="bi bi-plus fs-5"></i>
              </Link>

              {/* Chat Icon */}
              <Link
                to="/chat"
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Tin nhắn"
              >
                <i className="bi bi-chat-dots fs-5"></i>
              </Link>

              {/* Calendar Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Lịch"
              >
                <i className="bi bi-calendar3 fs-5"></i>
              </button>

              {/* Bell Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center position-relative hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Thông báo"
              >
                <i className="bi bi-bell fs-5"></i>
                {/* Notification Badge */}
                <span
                  className="position-absolute badge rounded-pill bg-danger notification-badge"
                  style={{
                    top: "-2px",
                    right: "-2px",
                    fontSize: "0.6rem",
                    minWidth: "16px",
                    height: "16px",
                    lineHeight: "14px",
                    padding: "0 4px",
                    zIndex: 10,
                  }}
                >
                  3
                </span>
              </button>

              {/* Profile Icon */}
              <Link
                to="/profile/2"
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Hồ sơ"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
