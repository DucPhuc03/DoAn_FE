import React from "react";
import Sidebar from "../../components/Sidebar";
import "./PendingManagement.css";

const PendingManagement = () => {
  // Fake data
  const initialData = React.useMemo(
    () => [
      {
        id: 1,
        title: "Xe đạp cũ cần trao đổi",
        category: "Xe",
        author: "Nguyễn Văn A",
        date: "15-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        title: "Bàn ghế gỗ tự nhiên",
        category: "Nội thất",
        author: "Trần Thị B",
        date: "14-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        title: "Laptop Dell cũ",
        category: "Điện tử",
        author: "Lê Văn C",
        date: "13-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        title: "Quần áo trẻ em",
        category: "Quần áo",
        author: "Phạm Thị D",
        date: "12-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 5,
        title: "Sách giáo khoa lớp 10",
        category: "Sách",
        author: "Hoàng Văn E",
        date: "11-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 6,
        title: "Đồ chơi LEGO",
        category: "Đồ chơi",
        author: "Vũ Thị F",
        date: "10-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 7,
        title: "Tủ lạnh cũ",
        category: "Đồ gia dụng",
        author: "Đỗ Văn G",
        date: "09-01-2025",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 8,
        title: "Giày thể thao Nike",
        category: "Thể thao",
        author: "Bùi Thị H",
        date: "08-01-2025",
        image: "https://via.placeholder.com/150",
      },
    ],
    []
  );

  const [data, setData] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const perPage = 5;

  function clearSearch() {
    setInputValue("");
    setQuery("");
    setPage(1);
  }

  function applySearch() {
    setQuery(inputValue.trim());
    setPage(1);
  }

  function onInputKeyDown(e) {
    if (e.key === "Enter") applySearch();
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.id.toString().includes(q)
      );
    });
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function handleView(id) {
    // TODO: Navigate to post detail
    console.log("View post:", id);
    alert(`Xem chi tiết bài đăng ID: ${id}`);
  }

  function handleApprove(id) {
    // TODO: Call API to approve
    console.log("Approve post:", id);
    setData((prev) => prev.filter((item) => item.id !== id));
    alert(`Đã duyệt bài đăng ID: ${id}`);
  }

  function handleDelete(id) {
    // TODO: Call API to delete
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài đăng ID: ${id}?`)) {
      console.log("Delete post:", id);
      setData((prev) => prev.filter((item) => item.id !== id));
      alert(`Đã xóa bài đăng ID: ${id}`);
    }
  }

  function getVisiblePages(total, current) {
    if (total <= 3) return Array.from({ length: total }).map((_, i) => i + 1);
    if (current === 1) return [1, 2, 3];
    if (current === total) return [total - 2, total - 1, total];
    return [current - 1, current, current + 1];
  }
  const visiblePages = getVisiblePages(totalPages, page);

  return (
    <div className="pm-root">
      <Sidebar active="pending" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Quản lý bài đăng chờ duyệt</h1>
          </div>

          <div className="search-row">
            <div className="input-wrapper">
              <input
                className="pm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm bài đăng"
              />

              <img
                src="/clear_search_icon.png"
                alt="Clear"
                className={`clear-icon ${inputValue ? "visible" : ""}`}
                onClick={clearSearch}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") clearSearch();
                }}
              />

              <img
                src="/search_icon.png"
                alt="Search"
                className="search-icon"
                onClick={applySearch}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") applySearch();
                }}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Người đăng</th>
                  <th>Ngày đăng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <td className="cell-strong">{row.id}</td>
                    <td>
                      <img src={row.image} alt="" className="img-thumb" />
                    </td>
                    <td>{row.title}</td>
                    <td>{row.category}</td>
                    <td>{row.author}</td>
                    <td>{row.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-icon-btn view-btn"
                          onClick={() => handleView(row.id)}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          className="action-icon-btn approve-btn"
                          onClick={() => handleApprove(row.id)}
                          title="Duyệt"
                        >
                          ✓
                        </button>
                        <button
                          className="action-icon-btn delete-btn"
                          onClick={() => handleDelete(row.id)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-data">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => goto(page - 1)}
              disabled={page === 1}
              className="page-btn"
            >
              {"<"}
            </button>

            {visiblePages.map((p) => (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`page-btn ${p === page ? "active" : ""}`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goto(page + 1)}
              disabled={page === totalPages}
              className="page-btn"
            >
              {">"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PendingManagement;
