import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getPostAdmin,
  updateStatusPost,
  deletePost,
} from "../../service/post/PostService";

export default function PendingManagement() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");
      const response = await getPostAdmin();
      setPosts(response?.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.message || "Không thể tải danh sách bài đăng."
      );
    } finally {
      setLoading(false);
    }
  }

  const waitingPosts = useMemo(
    () => posts.filter((p) => p.postStatus === "WAITING"),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return waitingPosts;
    return waitingPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const username = (post.username || "").toLowerCase();
      const categoryName = (post.category?.name || "").toLowerCase();
      const idText = String(post.id ?? "").toLowerCase();
      return (
        title.includes(q) ||
        username.includes(q) ||
        categoryName.includes(q) ||
        idText.includes(q)
      );
    });
  }, [waitingPosts, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = filteredPosts.slice(startIndex, endIndex);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  async function handleApprove(id) {
    if (!window.confirm("Bạn có chắc muốn duyệt bài đăng này?")) return;
    try {
      setUpdatingId(id);
      await updateStatusPost(id, "AVAILABLE");
      await loadPosts();
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          "Không thể duyệt bài đăng. Vui lòng thử lại."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa bài đăng này?")) return;
    try {
      setUpdatingId(id);
      await deletePost(id);
      await loadPosts();
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          "Không thể xóa bài đăng. Vui lòng thử lại."
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
      <Sidebar active="pending" />

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
              Quản lý bài đăng chờ duyệt
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
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#6b7280",
                fontSize: "15px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              Đang tải bài đăng...
            </div>
          ) : (
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
                        width: "120px",
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
                      Tiêu đề
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
                      Danh mục
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
                      Người đăng
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
                      Ngày đăng
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
                  {pageData.map((post) => (
                    <tr
                      key={post.id}
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
                        {post.id}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "8px",
                              background: "#f3f4f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              color: "#9ca3af",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            Không có
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
                        {post.title}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {post.category?.name || "-"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                        }}
                      >
                        {post.username}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        {post.postDate}
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
                            onClick={() => handleApprove(post.id)}
                            disabled={updatingId === post.id}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #22c55e",
                              background: "#ffffff",
                              color: "#22c55e",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor:
                                updatingId === post.id
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s",
                              opacity: updatingId === post.id ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (updatingId !== post.id) {
                                e.currentTarget.style.background = "#22c55e";
                                e.currentTarget.style.color = "#ffffff";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#22c55e";
                            }}
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={updatingId === post.id}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "1px solid #dc2626",
                              background: "#ffffff",
                              color: "#dc2626",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor:
                                updatingId === post.id
                                  ? "not-allowed"
                                  : "pointer",
                              transition: "all 0.2s",
                              opacity: updatingId === post.id ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (updatingId !== post.id) {
                                e.currentTarget.style.background = "#dc2626";
                                e.currentTarget.style.color = "#ffffff";
                              }
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
                  ))}

                  {pageData.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
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
          )}

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
              {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of{" "}
              {filteredPosts.length}
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
