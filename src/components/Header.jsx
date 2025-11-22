import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Fake notification data
  const [notifications] = useState([
    {
      id: 1,
      type: "exchange",
      title: "Yêu cầu trao đổi mới",
      message: "Nguyễn Văn A muốn trao đổi với bạn về sản phẩm iPhone 13 Pro Max",
      time: "5 phút trước",
      read: false,
      link: "/chat",
    },
    {
      id: 2,
      type: "comment",
      title: "Bình luận mới",
      message: "Trần Thị B đã bình luận trên bài đăng của bạn",
      time: "1 giờ trước",
      read: false,
      link: "/post/1",
    },
    {
      id: 3,
      type: "like",
      title: "Yêu thích bài đăng",
      message: "Lê Văn C đã thích bài đăng của bạn",
      time: "2 giờ trước",
      read: true,
      link: "/post/2",
    },
    {
      id: 4,
      type: "exchange",
      title: "Trao đổi được chấp nhận",
      message: "Phạm Thị D đã chấp nhận yêu cầu trao đổi của bạn",
      time: "3 giờ trước",
      read: true,
      link: "/chat",
    },
    {
      id: 5,
      type: "system",
      title: "Thông báo hệ thống",
      message: "Bài đăng của bạn đã được duyệt và hiển thị công khai",
      time: "1 ngày trước",
      read: true,
      link: "/post/3",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "exchange":
        return "bi-arrow-repeat";
      case "comment":
        return "bi-chat-dots";
      case "like":
        return "bi-heart";
      case "system":
        return "bi-bell";
      default:
        return "bi-bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "exchange":
        return "#0d6efd";
      case "comment":
        return "#198754";
      case "like":
        return "#dc3545";
      case "system":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

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

              {/* Bell Icon with Notifications Dropdown */}
              <div className="position-relative" ref={notificationRef}>
              <button
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center position-relative hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Thông báo"
                  onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell fs-5"></i>
                {/* Notification Badge */}
                  {unreadCount > 0 && (
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
                      {unreadCount}
                </span>
                  )}
              </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h6 className="mb-0 fw-bold">Thông báo</h6>
                      {unreadCount > 0 && (
                        <span className="badge bg-primary ms-2">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={notification.link}
                            className={`notification-item ${
                              !notification.read ? "unread" : ""
                            }`}
                            onClick={() => setShowNotifications(false)}
                          >
                            <div
                              className="notification-icon"
                              style={{
                                backgroundColor: `${getNotificationColor(
                                  notification.type
                                )}20`,
                                color: getNotificationColor(notification.type),
                              }}
                            >
                              <i
                                className={`bi ${getNotificationIcon(
                                  notification.type
                                )}`}
                              ></i>
                            </div>
                            <div className="notification-content">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <strong className="notification-title">
                                  {notification.title}
                                </strong>
                                {!notification.read && (
                                  <span className="unread-dot"></span>
                                )}
                              </div>
                              <p className="notification-message mb-1">
                                {notification.message}
                              </p>
                              <small className="notification-time text-muted">
                                {notification.time}
                              </small>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-bell-slash fs-3 d-block mb-2"></i>
                          <p className="mb-0">Chưa có thông báo nào</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="notifications-footer">
                        <Link
                          to="/notifications"
                          className="text-decoration-none text-primary fw-semibold"
                          onClick={() => setShowNotifications(false)}
                        >
                          Xem tất cả thông báo
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Icon */}
              {userId && (
              <Link
                to={`/profile/${userId}`}
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn"
                style={{
                  width: "44px",
                  height: "44px",
                }}
                title="Hồ sơ"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
