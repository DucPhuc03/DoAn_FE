import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MeetingsModal from "./MeetingsModal";
import {
  fetchAnnouncements,
  updateIsRead,
} from "../service/AnnouncementService";

const Header = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
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
          // Map API data to notification format
          const mappedNotifications = response.data.map((announcement) => ({
            id: announcement.id,
            type: announcement.type || "system",
            title: announcement.title || "Thông báo",
            message: announcement.content || announcement.message || "",
            time: formatTime(announcement.createdAt || announcement.created_at),
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

  // Format time to relative time (e.g., "5 phút trước")
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

  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId, e) => {
    // Find the notification
    const notification = notifications.find((n) => n.id === notificationId);

    // If already read, don't do anything
    if (!notification || notification.read) {
      return;
    }

    // Optimistic update - update UI immediately
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );

    // Call API to update read status
    try {
      const response = await updateIsRead(notificationId);
      if (response && response.code !== 1000) {
        // Revert on error
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notificationId ? { ...n, read: false } : n
          )
        );
        console.error("Failed to mark notification as read:", response);
      }
    } catch (error) {
      // Revert on error
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, read: false } : n
        )
      );
      console.error("Error marking notification as read:", error);
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
                <img
                  src="https://traodoido.s3.ap-southeast-1.amazonaws.com/logo.png"
                  alt="logo"
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                />
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

              {/* Calendar Icon with Meetings Dropdown */}
              <div className="position-relative" ref={meetingsRef}>
                <button
                  className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center hover-lift icon-btn position-relative"
                  style={{
                    width: "44px",
                    height: "44px",
                  }}
                  title="Lịch"
                  onClick={() => setShowMeetings(!showMeetings)}
                >
                  <i className="bi bi-calendar3 fs-5"></i>
                </button>

                {/* Meetings Dropdown */}
                {showMeetings && (
                  <MeetingsModal onClose={() => setShowMeetings(false)} />
                )}
              </div>

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
                      {isLoadingNotifications ? (
                        <div className="text-center text-muted py-4">
                          <div
                            className="spinner-border spinner-border-sm text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mb-0 mt-2">Đang tải thông báo...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <Link
                            key={notification.id}
                            to={notification.link}
                            className={`notification-item ${
                              !notification.read ? "unread" : ""
                            }`}
                            onClick={(e) => {
                              handleMarkAsRead(notification.id, e);
                              setShowNotifications(false);
                            }}
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
