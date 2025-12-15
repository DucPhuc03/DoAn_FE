import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import MeetingsModal from "./MeetingsModal";
import {
  fetchAnnouncements,
  updateIsRead,
} from "../service/AnnouncementService";
import "../css/Header.css";

const Header = () => {
  const location = useLocation();
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

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

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
      return date.toLocaleDateString("vi-VN");
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

  const handleMarkAsRead = async (notificationId, e) => {
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification || notification.read) {
      return;
    }

    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );

    try {
      const response = await updateIsRead(notificationId);
      if (response && response.code !== 1000) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notificationId ? { ...n, read: false } : n
          )
        );
        console.error("Failed to mark notification as read:", response);
      }
    } catch (error) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, read: false } : n
        )
      );
      console.error("Error marking notification as read:", error);
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
                src="https://traodoido.s3.ap-southeast-1.amazonaws.com/logo.png"
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
                          notifications.map((notification) => (
                            <Link
                              key={notification.id}
                              to={notification.link}
                              className={`header-notification-item ${
                                !notification.read ? "unread" : ""
                              }`}
                              onClick={(e) => {
                                handleMarkAsRead(notification.id, e);
                                setShowNotifications(false);
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
                            </Link>
                          ))
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
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
                            borderRadius: "50%",
                            color: "#fff",
                            fontSize: "0.9rem",
                            fontWeight: 600,
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
