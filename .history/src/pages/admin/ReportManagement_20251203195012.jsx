import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function ReportManagement() {
  // Fake data
  const [reports, setReports] = useState([
    {
      id: 1,
      reporterName: "Nguyễn Văn A",
      reporterEmail: "nguyenvana@example.com",
      reportedType: "post",
      reportedId: 101,
      reportedTitle: "Xe đạp cũ cần trao đổi",
      reportedBy: "Trần Thị B",
      reason: "Nội dung không phù hợp",
      status: "pending",
      date: "15-01-2025",
    },
    {
      id: 2,
      reporterName: "Lê Văn C",
      reporterEmail: "levanc@example.com",
      reportedType: "user",
      reportedId: 102,
      reportedTitle: null,
      reportedBy: "Phạm Thị D",
      reason: "Hành vi lừa đảo",
      status: "pending",
      date: "14-01-2025",
    },
    {
      id: 3,
      reporterName: "Hoàng Văn E",
      reporterEmail: "hoangvane@example.com",
      reportedType: "post",
      reportedId: 103,
      reportedTitle: "Laptop Dell cũ",
      reportedBy: "Vũ Thị F",
      reason: "Ảnh không đúng sản phẩm",
      status: "resolved",
      date: "13-01-2025",
    },
    {
      id: 4,
      reporterName: "Đỗ Văn G",
      reporterEmail: "dovang@example.com",
      reportedType: "user",
      reportedId: 104,
      reportedTitle: null,
      reportedBy: "Bùi Thị H",
      reason: "Spam tin nhắn",
      status: "pending",
      date: "12-01-2025",
    },
    {
      id: 5,
      reporterName: "Ngô Văn I",
      reporterEmail: "ngovani@example.com",
      reportedType: "post",
      reportedId: 105,
      reportedTitle: "Quần áo trẻ em",
      reportedBy: "Lý Thị K",
      reason: "Giá cả không minh bạch",
      status: "resolved",
      date: "11-01-2025",
    },
    {
      id: 6,
      reporterName: "Đinh Văn L",
      reporterEmail: "dinhvanl@example.com",
      reportedType: "post",
      reportedId: 106,
      reportedTitle: "Sách giáo khoa lớp 10",
      reportedBy: "Võ Thị M",
      reason: "Nội dung vi phạm",
      status: "pending",
      date: "10-01-2025",
    },
    {
      id: 7,
      reporterName: "Dương Văn N",
      reporterEmail: "duongvann@example.com",
      reportedType: "user",
      reportedId: 107,
      reportedTitle: null,
      reportedBy: "Hồ Thị O",
      reason: "Tài khoản giả mạo",
      status: "resolved",
      date: "09-01-2025",
    },
    {
      id: 8,
      reporterName: "Trương Văn P",
      reporterEmail: "truongvanp@example.com",
      reportedType: "post",
      reportedId: 108,
      reportedTitle: "Đồ chơi LEGO",
      reportedBy: "Nguyễn Văn Q",
      reason: "Sản phẩm đã bán",
      status: "pending",
      date: "08-01-2025",
    },
    {
      id: 9,
      reporterName: "Lê Thị R",
      reporterEmail: "lethir@example.com",
      reportedType: "post",
      reportedId: 109,
      reportedTitle: "Tủ lạnh cũ",
      reportedBy: "Phạm Văn S",
      reason: "Thông tin sai lệch",
      status: "resolved",
      date: "07-01-2025",
    },
    {
      id: 10,
      reporterName: "Hoàng Thị T",
      reporterEmail: "hoangthit@example.com",
      reportedType: "user",
      reportedId: 110,
      reportedTitle: null,
      reportedBy: "Vũ Văn U",
      reason: "Quấy rối",
      status: "pending",
      date: "06-01-2025",
    },
    {
      id: 11,
      reporterName: "Đỗ Thị V",
      reporterEmail: "dothiv@example.com",
      reportedType: "post",
      reportedId: 111,
      reportedTitle: "Giày thể thao Nike",
      reportedBy: "Bùi Văn W",
      reason: "Hàng giả",
      status: "pending",
      date: "05-01-2025",
    },
    {
      id: 12,
      reporterName: "Ngô Thị X",
      reporterEmail: "ngothix@example.com",
      reportedType: "post",
      reportedId: 112,
      reportedTitle: "Đồ dùng học tập",
      reportedBy: "Lý Văn Y",
      reason: "Mô tả không đúng",
      status: "resolved",
      date: "04-01-2025",
    },
    {
      id: 13,
      reporterName: "Đinh Thị Z",
      reporterEmail: "dinhthiz@example.com",
      reportedType: "user",
      reportedId: 113,
      reportedTitle: null,
      reportedBy: "Võ Văn AA",
      reason: "Tài khoản bị hack",
      status: "pending",
      date: "03-01-2025",
    },
    {
      id: 14,
      reporterName: "Dương Thị BB",
      reporterEmail: "duongthibb@example.com",
      reportedType: "post",
      reportedId: 114,
      reportedTitle: "Máy tính bảng iPad",
      reportedBy: "Hồ Văn CC",
      reason: "Không liên hệ được",
      status: "resolved",
      date: "02-01-2025",
    },
    {
      id: 15,
      reporterName: "Trương Thị DD",
      reporterEmail: "truongthidd@example.com",
      reportedType: "post",
      reportedId: 115,
      reportedTitle: "Tủ quần áo gỗ",
      reportedBy: "Nguyễn Văn EE",
      reason: "Sản phẩm đã hết",
      status: "pending",
      date: "01-01-2025",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, resolved
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredReports = useMemo(() => {
    let result = reports;

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
  }, [reports, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / rowsPerPage));
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
      alert(
        `Chi tiết báo cáo #${id}\n\n` +
          `Người báo cáo: ${report.reporterName} (${report.reporterEmail})\n` +
          `Loại: ${getReportedTypeText(report.reportedType)}\n` +
          `Bị báo cáo: ${report.reportedBy}\n` +
          `${report.reportedTitle ? `Bài đăng: ${report.reportedTitle}\n` : ""}` +
          `Lý do: ${report.reason}\n` +
          `Trạng thái: ${getStatusColor(report.status).text}\n` +
          `Ngày: ${report.date}`
      );
    }
  }

  function handleResolve(id) {
    if (!window.confirm("Bạn có chắc muốn đánh dấu báo cáo này là đã xử lý?"))
      return;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
    alert(`Đã đánh dấu báo cáo #${id} là đã xử lý`);
  }

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này?")) return;
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (page > 1 && pageData.length === 1) {
      setPage(page - 1);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8F8F8",
      }}
    >
      <Sidebar active="report" />

      <main style={{ flex: 1, padding: "24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#000",
              }}
            >
              Quản lý báo cáo
            </h1>
          </div>

          {/* Top Bar: Filter, Search, Status Filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#6b7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Filter"
            >
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

            <div
              style={{
                flex: 1,
                position: "relative",
                maxWidth: "400px",
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                  background: "#ffffff",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
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
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setPage(1);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: filterStatus === "all" ? "#000080" : "#ffffff",
                  color: filterStatus === "all" ? "#ffffff" : "#6b7280",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Tất cả
              </button>
              <button
                onClick={() => {
                  setFilterStatus("pending");
                  setPage(1);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: filterStatus === "pending" ? "#fef3c7" : "#ffffff",
                  color: filterStatus === "pending" ? "#92400e" : "#6b7280",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => {
                  setFilterStatus("resolved");
                  setPage(1);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background:
                    filterStatus === "resolved" ? "#d1fae5" : "#ffffff",
                  color: filterStatus === "resolved" ? "#065f46" : "#6b7280",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Đã xử lý
              </button>
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "80px",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "150px",
                    }}
                  >
                    Người báo cáo
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "120px",
                    }}
                  >
                    Loại
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "150px",
                    }}
                  >
                    Bị báo cáo
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Lý do
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "130px",
                    }}
                  >
                    Trạng thái
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "120px",
                    }}
                  >
                    Ngày báo cáo
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "220px",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((report) => {
                  const statusStyle = getStatusColor(report.status);
                  return (
                    <tr
                      key={report.id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: 600,
                        }}
                      >
                        {report.id}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
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
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {getReportedTypeText(report.reportedType)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
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
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {report.reason}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {statusStyle.text}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        {report.date}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            onClick={() => handleView(report.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #000080",
                              background: "#ffffff",
                              color: "#000080",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#000080";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#000080";
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M8 3C5 3 2.73 5.11 1.5 8c1.23 2.89 3.5 5 6.5 5s5.27-2.11 6.5-5c-1.23-2.89-3.5-5-6.5-5zM8 11.5c-1.93 0-3.5-1.57-3.5-3.5S6.07 4.5 8 4.5s3.5 1.57 3.5 3.5S9.93 11.5 8 11.5zM8 6c-.83 0-1.5.67-1.5 1.5S7.17 9 8 9s1.5-.67 1.5-1.5S8.83 6 8 6z"
                                fill="currentColor"
                              />
                            </svg>
                            Xem
                          </button>
                          {report.status === "pending" && (
                            <button
                              onClick={() => handleResolve(report.id)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "6px",
                                border: "1px solid #22c55e",
                                background: "#ffffff",
                                color: "#22c55e",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#22c55e";
                                e.currentTarget.style.color = "#ffffff";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#ffffff";
                                e.currentTarget.style.color = "#22c55e";
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M13.5 4.5l-7 7-4-4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Xử lý
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(report.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #dc2626",
                              background: "#ffffff",
                              color: "#dc2626",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#dc2626";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#dc2626";
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M4 4h8M6 4V2h4v2M3 6h10l-1 8H4l-1-8z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pageData.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: "14px",
                      }}
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              padding: "12px 0",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of{" "}
              {filteredReports.length}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                <label>Rows per page:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    background: "#ffffff",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => goto(page - 1)}
                  disabled={page === 1}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: page === 1 ? "#f9fafb" : "#ffffff",
                    color: page === 1 ? "#9ca3af" : "#6b7280",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.background = "#f9fafb";
                      e.currentTarget.style.borderColor = "#9ca3af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== 1) {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10 12L6 8l4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  {page}/{totalPages}
                </span>
                <button
                  onClick={() => goto(page + 1)}
                  disabled={page === totalPages}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: page === totalPages ? "#f9fafb" : "#ffffff",
                    color: page === totalPages ? "#9ca3af" : "#6b7280",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (page !== totalPages) {
                      e.currentTarget.style.background = "#f9fafb";
                      e.currentTarget.style.borderColor = "#9ca3af";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== totalPages) {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
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



