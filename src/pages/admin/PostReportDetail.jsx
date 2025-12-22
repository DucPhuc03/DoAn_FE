import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getPostReport } from "../../service/ReportService";
import { deletePost } from "../../service/PostService";
import { createAnnouncement } from "../../service/AnnouncementService";
import "../../css/ReportManagement.css";

export default function PostReportDetail() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getPostReport(postId);
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
  }, [postId]);

  async function handleDeletePost() {
    if (!window.confirm("Bạn có chắc muốn xóa bài đăng này?")) return;
    try {
      setProcessing(true);
      const res = await deletePost(data.postId);
      if (res?.code === 1000) {
        alert("Đã xóa bài đăng thành công.");
        navigate("/admin/report_management");
      } else {
        alert(res?.message || "Không thể xóa bài đăng.");
      }
    } catch (e) {
      console.error("delete post error", e);
      alert(
        e?.response?.data?.message ||
          "Không thể xóa bài đăng. Vui lòng thử lại."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleWarning() {
    if (!window.confirm("Gửi cảnh báo tới người dùng này?")) return;
    try {
      setProcessing(true);
      const today = new Date().toISOString().slice(0, 10); // yyyy-MM-dd
      const announcement = {
        title: "Cảnh báo về bài đăng vi phạm",
        message: `Bài đăng "${data.postTitle}" của bạn đã bị báo cáo ${data.count} lần. Vui lòng kiểm tra và điều chỉnh nội dung phù hợp.`,
        type: "system",
        link: `/post/${data.postId}`,
        userId: data.userId, // yêu cầu backend trả userId trong response
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
              <h1 className="report-detail-title">Chi tiết báo cáo bài đăng</h1>
            </div>
            <div className="report-count-badge">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{data.count} báo cáo</span>
            </div>
          </div>

          <div className="report-detail-grid">
            {/* Left Column - Post Info */}
            <div className="report-detail-left">
              {/* Post Card */}
              <div className="report-post-card">
                <div className="report-post-card-header">
                  <i className="bi bi-file-post"></i>
                  <span>Thông tin bài đăng</span>
                </div>
                
                {/* Post Image */}
                {data.imageUrl && data.imageUrl.length > 0 && (
                  <div className="report-post-image">
                    <img
                      src={data.imageUrl[0]}
                      alt={data.postTitle}
                    />
                  </div>
                )}
                
                {/* Post Details */}
                <div className="report-post-info">
                  <h3 className="report-post-title">{data.postTitle}</h3>
                  
                  <div className="report-post-meta">
                    <div className="report-post-meta-item">
                      <span className="report-meta-label">Mã bài đăng</span>
                      <span className="report-meta-value">#{data.postId}</span>
                    </div>
                  </div>

                  {/* Poster Info */}
                  <div className="report-poster-info">
                    <div className="report-poster-avatar">
                      {data.avatarUrl ? (
                        <img src={data.avatarUrl} alt={data.fullName} />
                      ) : (
                        <i className="bi bi-person-fill"></i>
                      )}
                    </div>
                    <div className="report-poster-details">
                      <span className="report-poster-label">Người đăng</span>
                      <span className="report-poster-name">{data.fullName}</span>
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
                  <span>Lý do báo cáo ({data.reasons?.length || 0})</span>
                </div>
                <div className="report-reasons-list">
                  {data.reasons && data.reasons.length > 0 ? (
                    data.reasons.map((reason, idx) => (
                      <div key={idx} className="report-reason-item">
                        <span className="report-reason-number">{idx + 1}</span>
                        <span className="report-reason-text">{reason}</span>
                      </div>
                    ))
                  ) : (
                    <div className="report-reasons-empty">
                      <i className="bi bi-inbox"></i>
                      <span>Chưa có lý do báo cáo</span>
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
                    className="report-action-btn report-action-delete"
                    onClick={handleDeletePost}
                    disabled={processing}
                  >
                    <i className="bi bi-trash3-fill"></i>
                    <span>{processing ? "Đang xử lý..." : "Xóa bài đăng"}</span>
                  </button>
                  <button
                    className="report-action-btn report-action-warn"
                    onClick={handleWarning}
                    disabled={processing}
                  >
                    <i className="bi bi-bell-fill"></i>
                    <span>{processing ? "Đang xử lý..." : "Cảnh báo người dùng"}</span>
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
