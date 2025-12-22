import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserReport } from "../../service/ReportService";
import { updateUserStatus } from "../../service/UserService";
import { createAnnouncement } from "../../service/AnnouncementService";
import "../../css/ReportManagement.css";

export default function UserReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Nhận lý do báo cáo từ state navigation
  const reportReason = location.state?.reason || null;
  const reporterName = location.state?.reporterName || null;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getUserReport(userId);
        if (res.code === 1000) {
          setData(res.data);
        } else {
          setError(res.message || "Không thể tải dữ liệu");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  async function handleWarning() {
    if (!window.confirm("Gửi cảnh báo tới người dùng này?")) return;
    try {
      setProcessing(true);
      const announcement = {
        title: "Cảnh báo về hành vi vi phạm",
        message: `Tài khoản của bạn đã bị báo cáo ${data.reportCount || 1} lần. Vui lòng tuân thủ quy định cộng đồng.`,
        type: "system",
        link: `/profile/${userId}`,
        userId: userId,
      };
      const res = await createAnnouncement(announcement);
      if (res?.code === 1000) {
        alert("Đã gửi cảnh báo đến người dùng.");
      } else {
        alert(res?.message || "Không thể gửi cảnh báo.");
      }
    } catch (e) {
      console.error("create announcement error", e);
      alert(
        e?.response?.data?.message ||
          "Không thể gửi cảnh báo. Vui lòng thử lại."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleBanUser() {
    if (!window.confirm("Bạn có chắc muốn khóa tài khoản người dùng này?")) return;
    try {
      setProcessing(true);
      const res = await updateUserStatus(userId);
      if (res?.code === 1000) {
        alert("Đã khóa tài khoản người dùng thành công.");
        navigate("/admin/report_management");
      } else {
        alert(res?.message || "Không thể khóa tài khoản.");
      }
    } catch (e) {
      console.error("ban user error", e);
      alert(
        e?.response?.data?.message ||
          "Không thể khóa tài khoản. Vui lòng thử lại."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="report-layout">
        <Sidebar active="report" />
        <main className="report-main">
          <div className="report-container">
            <p>Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="report-layout">
        <Sidebar active="report" />
        <main className="report-main">
          <div className="report-container">
            <div className="alert alert-danger">
              {error || "Không tìm thấy dữ liệu"}
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/report_management")}
            >
              Quay lại
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="report-layout">
      <Sidebar active="report" />
      <main className="report-main">
        <div className="report-container">
          {/* Header */}
          <div className="report-detail-header">
            <div>
              <button
                className="report-back-btn"
                onClick={() => navigate("/admin/report_management")}
              >
                <i className="bi bi-arrow-left"></i>
                Quay lại
              </button>
              <h1 className="report-detail-title">Chi tiết báo cáo người dùng</h1>
            </div>
            <div className="report-count-badge">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{data.reportCount || 1} báo cáo</span>
            </div>
          </div>

          <div className="report-detail-grid">
            {/* Left Column - User Info */}
            <div className="report-detail-left">
              <div className="report-post-card">
                <div className="report-post-card-header">
                  <i className="bi bi-person-fill"></i>
                  <span>Thông tin người dùng</span>
                </div>
                
                {/* User Avatar */}
                <div className="report-post-image" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {data.avatarUrl ? (
                    <img
                      src={data.avatarUrl}
                      alt={data.fullName || data.username}
                      style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ 
                      width: "150px", 
                      height: "150px", 
                      borderRadius: "50%", 
                      background: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <i className="bi bi-person-fill" style={{ fontSize: "60px", color: "#9ca3af" }}></i>
                    </div>
                  )}
                </div>
                
                {/* User Details */}
                <div className="report-post-info">
                  <h3 className="report-post-title">{data.fullName || data.username || "Không rõ"}</h3>
                  
                  <div className="report-post-meta">
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">ID người dùng</span>
                      <span className="report-meta-value">#{data.id || userId}</span>
                    </div>
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">Tên đăng nhập</span>
                      <span className="report-meta-value">{data.username || "N/A"}</span>
                    </div>
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">Email</span>
                      <span className="report-meta-value">{data.email || "N/A"}</span>
                    </div>
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">Số điện thoại</span>
                      <span className="report-meta-value">{data.phoneNumber || "N/A"}</span>
                    </div>
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">Ngày tham gia</span>
                      <span className="report-meta-value">{data.createdAt || data.joinDate || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Reasons & Actions */}
            <div className="report-detail-right">
              {/* Reasons Card */}
              <div className="report-reasons-card">
                <div className="report-reasons-header">
                  <i className="bi bi-flag-fill"></i>
                  <span>Lý do báo cáo</span>
                </div>
                <div className="report-reasons-list">
                  {reportReason ? (
                    <div className="report-reason-item">
                      <span className="report-reason-number">1</span>
                      <div style={{ flex: 1 }}>
                        <span className="report-reason-text">{reportReason}</span>
                        {reporterName && (
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            Báo cáo bởi: {reporterName}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="report-reasons-empty">
                      <i className="bi bi-inbox"></i>
                      <span>Không có lý do báo cáo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Card */}
              <div className="report-actions-card">
                <div className="report-actions-header">
                  <i className="bi bi-gear-fill"></i>
                  <span>Hành động xử lý</span>
                </div>
                <div className="report-actions-content">
                  <button
                    className="report-action-btn report-action-warn"
                    onClick={handleWarning}
                    disabled={processing}
                  >
                    <i className="bi bi-bell-fill"></i>
                    <span>{processing ? "Đang xử lý..." : "Cảnh báo người dùng"}</span>
                  </button>
                  <button
                    className="report-action-btn report-action-delete"
                    onClick={handleBanUser}
                    disabled={processing}
                  >
                    <i className="bi bi-slash-circle"></i>
                    <span>{processing ? "Đang xử lý..." : "Khóa tài khoản"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
