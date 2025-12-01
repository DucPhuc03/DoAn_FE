import React, { useState, useEffect } from "react";
import { getMeetingUser } from "../service/meeting/MeetingService";

const MeetingsModal = ({ onClose }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMeetingUser();

        // Handle API response structure
        let meetingsData = [];
        if (response?.data) {
          meetingsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          meetingsData = response;
        }

        setMeetings(meetingsData);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError("Không thể tải danh sách lịch hẹn");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="notifications-dropdown" style={{ width: "420px" }}>
      <div className="notifications-header">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-calendar3 me-2"></i>
          Lịch hẹn
        </h6>
        {!loading && !error && (
          <span className="badge bg-primary ms-2">
            {meetings.length} cuộc hẹn
          </span>
        )}
      </div>
      <div className="notifications-list">
        {loading ? (
          <div className="text-center text-muted py-4">
            <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
            <p className="mb-0">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-exclamation-triangle fs-3 d-block mb-2 text-warning"></i>
            <p className="mb-0">{error}</p>
          </div>
        ) : meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="notification-item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
              }}
            >
              <div className="d-flex align-items-start w-100 gap-3">
                {/* Avatar */}
                <div
                  className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "45px", height: "45px" }}
                >
                  {meeting.avatarPartner ? (
                    <img
                      src={meeting.avatarPartner}
                      alt={meeting.namePartner || "Partner"}
                      className="rounded-circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.nextElementSibling;
                        if (fallback) {
                          fallback.style.display = "block";
                        }
                      }}
                    />
                  ) : null}
                  <i
                    className="bi bi-person-fill text-white"
                    style={{
                      display: meeting.avatarPartner ? "none" : "block",
                    }}
                  ></i>
                </div>

                {/* Content */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <strong className="notification-title">
                      {meeting.namePartner || "Người dùng"}
                    </strong>
                    <div
                      className="badge bg-info text-dark"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {meeting.time}
                    </div>
                  </div>

                  {/* Title Trade */}
                  {meeting.titleTrade && (
                    <div className="mb-2">
                      <i className="bi bi-box-seam me-1 text-primary"></i>
                      <small className="text-dark" style={{ fontSize: "0.85rem" }}>
                        {meeting.titleTrade}
                      </small>
                    </div>
                  )}

                  {/* Date */}
                  {meeting.meetingDate && (
                    <div className="mb-2">
                      <i className="bi bi-calendar-event me-1 text-primary"></i>
                      <small className="text-muted">
                        {formatDate(meeting.meetingDate)}
                      </small>
                    </div>
                  )}

                  {/* Location */}
                  {meeting.location && (
                    <div className="mb-2">
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      <small
                        className="text-dark"
                        style={{
                          fontSize: "0.85rem",
                          lineHeight: "1.4",
                          display: "block",
                        }}
                      >
                        {meeting.location}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-4">
            <i className="bi bi-calendar-x fs-3 d-block mb-2"></i>
            <p className="mb-0">Chưa có cuộc hẹn nào</p>
          </div>
        )}
      </div>
      {!loading && !error && meetings.length > 0 && (
        <div className="notifications-footer">
          <button
            className="btn btn-link text-decoration-none text-primary fw-semibold p-0"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingsModal;


