import React from "react";
import Sidebar from "../../components/Sidebar";

export default function PendingManagement() {
  const placeholder =
    "https://images.pexels.com/photos/4246105/pexels-photo-4246105.jpeg";

  const initialData = React.useMemo(
    () => [
      {
        id: 1,
        title: "Bài chờ duyệt 1",
        category: "Xe",
        author: "Người A",
        date: "01-11-2025",
        image: placeholder,
      },
      {
        id: 2,
        title: "Bài chờ duyệt 2",
        category: "Đồ gia dụng",
        author: "Người B",
        date: "02-11-2025",
        image: placeholder,
      },
      {
        id: 3,
        title: "Bài chờ duyệt 3",
        category: "Quần áo",
        author: "Người C",
        date: "03-11-2025",
        image: placeholder,
      },
      {
        id: 4,
        title: "Bài chờ duyệt 4",
        category: "Điện tử",
        author: "Người D",
        date: "04-11-2025",
        image: placeholder,
      },
      {
        id: 5,
        title: "Bài chờ duyệt 5",
        category: "Sách",
        author: "Người E",
        date: "05-11-2025",
        image: placeholder,
      },
      {
        id: 6,
        title: "Bài chờ duyệt 6",
        category: "Đồ chơi",
        author: "Người F",
        date: "06-11-2025",
        image: placeholder,
      },
      {
        id: 7,
        title: "Bài chờ duyệt 7",
        category: "Nội thất",
        author: "Người G",
        date: "07-11-2025",
        image: placeholder,
      },
      {
        id: 8,
        title: "Bài chờ duyệt 8",
        category: "Thực phẩm",
        author: "Người H",
        date: "08-11-2025",
        image: placeholder,
      },
      {
        id: 9,
        title: "Bài chờ duyệt 9",
        category: "Đồ dùng học tập",
        author: "Người I",
        date: "09-11-2025",
        image: placeholder,
      },
      {
        id: 10,
        title: "Bài chờ duyệt 10",
        category: "Thể thao",
        author: "Người J",
        date: "10-11-2025",
        image: placeholder,
      },
    ],
    []
  );

  const [data] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 5;

  function clearSearch() {
    setInputValue('');
    setQuery('');
    setPage(1);
  }

  function applySearch() {
    setQuery(inputValue.trim());
    setPage(1);
  }

  function onInputKeyDown(e) {
    if (e.key === 'Enter') applySearch();
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function viewItem(id) {
    const item = data.find((d) => d.id === id);
    console.log("Xem bài:", id, item);
    // TODO: mở modal / chuyển trang xem chi tiết
  }

  // visible pages helper (3 pages centered)
  function getVisiblePages(total, current) {
    if (total <= 3) return Array.from({ length: total }).map((_, i) => i + 1);
    if (current === 1) return [1, 2, 3];
    if (current === total) return [total - 2, total - 1, total];
    return [current - 1, current, current + 1];
  }
  const visiblePages = getVisiblePages(totalPages, page);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fef3c7 0%, #f9fafb 40%, #e0f2fe 100%)",
      }}
    >
      <Sidebar active="pending" />

      <main style={{ flex: 1 }}>
        <div
          style={{
            padding: "24px 32px",
            maxWidth: 1120,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#92400e",
                  marginBottom: 4,
                }}
              >
                Bảng điều khiển / Chờ duyệt
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#7c2d12",
                  }}
                >
                  Bài đăng chờ duyệt
                </h2>
                <span
                  style={{
                    fontSize: 13,
                    color: "#92400e",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.4)",
                  }}
                >
                  {data.length} bài
                </span>
              </div>
            </div>
          </div>

          {/* Card danh sách */}
          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(6px)",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 18px 40px rgba(124,45,18,0.22)",
              border: "1px solid rgba(248,196,113,0.6)",
            }}
          >
            {/* Thanh tìm kiếm */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm theo tiêu đề, người đăng, danh mục..."
                aria-label="Tìm kiếm chờ duyệt"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #fbbf24",
                  fontSize: 14,
                  outline: "none",
                  background:
                    "linear-gradient(135deg, #fffbeb 0%, #fefce8 40%, #fef9c3 100%)",
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={clearSearch}
              >
                Xóa
              </button>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={applySearch}
              >
                Tìm
              </button>
            </div>

            {/* Header bảng */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1.6fr 1.1fr 1.1fr 1fr 120px",
                padding: "8px 12px",
                borderRadius: 12,
                background:
                  "linear-gradient(90deg, #fef3c7 0%, #fffbeb 50%, #fef9c3 100%)",
                fontSize: 13,
                fontWeight: 600,
                color: "#92400e",
                marginBottom: 8,
                border: "1px solid rgba(245,158,11,0.35)",
              }}
            >
              <div>Hình ảnh</div>
              <div>Tiêu đề</div>
              <div>Phân loại</div>
              <div>Người đăng</div>
              <div>Thời gian</div>
              <div style={{ textAlign: "right" }}>Hành động</div>
            </div>

            {/* Dòng dữ liệu */}
            <div>
              {pageData.map((row, idx) => (
                <div
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "110px 1.6fr 1.1fr 1.1fr 1fr 120px",
                    alignItems: "center",
                    padding: "10px 12px",
                    borderRadius: 14,
                    background:
                      idx % 2 === 0
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,251,235,0.95)",
                    border: "1px solid rgba(248,250,252,0.9)",
                    marginBottom: 6,
                  }}
                >
                  <div>
                    <img
                      src={row.image}
                      alt={row.title}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 14,
                        objectFit: "cover",
                        border: "1px solid rgba(248,196,113,0.6)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#111827",
                      fontWeight: 600,
                      paddingRight: 8,
                    }}
                  >
                    {row.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#92400e" }}>
                    {row.category}
                  </div>
                  <div style={{ fontSize: 13, color: "#374151" }}>
                    {row.author}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>
                    {row.date}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 6,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => viewItem(row.id)}
                    >
                      Xem
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                    >
                      Duyệt
                    </button>
                  </div>
                </div>
              ))}

              {pageData.length === 0 && (
                <div
                  style={{
                    padding: "32px 12px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  Không có dữ liệu.
                </div>
              )}
            </div>

            {/* Phân trang */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 6,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => goto(page - 1)}
                disabled={page === 1}
                className="btn btn-sm btn-outline-secondary"
              >
                {"<"}
              </button>

              {visiblePages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goto(p)}
                  className={`btn btn-sm ${
                    p === page ? "btn-warning" : "btn-outline-secondary"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goto(page + 1)}
                disabled={page === totalPages}
                className="btn btn-sm btn-outline-secondary"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}