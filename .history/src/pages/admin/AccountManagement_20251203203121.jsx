import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAllUser, updateUserStatus } from "../../service/user/UserService";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUser();
      setAccounts(response?.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.message || "Không thể tải danh sách tài khoản."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((acc) => {
      const name = (acc.fullName || acc.username || "").toLowerCase();
      const email = (acc.email || "").toLowerCase();
      const phone = (acc.phoneNumber || "").toLowerCase();
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
    // API trả về: ACTIVE | BANNED
    switch (status) {
      case "ACTIVE":
        return { bg: "#d1fae5", color: "#065f46", text: "Đang hoạt động" };
      case "BANNED":
        return { bg: "#fee2e2", color: "#991b1b", text: "Đã khóa" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", text: status };
    }
  }

  function getRoleColor(role) {
    switch (role) {
      case "ADMIN":
        return { bg: "#dbeafe", color: "#1e40af", text: "Quản trị viên" };
      case "USER":
        return { bg: "#f3f4f6", color: "#374151", text: "Người dùng" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280", text: role };
    }
  }

  async function handleToggleStatus(id) {
    try {
      setUpdatingId(id);
      await updateUserStatus(id);
      await loadUsers();
    } catch (e) {
      alert(
        e?.response?.data?.message || "Không thể cập nhật trạng thái tài khoản."
      );
    } finally {
      setUpdatingId(null);
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

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

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
                      width: "70px",
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
                      width: "80px",
                    }}
                  >
                    Ảnh
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
                      <td style={{ padding: "12px 16px" }}>
                        {account.avatarUrl ? (
                          <img
                            src={account.avatarUrl}
                            alt={account.fullName || account.username}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "999px",
                              objectFit: "cover",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "999px",
                              background: "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#4b5563",
                            }}
                          >
                            {(account.fullName || account.username || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: 500,
                        }}
                      >
                        {account.fullName}
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
                        {account.phoneNumber || "-"}
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
                            whiteSpace: "nowrap",
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
                            disabled={updatingId === account.id}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #000080",
                              background: "#ffffff",
                              color: "#000080",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor:
                                updatingId === account.id
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s",
                              opacity: updatingId === account.id ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (updatingId !== account.id) {
                                e.currentTarget.style.background = "#000080";
                                e.currentTarget.style.color = "#ffffff";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#000080";
                            }}
                          >
                            {account.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pageData.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
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
