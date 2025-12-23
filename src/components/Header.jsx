import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MeetingsModal from "./MeetingsModal";
import {
  fetchAnnouncements,
  updateIsRead,
} from "../service/AnnouncementService";
import "../css/Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userAvatar = user?.avatarUrl;
  const userName = user?.name || user?.username;
  const isHomePage = location.pathname === "/";
  const isLoggedIn = !!userId;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const notificationRef = useRef(null);
  const meetingsRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch announcements from API
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoadingNotifications(true);
        const response = await fetchAnnouncements();

        if (response && response.code === 1000 && response.data) {
          const mappedNotifications = response.data.map((announcement) => ({
            id: announcement.id,
            type: announcement.type || "system",
            title: announcement.title || "Thông báo",
            message: announcement.content || announcement.message || "",
            time: formatTime(announcement.time || announcement.time),
            read: announcement.read || announcement.isRead || false,
            link: announcement.link || announcement.url || "#",
            conversationId:
              announcement.conversationId ||
              announcement.conversation_id ||
              null,
          }));
          setNotifications(mappedNotifications);
        } else {
          console.error("Failed to fetch announcements:", response);
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setNotifications([]);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    loadAnnouncements();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return "";

    try {
      // Xử lý định dạng "2025-12-21 11:42:23.934853"
      // Loại bỏ microseconds nếu có và chuyển thành định dạng ISO
      let formattedDateString = dateString;

      // Nếu có format với microseconds, loại bỏ phần microseconds
      if (dateString.includes(".") && dateString.match(/\.\d{6}/)) {
        formattedDateString = formattedDateString.replace(/\.\d{6}$/, "");
      }

      // Chuyển đổi "YYYY-MM-DD HH:mm:ss" thành "YYYY-MM-DDTHH:mm:ss" (ISO format)
      if (
        formattedDateString.includes(" ") &&
        !formattedDateString.includes("T")
      ) {
        formattedDateString = formattedDateString.replace(" ", "T");
      }

      // Thêm 'Z' để đánh dấu đây là UTC time, sau đó JavaScript sẽ tự chuyển sang local time
      const date = new Date(formattedDateString + "Z");
      const now = new Date();

      // Kiểm tra nếu date không hợp lệ
      if (isNaN(date.getTime())) {
        return dateString; // Trả về nguyên bản nếu không parse được
      }

      // Tính chênh lệch thời gian (đảm bảo là số dương)
      const diffInSeconds = Math.floor((now - date) / 1000);

      // Nếu thời gian trong tương lai (do timezone), xử lý đặc biệt
      if (diffInSeconds < 0) {
        return "Vừa xong";
      }

      if (diffInSeconds < 60) {
        return "Vừa xong";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
      } else {
        // Format ngày tháng năm theo định dạng Việt Nam
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      console.error("Error formatting time:", error);
      return dateString; // Trả về nguyên bản nếu có lỗi
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (meetingsRef.current && !meetingsRef.current.contains(event.target)) {
        setShowMeetings(false);
      }
    };

    if (showNotifications || showMeetings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showMeetings]);

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

  const handleMarkAsRead = async (notificationId) => {
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification || notification.read) {
      return true; // Already read or not found, allow navigation
    }

    // Optimistic update
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );

    try {
      const response = await updateIsRead(notificationId);
      if (response && response.code !== 1000) {
        // Revert on failure
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notificationId ? { ...n, read: false } : n
          )
        );
        console.error("Failed to mark notification as read:", response);
        return false;
      }
      return true;
    } catch (error) {
      // Revert on error
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, read: false } : n
        )
      );
      console.error("Error marking notification as read:", error);
      return false;
    }
  };

  return (
    <header className="header-main">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between py-3">
          {/* Left side - Logo and Navigation */}
          <div className="d-flex align-items-center gap-5">
            {/* Logo */}
            <Link to="/" className="header-logo-container">
              <img
                src="https://traodoido.s3.ap-southeast-1.amazonaws.com/logo2.jpg"
                alt="logo"
                className="header-logo"
              />
              <span className="header-logo-text">TraoĐổiĐồ</span>
            </Link>

            {/* Navigation Links */}
            <nav className="d-flex align-items-center gap-2">
              <Link to="/" className="header-nav-link">
                <i className="bi bi-house-door me-2"></i>
                Trang chủ
              </Link>
              <Link to="/explore" className="header-nav-link">
                <i className="bi bi-compass me-2"></i>
                Khám phá
              </Link>
            </nav>
          </div>

          {/* Right side - Icons or Login/Register buttons */}
          <div className="d-flex align-items-center gap-3">
            {/* If on homepage and not logged in, show login/register buttons */}
            {isHomePage && !isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#2563eb";
                  }}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    border: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(37, 99, 235, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                {/* Plus Icon - Create Post */}
                <Link
                  to="/new-post"
                  className="header-icon-btn header-icon-btn-primary"
                  title="Đăng bài mới"
                >
                  <i
                    className="bi bi-plus-lg"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                </Link>

                {/* Chat Icon */}
                <Link
                  to="/chat"
                  className="header-icon-btn header-icon-btn-default"
                  title="Tin nhắn"
                >
                  <i
                    className="bi bi-chat-dots"
                    style={{ fontSize: "1.1rem" }}
                  ></i>
                </Link>

                {/* Calendar Icon with Meetings Dropdown */}
                <div className="position-relative" ref={meetingsRef}>
                  <button
                    className="header-icon-btn header-icon-btn-default"
                    title="Lịch hẹn"
                    onClick={() => setShowMeetings(!showMeetings)}
                  >
                    <i
                      className="bi bi-calendar-event"
                      style={{ fontSize: "1.1rem" }}
                    ></i>
                  </button>

                  {showMeetings && (
                    <MeetingsModal onClose={() => setShowMeetings(false)} />
                  )}
                </div>

                {/* Bell Icon with Notifications Dropdown */}
                <div className="position-relative" ref={notificationRef}>
                  <button
                    className="header-icon-btn header-icon-btn-default"
                    title="Thông báo"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i
                      className="bi bi-bell"
                      style={{ fontSize: "1.1rem" }}
                    ></i>
                    {unreadCount > 0 && (
                      <span className="header-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="header-notifications-dropdown">
                      <div className="header-notifications-header">
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-bell-fill"></i>
                          <h6 className="mb-0 fw-bold">Thông báo</h6>
                        </div>
                        {unreadCount > 0 && (
                          <span className="header-notifications-badge">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      <div className="header-notifications-list">
                        {isLoadingNotifications ? (
                          <div className="text-center py-5">
                            <div className="d-flex justify-content-center gap-2 mb-3">
                              <div className="header-loading-dot"></div>
                              <div className="header-loading-dot"></div>
                              <div className="header-loading-dot"></div>
                            </div>
                            <p className="mb-0 text-muted">
                              Đang tải thông báo...
                            </p>
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notification) => {
                            // Nếu là thông báo trao đổi và có conversationId, điều hướng đến chat
                            const isExchangeNotification =
                              notification.type === "exchange" &&
                              notification.conversationId;
                            const targetLink = isExchangeNotification
                              ? `/chat?conversationId=${notification.conversationId}`
                              : notification.link;

                            return (
                              <div
                                key={notification.id}
                                className={`header-notification-item ${
                                  !notification.read ? "unread" : ""
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  setShowNotifications(false);
                                  await handleMarkAsRead(notification.id);
                                  navigate(targetLink);
                                }}
                              >
                                <div
                                  className="header-notification-icon"
                                  style={{
                                    backgroundColor: `${getNotificationColor(
                                      notification.type
                                    )}15`,
                                    color: getNotificationColor(
                                      notification.type
                                    ),
                                  }}
                                >
                                  <i
                                    className={`bi ${getNotificationIcon(
                                      notification.type
                                    )}`}
                                  ></i>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <strong className="header-notification-title">
                                      {notification.title}
                                    </strong>
                                    {!notification.read && (
                                      <span className="header-unread-dot"></span>
                                    )}
                                  </div>
                                  <p className="header-notification-message">
                                    {notification.message}
                                  </p>
                                  <small className="header-notification-time">
                                    {notification.time}
                                  </small>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-5">
                            <div className="header-empty-icon">
                              <i className="bi bi-bell-slash"></i>
                            </div>
                            <p className="mb-0 text-muted">
                              Chưa có thông báo nào
                            </p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="header-notifications-footer">
                          <button
                            className="btn btn-link text-decoration-none p-0 header-close-btn"
                            onClick={() => setShowNotifications(false)}
                          >
                            Đóng thông báo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Icon */}
                {userId && (
                  <Link
                    to={`/profile/${userId}`}
                    className="header-icon-btn profile-avatar-btn"
                    title="Hồ sơ của bạn"
                  >
                    <div className="profile-avatar-inner">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName || "User"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <div
                          className="profile-avatar-initial"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            color: "#fff",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}
                        >
                          {userName ? (
                            userName.charAt(0).toUpperCase()
                          ) : (
                            <i
                              className="bi bi-person-fill"
                              style={{ fontSize: "1.1rem" }}
                            ></i>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
