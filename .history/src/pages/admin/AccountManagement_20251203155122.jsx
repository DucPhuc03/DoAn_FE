import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function AccountManagement() {
  // Fake data
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
      status: "active",
      role: "user",
      createdAt: "15-01-2025",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987654321",
      status: "active",
      role: "user",
      createdAt: "14-01-2025",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0912345678",
      status: "inactive",
      role: "user",
      createdAt: "13-01-2025",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0923456789",
      status: "active",
      role: "admin",
      createdAt: "12-01-2025",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0934567890",
      status: "active",
      role: "user",
      createdAt: "11-01-2025",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      email: "vuthif@example.com",
      phone: "0945678901",
      status: "banned",
      role: "user",
      createdAt: "10-01-2025",
    },
    {
      id: 7,
      name: "Đỗ Văn G",
      email: "dovang@example.com",
      phone: "0956789012",
      status: "active",
      role: "user",
      createdAt: "09-01-2025",
    },
    {
      id: 8,
      name: "Bùi Thị H",
      email: "buithih@example.com",
      phone: "0967890123",
      status: "active",
      role: "user",
      createdAt: "08-01-2025",
    },
    {
      id: 9,
      name: "Ngô Văn I",
      email: "ngovani@example.com",
      phone: "0978901234",
      status: "inactive",
      role: "user",
      createdAt: "07-01-2025",
    },
    {
      id: 10,
      name: "Lý Thị K",
      email: "lythik@example.com",
      phone: "0989012345",
      status: "active",
      role: "user",
      createdAt: "06-01-2025",
    },
    {
      id: 11,
      name: "Đinh Văn L",
      email: "dinhvanl@example.com",
      phone: "0990123456",
      status: "active",
      role: "user",
      createdAt: "05-01-2025",
    },
    {
      id: 12,
      name: "Võ Thị M",
      email: "vothim@example.com",
      phone: "0901234567",
      status: "banned",
      role: "user",
      createdAt: "04-01-2025",
    },
    {
      id: 13,
      name: "Dương Văn N",
      email: "duongvann@example.com",
      phone: "0912345678",
      status: "active",
      role: "user",
      createdAt: "03-01-2025",
    },
    {
      id: 14,
      name: "Hồ Thị O",
      email: "hothio@example.com",
      phone: "0923456789",
      status: "active",
      role: "user",
      createdAt: "02-01-2025",
    },
    {
      id: 15,
      name: "Trương Văn P",
      email: "truongvanp@example.com",
      phone: "0934567890",
      status: "inactive",
      role: "user",
      createdAt: "01-01-2025",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((acc) => {
      const name = (acc.name || "").toLowerCase();
      const email = (acc.email || "").toLowerCase();
      const phone = (acc.phone || "").toLowerCase();
      const idText = String(acc.id ?? "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        idText.includes(q)
      );
    });
  }, [accounts, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / rowsPerPage)
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = filteredAccounts.slice(startIndex, endIndex);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function getStatusColor(status) {
    switch (status) {
      case "active":
        return { bg: "#d1fae5", color: "#065f46", text: "Hoạt động" };
      case "inactive":
        return { bg: "#fef3c7", color: "#92400e", text: "Không hoạt động" };
      case "banned":
        return { bg: "#fee2e2", color: "#991b1b", text: "Bị khóa" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", text: status };
    }
  }

  function getRoleColor(role) {
    switch (role) {
      case "admin":
        return { bg: "#dbeafe", color: "#1e40af", text: "Quản trị viên" };
      case "user":
        return { bg: "#f3f4f6", color: "#374151", text: "Người dùng" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", text: role };
    }
  }

  function handleToggleStatus(id) {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          if (acc.status === "active") {
            return { ...acc, status: "inactive" };
          } else if (acc.status === "inactive") {
            return { ...acc, status: "banned" };
          } else {
            return { ...acc, status: "active" };
          }
        }
        return acc;
      })
    );
  }

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
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
      <Sidebar active="users" />

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
              Quản lý tài khoản
            </h1>
          </div>

          {/* Top Bar: Filter, Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
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
                    }}
                  >
                    Tên
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
                    Email
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
                    Số điện thoại
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
                    Vai trò
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
                    Ngày tạo
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#6b7280",
                      borderBottom: "1px solid #e5e7eb",
                      width: "180px",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((account) => {
                  const statusStyle = getStatusColor(account.status);
                  const roleStyle = getRoleColor(account.role);
                  return (
                    <tr
                      key={account.id}
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
                        {account.id}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: 500,
                        }}
                      >
                        {account.name}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {account.email}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {account.phone}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: roleStyle.bg,
                            color: roleStyle.color,
                          }}
                        >
                          {roleStyle.text}
                        </span>
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
                        {account.createdAt}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => handleToggleStatus(account.id)}
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
                            {account.status === "active"
                              ? "Khóa"
                              : account.status === "inactive"
                              ? "Kích hoạt"
                              : "Mở khóa"}
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
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
              {startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)} of{" "}
              {filteredAccounts.length}
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



