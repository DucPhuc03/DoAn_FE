import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../css/ReportManagement.css";
import {
  getReport,
  updateReport,
  deleteReport,
} from "../../service/ReportService";

export default function ReportManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user"); // "user" or "post"
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, resolved
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [updatingId, setUpdatingId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function loadReports() {
    try {
      setLoading(true);
      setError("");
      const res = await getReport();
      const list = res?.data || res?.data?.data || res?.data || [];
      const normalized = (list || []).map((r) => ({
        id: r.id,
        reportedId: r.reportedId,
        postId: r.postId,
        reporterName: r.reporter?.username || "Không rõ",
        reporterEmail: "",
        reportedType: r.type, // "user" | "post"
        reportedTitle: null, // hiện tại API chưa trả title bài đăng
        reportedBy: r.reportedUser?.username || "Không rõ",
        reason: r.reason,
        status: (r.status || "PENDING").toLowerCase(), // "pending" | "resolved"
        date: r.reportDate,
      }));
      setReports(normalized);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err?.response?.data?.message ||
          "Không thể tải danh sách báo cáo. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  // Filter by tab (user or post)
  const filteredByTab = useMemo(() => {
    return reports.filter((r) => r.reportedType === activeTab);
  }, [reports, activeTab]);

  const filteredReports = useMemo(() => {
    let result = filteredByTab;

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Filter by search
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((r) => {
        const reporterName = (r.reporterName || "").toLowerCase();
        const reportedBy = (r.reportedBy || "").toLowerCase();
        const reason = (r.reason || "").toLowerCase();
        const reportedTitle = (r.reportedTitle || "").toLowerCase();
        const idText = String(r.id ?? "").toLowerCase();
        return (
          reporterName.includes(q) ||
          reportedBy.includes(q) ||
          reason.includes(q) ||
          reportedTitle.includes(q) ||
          idText.includes(q)
        );
      });
    }

    return result;
  }, [filteredByTab, search, filterStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / rowsPerPage)
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = filteredReports.slice(startIndex, endIndex);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", color: "#92400e", text: "Chờ xử lý" };
      case "resolved":
        return { bg: "#d1fae5", color: "#065f46", text: "Đã xử lý" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", text: status };
    }
  }

  function getReportedTypeText(type) {
    switch (type) {
      case "post":
        return "Bài đăng";
      case "user":
        return "Người dùng";
      default:
        return type;
    }
  }

  function handleView(id) {
    const report = reports.find((r) => r.id === id);
    if (report) {
      // Nếu là báo cáo post, điều hướng đến trang chi tiết bài đăng dành cho admin
      if (report.reportedType === "post") {
        const targetPostId = report.postId || report.reportedId;
        if (targetPostId) {
          navigate(`/admin/post_report/${targetPostId}`);
        } else {
          alert("Không tìm thấy thông tin bài đăng được báo cáo.");
        }
        return;
      }

      // Nếu là báo cáo user, hiển thị thông tin chi tiết
      alert(
        `Chi tiết báo cáo #${id}\n\n` +
          `Người báo cáo: ${report.reporterName} (${report.reporterEmail})\n` +
          `Loại: ${getReportedTypeText(report.reportedType)}\n` +
          `Bị báo cáo: ${report.reportedBy}\n` +
          `${
            report.reportedTitle ? `Bài đăng: ${report.reportedTitle}\n` : ""
          }` +
          `Lý do: ${report.reason}\n` +
          `Trạng thái: ${getStatusColor(report.status).text}\n` +
          `Ngày: ${report.date}`
      );
    }
  }

  async function handleResolve(id) {
    if (!window.confirm("Bạn có chắc muốn đánh dấu báo cáo này là đã xử lý?"))
      return;
    try {
      setUpdatingId(id);
      const res = await updateReport(id);
      if (res?.code === 1000) {
        await loadReports();
        alert(`Đã đánh dấu báo cáo #${id} là đã xử lý`);
      } else {
        alert(res?.message || "Không thể cập nhật trạng thái báo cáo.");
      }
    } catch (e) {
      console.error("update report error", e);
      alert(
        e?.response?.data?.message ||
          "Không thể cập nhật trạng thái báo cáo. Vui lòng thử lại."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này?")) return;
    try {
      setUpdatingId(id);
      const res = await deleteReport(id);
      if (res?.code === 1000) {
        await loadReports();
        if (page > 1 && pageData.length === 1) {
          setPage(page - 1);
        }
        alert(`Đã xóa báo cáo #${id}`);
      } else {
        alert(res?.message || "Không thể xóa báo cáo.");
      }
    } catch (e) {
      console.error("delete report error", e);
      alert(
        e?.response?.data?.message ||
          "Không thể xóa báo cáo. Vui lòng thử lại."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="report-layout">
      <Sidebar active="report" />

      <main className="report-main">
        <div className="report-container">
          {/* Header */}
          <div className="report-header">
            <h1 className="report-title">Quản lý báo cáo</h1>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <button
              onClick={() => {
                setActiveTab("user");
                setPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === "user" ? "#2563eb" : "#6b7280",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                borderBottom:
                  activeTab === "user"
                    ? "3px solid #2563eb"
                    : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              Báo cáo người dùng
            </button>
            <button
              onClick={() => {
                setActiveTab("post");
                setPage(1);
              }}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === "post" ? "#2563eb" : "#6b7280",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                borderBottom:
                  activeTab === "post"
                    ? "3px solid #2563eb"
                    : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              Báo cáo bài đăng
            </button>
          </div>

          {/* Top Bar: Filter, Search, Status Filter */}
          <div className="report-topbar" style={{ flexWrap: "wrap" }}>
            <button className="report-filter-btn" title="Filter">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4h12M4 8h8M6 12h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="report-search-wrapper">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="report-search-input"
              />
              <svg
                className="report-search-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM13 13l-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Status Filter */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setPage(1);
                }}
                className={`report-btn ${
                  filterStatus === "all" ? "report-btn-view" : ""
                }`}
                style={{
                  padding: "8px 16px",
                  background: filterStatus === "all" ? "#000080" : "#ffffff",
                  color: filterStatus === "all" ? "#ffffff" : "#6b7280",
                }}
              >
                Tất cả
              </button>
              <button
                onClick={() => {
                  setFilterStatus("pending");
                  setPage(1);
                }}
                className="report-btn"
                style={{
                  padding: "8px 16px",
                  background:
                    filterStatus === "pending" ? "#fef3c7" : "#ffffff",
                  color: filterStatus === "pending" ? "#92400e" : "#6b7280",
                  border: "1px solid #d1d5db",
                }}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => {
                  setFilterStatus("resolved");
                  setPage(1);
                }}
                className="report-btn"
                style={{
                  padding: "8px 16px",
                  background:
                    filterStatus === "resolved" ? "#d1fae5" : "#ffffff",
                  color: filterStatus === "resolved" ? "#065f46" : "#6b7280",
                  border: "1px solid #d1d5db",
                }}
              >
                Đã xử lý
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th style={{ width: "150px" }}>Người báo cáo</th>
                  <th style={{ width: "120px" }}>Loại</th>
                  {activeTab === "user" && (
                    <th style={{ width: "150px" }}>Bị báo cáo</th>
                  )}
                  <th>Lý do</th>
                  <th style={{ width: "130px" }}>Trạng thái</th>
                  <th style={{ width: "120px" }}>Ngày báo cáo</th>
                  <th style={{ width: "220px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((report) => {
                  const statusStyle = getStatusColor(report.status);
                  return (
                    <tr key={report.id}>
                      <td style={{ fontWeight: 600 }}>{report.id}</td>
                      <td>
                        <div>{report.reporterName}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginTop: "2px",
                          }}
                        >
                          {report.reporterEmail}
                        </div>
                      </td>
                      <td>{getReportedTypeText(report.reportedType)}</td>
                      {activeTab === "user" && (
                        <td>
                          <div>{report.reportedBy}</div>
                          {report.reportedTitle && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginTop: "2px",
                              }}
                            >
                              {report.reportedTitle}
                            </div>
                          )}
                        </td>
                      )}
                      <td>{report.reason}</td>
                      <td>
                        <span
                          className="report-badge"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {statusStyle.text}
                        </span>
                      </td>
                      <td style={{ color: "#6b7280" }}>{report.date}</td>
                      <td>
                        <div className="report-actions">
                          <button
                            onClick={() => handleView(report.id)}
                            className="report-btn report-btn-view"
                            title={
                              report.reportedType === "post"
                                ? "Xem chi tiết bài đăng"
                                : "Xem chi tiết"
                            }
                          >
                            {report.reportedType === "post" ? "Xem" : "Xem"}
                          </button>
                          {report.status === "pending" && (
                            <button
                              onClick={() => handleResolve(report.id)}
                              disabled={updatingId === report.id}
                              className="report-btn report-btn-resolve"
                            >
                              {updatingId === report.id ? "Đang xử lý..." : "Xử lý"}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={updatingId === report.id}
                            className="report-btn report-btn-reject"
                          >
                            {updatingId === report.id ? "Đang xóa..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="report-table-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="report-pagination">
            <div className="report-pagination-info">
              {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of{" "}
              {filteredReports.length}
            </div>

            <div className="report-pagination-controls">
              <div className="report-rows-select">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="report-page-nav">
                <button
                  onClick={() => goto(page - 1)}
                  disabled={page === 1}
                  className="report-page-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8l4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span className="report-page-text">
                  {page}/{totalPages}
                </span>
                <button
                  onClick={() => goto(page + 1)}
                  disabled={page === totalPages}
                  className="report-page-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
