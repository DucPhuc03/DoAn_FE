import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white border-bottom border-1 border-secondary-subtle">
      <div className="container-fluid">
        <div className="row align-items-center py-2">
          {/* Left side - Logo and Navigation */}
          <div className="col-auto d-flex align-items-center">
            {/* Logo */}
            <Link to="/" className="text-decoration-none me-4">
              <span className="fw-bold text-dark fs-4">LOGO</span>
            </Link>

            {/* Navigation Links */}
            <nav className="d-flex align-items-center">
              <Link
                to="/"
                className="text-decoration-none text-dark me-3 fw-normal"
              >
                Trang chủ
              </Link>
              <Link
                to="/explore"
                className="text-decoration-none text-dark fw-normal"
              >
                Khám phá
              </Link>
            </nav>
          </div>

          {/* Right side - Icons */}
          <div className="col-auto ms-auto d-flex align-items-center">
            <div className="d-flex align-items-center gap-3">
              {/* Plus Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                title="Thêm mới"
              >
                <i className="bi bi-plus fs-5"></i>
              </button>

              {/* Chat Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                title="Tin nhắn"
              >
                <i className="bi bi-chat-dots fs-5"></i>
              </button>

              {/* Calendar Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                title="Lịch"
              >
                <i className="bi bi-calendar3 fs-5"></i>
              </button>

              {/* Bell Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center position-relative"
                style={{ width: "40px", height: "40px" }}
                title="Thông báo"
              >
                <i className="bi bi-bell fs-5"></i>
                {/* Notification Badge */}
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  3
                </span>
              </button>

              {/* Profile Icon */}
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
                title="Hồ sơ"
              >
                <i className="bi bi-person-x fs-5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
