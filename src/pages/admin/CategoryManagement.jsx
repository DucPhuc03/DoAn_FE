import React from 'react';
import Sidebar from '../../components/Sidebar';
import './PostManagement.css'; // dùng chung CSS

export default function CategoryManagement() {
  const initialData = React.useMemo(() => [
    { id: 1, name: 'Xe máy' },
    { id: 2, name: 'Xe ô tô' },
    { id: 3, name: 'Đồ gia dụng' },
    { id: 4, name: 'Điện tử' },
    { id: 5, name: 'Quần áo' },
    { id: 6, name: 'Sách' },
    { id: 7, name: 'Đồ chơi' },
    { id: 8, name: 'Nội thất' },
    { id: 9, name: 'Thực phẩm' },
    { id: 10, name: 'Thể thao' },
  ], []);

  const [data, setData] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState('');
  const [query, setQuery] = React.useState('');
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
    return data.filter(item => item.name.toLowerCase().includes(q));
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function editCategory(id) {
    const item = data.find(d => d.id === id);
    console.log('Sửa danh mục', id, item);
  }

  function deleteCategory(id) {
    const item = data.find(d => d.id === id);
    console.log('Xóa danh mục (demo)', id, item);
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
    <div className="pm-root">
      <Sidebar active="cats" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Quản lý danh mục</h1>
          </div>

          {/* Search row with single Add button on right; use class 'spaced' to add top margin */}
          <div className="search-row spaced">
            <div className="input-wrapper">
              <input
                className="pm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm kiếm..."
                aria-label="Tìm danh mục"
              />

              <img
                src="/clear_search_icon.png"
                alt="Clear"
                className={`clear-icon ${inputValue ? 'visible' : ''}`}
                onClick={clearSearch}
              />

              <img
                src="/search_icon.png"
                alt="Search"
                className="search-icon"
                onClick={applySearch}
              />
            </div>

            <div className="add-btn-wrap">
              <button
                type="button"
                className="add-category-btn"
                onClick={() => console.log('Thêm danh mục (demo)')}
              >
                Thêm danh mục
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: '12%' }} />   {/* STT */}
                <col style={{ width: '48%' }} />  {/* Tên danh mục */}
                <col style={{ width: '20%' }} />  {/* Sửa */}
                <col style={{ width: '20%' }} />  {/* Xóa */}
              </colgroup>

              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Chỉnh sửa</th>
                  <th>Xóa</th>
                </tr>
              </thead>

              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td className="cell-strong">{(page - 1) * perPage + idx + 1}</td>
                    <td>{row.name}</td>
                    <td>
                      <button className="view-btn" onClick={() => editCategory(row.id)}>Sửa</button>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => deleteCategory(row.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="no-data">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => goto(page - 1)} disabled={page === 1} className="page-btn">{'<'}</button>

            {visiblePages.map((p) => (
              <button key={p} onClick={() => goto(p)} className={`page-btn ${p === page ? 'active' : ''}`}>{p}</button>
            ))}

            <button onClick={() => goto(page + 1)} disabled={page === totalPages} className="page-btn">{'>'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}