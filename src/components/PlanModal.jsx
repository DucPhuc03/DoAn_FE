import React, { useState, useEffect } from "react";
import { createMeeting } from "../service/MeetingService";
import ModelMap from "./ModelMap";

const PlanModal = ({ onClose, conversation, onSuccess, stompClient, conversationId, meeting }) => {
  // Determine if we're in edit mode
  const isEditMode = !!meeting;
  
  // Extract date and time from meetingDate if editing
  const getInitialDate = () => {
    if (meeting?.meetingDate) {
      const date = new Date(meeting.meetingDate);
      return date.toISOString().split("T")[0];
    }
    return "";
  };
  
  const getInitialTime = () => {
    if (meeting?.time) {
      return meeting.time;
    }
    if (meeting?.meetingDate) {
      const date = new Date(meeting.meetingDate);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return "";
  };

  const [formData, setFormData] = useState({
    date: getInitialDate(),
    time: getInitialTime(),
    location: meeting?.location || "",
    note: meeting?.note || "",
    tradeId: conversation?.tradeId || null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null,
  });

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const API_KEY = "fs7bNKZ4N2c0iyuXllwJQKL7CelQGDDDCvtaExUd";
      const response = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "";
    } catch (error) {
      console.error("Error getting address:", error);
      return "";
    }
  };

  const handleLocationChange = async ({ lat, lng }) => {
    setLocationCoords({ lat, lng });
    // Get address from coordinates
    const address = await getAddressFromCoords(lat, lng);
    if (address) {
      setFormData((prev) => ({ ...prev, location: address }));
      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: "" }));
      }
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.date) newErrors.date = "Vui lòng chọn ngày";
    if (!formData.time) newErrors.time = "Vui lòng chọn giờ";
    if (!formData.location.trim())
      newErrors.location = "Vui lòng nhập địa điểm";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      // Prepare data according to API format
      const meetingData = {
        location: formData.location.trim(),
        note: formData.note.trim() || "",
        time: formData.time,
        date: formData.date,
        tradeId: formData.tradeId,
      };

      // Call API to create/update meeting
      await createMeeting(meetingData);

      // Send SYSTEM message via WebSocket if connected (only for new meetings, not updates)
      if (!isEditMode && stompClient && stompClient.connected && conversationId) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const systemMessageContent = `🗓️ ĐÃ TẠO LỊCH HẸN MỚI\n\n📆 Ngày: ${formData.date}\n🕐 Giờ: ${formData.time}\n📍 Địa điểm: ${formData.location}${formData.note ? `\n💬 Ghi chú: ${formData.note}` : ""}`;
        
        const messagePayload = {
          senderId: user?.id,
          content: systemMessageContent,
          type: "SYSTEM",
        };

        const destination = `/app/chat.sendMessage/${conversationId}`;
        try {
          stompClient.send(destination, {}, JSON.stringify(messagePayload));
          console.log("Sent SYSTEM message for meeting creation");
        } catch (msgError) {
          console.error("Error sending SYSTEM message:", msgError);
        }
      }

      // Show success message
      const successMsg = isEditMode ? "Lịch hẹn đã được cập nhật thành công!" : "Lịch hẹn đã được tạo thành công!";
      alert(successMsg);

      // Call onSuccess callback if provided (to refresh conversations)
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating/updating plan:", error);
      const errorMessage =
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get minimum time (if date is today, set min time to current time)
  const getMinTime = () => {
    if (formData.date === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return "00:00";
  };

  const surface = "#ffffff";
  const primary = "#2563eb";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
        padding: "20px",
        marginTop: "80px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: surface,
          borderRadius: 16,
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            {isEditMode ? "Sửa lịch hẹn" : "Tạo lịch hẹn"}
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            {isEditMode ? "Cập nhật thông tin lịch hẹn" : "Chọn ngày, giờ và địa điểm trao đổi"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "24px 20px" }}>
            {/* Date Selection */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-calendar3 me-2"></i>
                Ngày hẹn
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleChange("date")}
                min={today}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: errors.date
                    ? "2px solid #ef4444"
                    : "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.date
                    ? "#ef4444"
                    : "#e5e7eb";
                }}
              />
              {errors.date && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 12,
                    color: "#ef4444",
                  }}
                >
                  {errors.date}
                </p>
              )}
            </div>

            {/* Time Selection */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-clock me-2"></i>
                Giờ hẹn
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={handleChange("time")}
                min={formData.date === today ? getMinTime() : "00:00"}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: errors.time
                    ? "2px solid #ef4444"
                    : "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.time
                    ? "#ef4444"
                    : "#e5e7eb";
                }}
              />
              {errors.time && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 12,
                    color: "#ef4444",
                  }}
                >
                  {errors.time}
                </p>
              )}
            </div>

            {/* Location Selection */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    margin: 0,
                  }}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  Địa điểm
                </label>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  style={{
                    padding: "4px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    background: surface,
                    color: primary,
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f0f7ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                  }}
                >
                  {showMap ? "Ẩn bản đồ" : "Chọn địa chỉ"}
                </button>
              </div>
              {showMap && (
                <div
                  className="plan-modal-map-container"
                  style={{
                    marginBottom: 12,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    position: "relative",
                    height: "350px",
                  }}
                >
                  <ModelMap onLocationChange={handleLocationChange} />
                  <style>
                    {`
                      .plan-modal-map-container > div {
                        height: 350px !important;
                      }
                    `}
                  </style>
                </div>
              )}
              <input
                type="text"
                value={formData.location}
                onChange={handleChange("location")}
                placeholder="Nhập địa điểm trao đổi hoặc chọn trên bản đồ..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: errors.location
                    ? "2px solid #ef4444"
                    : "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.location
                    ? "#ef4444"
                    : "#e5e7eb";
                }}
              />
              {errors.location && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 12,
                    color: "#ef4444",
                  }}
                >
                  {errors.location}
                </p>
              )}
            </div>

            {/* Notes (Optional) */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#1f2937",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-sticky me-2"></i>
                Ghi chú (tùy chọn)
              </label>
              <textarea
                value={formData.note}
                onChange={handleChange("note")}
                placeholder="Thêm ghi chú cho lịch hẹn..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: "16px 20px 20px",
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 20px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: surface,
                color: "#6b7280",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = surface;
              }}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: 8,
                background: submitting ? "#9ca3af" : primary,
                color: surface,
                fontWeight: 600,
                fontSize: 13,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                opacity: submitting ? 0.7 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : (isEditMode ? "Cập nhật lịch hẹn" : "Tạo lịch hẹn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
