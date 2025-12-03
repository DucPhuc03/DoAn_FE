import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function PendingManagement() {
  // Fake data
  const [pendingPosts, setPendingPosts] = useState([
    {
      id: 1,
      title: "Xe đạp cũ cần trao đổi",
      category: "Xe",
      author: "Nguyễn Văn A",
      date: "15-01-2025",
      image: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    },
    {
      id: 2,
      title: "Bàn ghế gỗ tự nhiên",
      category: "Nội thất",
      author: "Trần Thị B",
      date: "14-01-2025",
      image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
    },
    {
      id: 3,
      title: "Laptop Dell cũ",
      category: "Điện tử",
      author: "Lê Văn C",
      date: "13-01-2025",
      image: "https://images.pexels.com/photos/18104/pexels-photo.jpg",
    },
    {
      id: 4,
      title: "Quần áo trẻ em",
      category: "Quần áo",
      author: "Phạm Thị D",
      date: "12-01-2025",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    },
    {
      id: 5,
      title: "Sách giáo khoa lớp 10",
      category: "Sách",
      author: "Hoàng Văn E",
      date: "11-01-2025",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
    },
    {
      id: 6,
      title: "Đồ chơi LEGO",
      category: "Đồ chơi",
      author: "Vũ Thị F",
      date: "10-01-2025",
      image:
        "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg",
    },
    {
      id: 7,
      title: "Tủ lạnh cũ",
      category: "Đồ gia dụng",
      author: "Đỗ Văn G",
      date: "09-01-2025",
      image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
    },
    {
      id: 8,
      title: "Giày thể thao Nike",
      category: "Thể thao",
      author: "Bùi Thị H",
      date: "08-01-2025",
      image: "https://images.pexels.com/photos/863926/pexels-photo-863926.jpeg",
    },
    {
      id: 9,
      title: "Đồ dùng học tập",
      category: "Đồ dùng học tập",
      author: "Ngô Văn I",
      date: "07-01-2025",
      image:
        "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg",
    },
    {
      id: 10,
      title: "Máy tính bảng iPad",
      category: "Điện tử",
      author: "Lý Thị K",
      date: "06-01-2025",
      image: "https://images.pexels.com/photos/6078124/pexels-photo-6078124.jpeg",
    },
    {
      id: 11,
      title: "Tủ quần áo gỗ",
      category: "Nội thất",
      author: "Đinh Văn L",
      date: "05-01-2025",
      image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
    },
    {
      id: 12,
      title: "Xe máy cũ",
      category: "Xe",
      author: "Võ Thị M",
      date: "04-01-2025",
      image: "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    },
    {
      id: 13,
      title: "Áo khoác mùa đông",
      category: "Quần áo",
      author: "Dương Văn N",
      date: "03-01-2025",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    },
    {
      id: 14,
      title: "Bộ sách văn học",
      category: "Sách",
      author: "Hồ Thị O",
      date: "02-01-2025",
      image: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
    },
    {
      id: 15,
      title: "Bàn học trẻ em",
      category: "Nội thất",
      author: "Trương Văn P",
      date: "01-01-2025",
      image: "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pendingPosts;
    return pendingPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const category = (post.category || "").toLowerCase();
      const author = (post.author || "").toLowerCase();
      const idText = String(post.id ?? "").toLowerCase();
      return (
        title.includes(q) ||
        category.includes(q) ||
        author.includes(q) ||
        idText.includes(q)
      );
    });
  }, [pendingPosts, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = filteredPosts.slice(startIndex, endIndex);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function handleView(id) {
    // TODO: Navigate to post detail
    alert(`Xem chi tiết bài đăng ID: ${id}`);
  }

  function handleApprove(id) {
    if (!window.confirm("Bạn có chắc muốn duyệt bài đăng này?")) return;
    setPendingPosts((prev) => prev.filter((post) => post.id !== id));
    if (page > 1 && pageData.length === 1) {
      setPage(page - 1);
    }
    alert(`Đã duyệt bài đăng ID: ${id}`);
  }

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa bài đăng này?")) return;
    setPendingPosts((prev) => prev.filter((post) => post.id !== id));
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
                      width: "120px",
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
                      {post.image ? (
                        <img
                          src={post.image}
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
                      {post.category}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {post.author}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {post.date}
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
                          onClick={() => handleView(post.id)}
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
                        <button
                          onClick={() => handleApprove(post.id)}
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
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
