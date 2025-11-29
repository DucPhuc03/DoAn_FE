import React from 'react';
import Sidebar from '../../components/Sidebar';
import './PostManagement.css'; // reuse existing CSS

export default function PendingManagement() {
  const placeholder = '/mnt/data/887cc92c-3a5f-4b42-9bc2-be399aca267b.png';

  const initialData = React.useMemo(() => [
    { id: 1, title: 'Bài chờ duyệt 1', category: 'Xe', author: 'Người A', date: '01-11-2025', image: placeholder },
    { id: 2, title: 'Bài chờ duyệt 2', category: 'Đồ gia dụng', author: 'Người B', date: '02-11-2025', image: placeholder },
    { id: 3, title: 'Bài chờ duyệt 3', category: 'Quần áo', author: 'Người C', date: '03-11-2025', image: placeholder },
    { id: 4, title: 'Bài chờ duyệt 4', category: 'Điện tử', author: 'Người D', date: '04-11-2025', image: placeholder },
    { id: 5, title: 'Bài chờ duyệt 5', category: 'Sách', author: 'Người E', date: '05-11-2025', image: placeholder },
    { id: 6, title: 'Bài chờ duyệt 6', category: 'Đồ chơi', author: 'Người F', date: '06-11-2025', image: placeholder },
    { id: 7, title: 'Bài chờ duyệt 7', category: 'Nội thất', author: 'Người G', date: '07-11-2025', image: placeholder },
    { id: 8, title: 'Bài chờ duyệt 8', category: 'Thực phẩm', author: 'Người H', date: '08-11-2025', image: placeholder },
    { id: 9, title: 'Bài chờ duyệt 9', category: 'Đồ dùng học tập', author: 'Người I', date: '09-11-2025', image: placeholder },
    { id: 10, title: 'Bài chờ duyệt 10', category: 'Thể thao', author: 'Người J', date: '10-11-2025', image: placeholder },
  ], []);

  const [data] = React.useState(initialData);
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
    return data.filter(item =>
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
    const item = data.find(d => d.id === id);
    console.log('Xem bài:', id, item);
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
    <div className="pm-root">
      <Sidebar active="pending" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Chờ duyệt</h1>
          </div>

          {/* Search row — NO filters here */}
          <div className="search-row">
            <div className="input-wrapper">
              <input
                className="pm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm chờ duyệt"
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
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: '17%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '12%' }} />
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
                  <tr key={row.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td><img src={row.image} alt="" className="img-thumb" /></td>
                    <td>{row.title}</td>
                    <td>{row.category}</td>
                    <td>{row.author}</td>
                    <td>{row.date}</td>
                    <td>
                      <button className="view-btn" onClick={() => viewItem(row.id)}>Xem</button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr><td colSpan={6} className="no-data">Không có dữ liệu</td></tr>
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