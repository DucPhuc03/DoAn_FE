import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getPostAdmin,
  updateStatusPost,
  deletePost,
} from "../../service/PostService";
import "../../css/PendingManagement.css";

export default function PendingManagement() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
    <div className="pending-layout">
      <Sidebar active="pending" />

      <main className="pending-main">
        <div className="pending-container">
          {/* Header */}
          <div className="pending-header">
            <h1 className="pending-title">Quản lý bài đăng chờ duyệt</h1>
          </div>

          {/* Top Bar: Filter, Search */}
          <div className="pending-topbar">
            <button className="pending-filter-btn" title="Filter">
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

            <div className="pending-search-wrapper">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="pending-search-input"
              />
              <svg
                className="pending-search-icon"
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

          {error && <div className="pending-error">{error}</div>}

          {/* Table */}
          {loading ? (
            <div className="pending-loading">Đang tải bài đăng...</div>
          ) : (
            <div className="pending-table-wrapper">
              <table className="pending-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th style={{ width: "120px" }}>Ảnh</th>
                    <th>Tiêu đề</th>
                    <th style={{ width: "150px" }}>Danh mục</th>
                    <th style={{ width: "150px" }}>Người đăng</th>
                    <th style={{ width: "130px" }}>Ngày đăng</th>
                    <th style={{ width: "220px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((post) => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 600 }}>{post.id}</td>
                      <td>
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="pending-image"
                          />
                        ) : (
                          <div className="pending-image-placeholder">
                            Không có
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{post.title}</td>
                      <td>{post.category?.name || "-"}</td>
                      <td>{post.username}</td>
                      <td style={{ color: "#6b7280" }}>{post.postDate}</td>
                      <td>
                        <div className="pending-actions">
                          <button
                            onClick={() => handleApprove(post.id)}
                            disabled={updatingId === post.id}
                            className="pending-btn pending-btn-approve"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={updatingId === post.id}
                            className="pending-btn pending-btn-delete"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="pending-table-empty">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="pending-pagination">
            <div className="pending-pagination-info">
              {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of{" "}
              {filteredPosts.length}
            </div>

            <div className="pending-pagination-controls">
              <div className="pending-rows-select">
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

              <div className="pending-page-nav">
                <button
                  onClick={() => goto(page - 1)}
                  disabled={page === 1}
                  className="pending-page-btn"
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
                <span className="pending-page-text">
                  {page}/{totalPages}
                </span>
                <button
                  onClick={() => goto(page + 1)}
                  disabled={page === totalPages}
                  className="pending-page-btn"
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
