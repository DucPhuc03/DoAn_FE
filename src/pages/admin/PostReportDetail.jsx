import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../css/ReportManagement.css";

export default function PostReportDetail() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const fakeData = {
    title: `Bài đăng #${postId} - Xe đạp cũ cần trao đổi`,
    owner: {
      username: "phuc",
      fullName: "Nguyễn Phúc",
    },
    reportCount: 4,
    reasons: [
      "Sản phẩm không đúng như trao đổi",
      "Không uy tín",
      "Không đến điểm trao đổi",
      "Nội dung không phù hợp",
    ],
  };

  const handleAction = (action) => {
    alert(`Thực hiện hành động "${action}" cho bài đăng #${postId}`);
  };

  return (
    <div className="report-layout">
      <Sidebar active="report" />
      <main className="report-main">
        <div className="report-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="report-title">Chi tiết báo cáo bài đăng</h1>
              <p className="text-muted mb-0">Xem và xử lý báo cáo</p>
            </div>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/report_management")}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Quay lại
            </button>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="row mb-3 pb-3 border-bottom">
                <div className="col-md-8">
                  <p className="text-muted small mb-1">Bài đăng</p>
                  <h4 className="mb-2">{fakeData.title}</h4>
                  <p className="mb-1">
                    Người đăng: <strong>{fakeData.owner.username}</strong> (
                    {fakeData.owner.fullName})
                  </p>
                  <p className="text-muted mb-0">Mã bài đăng: #{postId}</p>
                </div>
                <div className="col-md-4 text-end">
                  <p className="text-muted mb-2">Số lần báo cáo</p>
                  <span className="badge bg-danger fs-6">
                    <i className="bi bi-flag-fill me-1"></i>
                    {fakeData.reportCount} lần
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-7">
                  <h5 className="mb-3">Danh sách lý do báo cáo</h5>
                  {fakeData.reasons.length > 0 ? (
                    <ul className="list-group">
                      {fakeData.reasons.map((reason, idx) => (
                        <li key={idx} className="list-group-item">
                          <span className="badge bg-secondary me-2">
                            {idx + 1}
                          </span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">Chưa có lý do báo cáo</p>
                  )}
                </div>

                <div className="col-md-5">
                  <h5 className="mb-3">Hành động</h5>
                  <p className="text-muted small mb-3">
                    Chọn hành động để xử lý bài đăng
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-secondary text-start"
                      onClick={() => handleAction("Bỏ qua")}
                    >
                      <i className="bi bi-check2-circle me-2"></i>
                      Bỏ qua báo cáo
                    </button>
                    <button
                      className="btn btn-warning text-start"
                      onClick={() => handleAction("Ẩn bài")}
                    >
                      <i className="bi bi-eye-slash me-2"></i>
                      Ẩn bài đăng
                    </button>
                    <button
                      className="btn btn-danger text-start"
                      onClick={() => handleAction("Xóa bài")}
                    >
                      <i className="bi bi-trash3 me-2"></i>
                      Xóa bài đăng
                    </button>
                    <button
                      className="btn btn-outline-danger text-start"
                      onClick={() => handleAction("Cảnh báo")}
                    >
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Gửi cảnh báo
                    </button>
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
