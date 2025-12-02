import React from "react";
import Sidebar from "../../components/Sidebar";

export default function PostManagement() {
  const placeholder = "/mnt/data/887cc92c-3a5f-4b42-9bc2-be399aca267b.png";

  const initialData = React.useMemo(
    () => [
      {
        id: 1,
        title: "Bài đăng test 1",
        category: "Xe",
        author: "Người A",
        date: "01-11-2025",
        image: placeholder,
        locked: false,
      },
      {
        id: 2,
        title: "Bài đăng test 2",
        category: "Đồ gia dụng",
        author: "Người B",
        date: "02-11-2025",
        image: placeholder,
        locked: true,
      },
      {
        id: 3,
        title: "Bài đăng test 3",
        category: "Quần áo",
        author: "Người C",
        date: "03-11-2025",
        image: placeholder,
        locked: false,
      },
      {
        id: 4,
        title: "Bài đăng test 4",
        category: "Điện tử",
        author: "Người D",
        date: "04-11-2025",
        image: placeholder,
        locked: true,
      },
      {
        id: 5,
        title: "Bài đăng test 5",
        category: "Sách",
        author: "Người E",
        date: "05-11-2025",
        image: placeholder,
        locked: false,
      },
      {
        id: 6,
        title: "Bài đăng test 6",
        category: "Đồ chơi",
        author: "Người F",
        date: "06-11-2025",
        image: placeholder,
        locked: true,
      },
      {
        id: 7,
        title: "Bài đăng test 7",
        category: "Nội thất",
        author: "Người G",
        date: "07-11-2025",
        image: placeholder,
        locked: false,
      },
      {
        id: 8,
        title: "Bài đăng test 8",
        category: "Thực phẩm",
        author: "Người H",
        date: "08-11-2025",
        image: placeholder,
        locked: true,
      },
      {
        id: 9,
        title: "Bài đăng test 9",
        category: "Đồ dùng học tập",
        author: "Người I",
        date: "09-11-2025",
        image: placeholder,
        locked: false,
      },
      {
        id: 10,
        title: "Bài đăng test 10",
        category: "Thể thao",
        author: "Người J",
        date: "10-11-2025",
        image: placeholder,
        locked: true,
      },
    ],
    []
  );

  const [data, setData] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("all"); // 'all' | 'unlocked' | 'locked'
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
    return data
      .filter((item) => {
        if (filter === "unlocked") return !item.locked;
        if (filter === "locked") return item.locked;
        return true;
      })
      .filter((item) => {
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      });
  }, [data, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function toggleLock(id) {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
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
      <Sidebar active="posts" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Quản lý bài đăng</h1>
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

            <div
              className="filter-group"
              role="radiogroup"
              aria-label="Bộ lọc trạng thái"
            >
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => {
                  setFilter("all");
                  setPage(1);
                }}
                aria-pressed={filter === "all"}
              >
                Tất cả
              </button>

              <button
                className={`filter-btn ${
                  filter === "unlocked" ? "active" : ""
                }`}
                onClick={() => {
                  setFilter("unlocked");
                  setPage(1);
                }}
                aria-pressed={filter === "unlocked"}
              >
                Không khóa
              </button>

              <button
                className={`filter-btn ${filter === "locked" ? "active" : ""}`}
                onClick={() => {
                  setFilter("locked");
                  setPage(1);
                }}
                aria-pressed={filter === "locked"}
              >
                Đã khóa
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: "17%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Phân loại</th>
                  <th>Người đăng</th>
                  <th>Thời gian</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <td>
                      <img src={row.image} alt="" className="img-thumb" />
                    </td>
                    <td>{row.title}</td>
                    <td>{row.category}</td>
                    <td>{row.author}</td>
                    <td>{row.date}</td>
                    <td>
                      <button
                        className={`action-btn ${row.locked ? "locked" : ""}`}
                        onClick={() => toggleLock(row.id)}
                      >
                        {row.locked ? "Bỏ khóa" : "Khóa"}
                      </button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-data">
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
}
