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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="report-title">Chi tiết báo cáo bài đăng</h1>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/report_management")}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Quay lại
            </button>
          </div>

          {/* Một khối duy nhất chứa toàn bộ nội dung */}
          <div className="card">
            <div className="card-body">
              <div className="row g-4">
                {/* Thông tin bài và ảnh */}
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-3 align-items-start">
                    {data.imageUrl && data.imageUrl.length > 0 && (
                      <div style={{ maxWidth: 320 }}>
                        <img
                          src={data.imageUrl[0]}
                          alt={data.postTitle}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "260px",
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h4 className="mb-2">{data.postTitle}</h4>
                      <p className="mb-2">
                        <strong>Người đăng:</strong>{" "}
                        {data.avatarUrl && (
                          <img
                            src={data.avatarUrl}
                            alt={data.fullName}
                            className="rounded-circle me-2"
                            style={{ width: "32px", height: "32px" }}
                          />
                        )}
                        {data.fullName}
                      </p>
                      <p className="mb-2">
                        <strong>Mã bài đăng:</strong> #{data.postId}
                      </p>
                      <p className="mb-0">
                        <strong>Số lần báo cáo:</strong>{" "}
                        <span className="badge bg-danger">
                          {data.count} lần
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lý do và hành động trong cùng khối */}
                <div className="col-12">
                  <div className="row g-3">
                    <div className="col-md-7">
                      <h5 className="mb-3">Lý do báo cáo</h5>
                      {data.reasons && data.reasons.length > 0 ? (
                        <ul className="list-group">
                          {data.reasons.map((reason, idx) => (
                            <li key={idx} className="list-group-item">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted mb-0">Chưa có lý do báo cáo</p>
                      )}
                    </div>

                    <div className="col-md-5">
                      <h5 className="mb-3">Hành động</h5>
                      <div className="report-actions">
                        <button
                          className="report-btn report-btn-reject"
                          onClick={handleDeletePost}
                          disabled={processing}
                        >
                          {processing ? "Đang xử lý..." : "Xóa bài đăng"}
                        </button>
                        <button
                          className="report-btn report-btn-resolve"
                          onClick={handleWarning}
                          disabled={processing}
                        >
                          {processing ? "Đang xử lý..." : "Cảnh báo người dùng"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
