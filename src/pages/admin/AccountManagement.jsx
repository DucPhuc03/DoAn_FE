import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAllUser, updateUserStatus } from "../../service/UserService";
import "../../css/AccountManagement.css";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
    <div className="account-layout">
      <Sidebar active="users" />

      <main className="account-main">
        <div className="account-container">
          {/* Header */}
          <div className="account-header">
            <h1 className="account-title">Quản lý tài khoản</h1>
          </div>

          {/* Top Bar: Filter, Search */}
          <div className="account-topbar">
            <button className="account-filter-btn" title="Filter">
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

            <div className="account-search-wrapper">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="account-search-input"
              />
              <svg
                className="account-search-icon"
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

          {error && <div className="account-error">{error}</div>}

          {/* Table */}
          <div className="account-table-wrapper">
            <table className="account-table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>ID</th>
                  <th style={{ width: "80px" }}>Ảnh</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th style={{ width: "120px" }}>Số điện thoại</th>
                  <th style={{ width: "130px" }}>Vai trò</th>
                  <th style={{ width: "130px" }}>Trạng thái</th>
                  <th style={{ width: "120px" }}>Ngày tạo</th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((account) => {
                  const statusStyle = getStatusColor(account.status);
                  const roleStyle = getRoleColor(account.role);
                  return (
                    <tr key={account.id}>
                      <td style={{ fontWeight: 600 }}>{account.id}</td>
                      <td>
                        {account.avatarUrl ? (
                          <img
                            src={account.avatarUrl}
                            alt={account.fullName || account.username}
                            className="account-avatar"
                          />
                        ) : (
                          <div className="account-avatar-placeholder">
                            {(account.fullName || account.username || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{account.fullName}</td>
                      <td>{account.email}</td>
                      <td>{account.phoneNumber || "-"}</td>
                      <td>
                        <span
                          className="account-badge"
                          style={{
                            background: roleStyle.bg,
                            color: roleStyle.color,
                          }}
                        >
                          {roleStyle.text}
                        </span>
                      </td>
                      <td>
                        <span
                          className="account-badge"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                          }}
                        >
                          {statusStyle.text}
                        </span>
                      </td>
                      <td style={{ color: "#6b7280" }}>{account.createdAt}</td>
                      <td>
                        <div className="account-actions">
                          <button
                            onClick={() => handleToggleStatus(account.id)}
                            disabled={updatingId === account.id}
                            className="account-btn"
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
                    <td colSpan={9} className="account-table-empty">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="account-pagination">
            <div className="account-pagination-info">
              {startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)} of{" "}
              {filteredAccounts.length}
            </div>

            <div className="account-pagination-controls">
              <div className="account-rows-select">
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

              <div className="account-page-nav">
                <button
                  onClick={() => goto(page - 1)}
                  disabled={page === 1}
                  className="account-page-btn"
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
                <span className="account-page-text">
                  {page}/{totalPages}
                </span>
                <button
                  onClick={() => goto(page + 1)}
                  disabled={page === totalPages}
                  className="account-page-btn"
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
