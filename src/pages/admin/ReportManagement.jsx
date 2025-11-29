import React from 'react';
import Sidebar from '../../components/Sidebar';
import './PostManagement.css'; // reuse the same CSS

export default function ReportManagement() {
  const initialData = React.useMemo(() => [
    { id: 1, reported: 'Người A', email: 'a@example.com', reason: 'Spam', locked: false },
    { id: 2, reported: 'Người B', email: 'b@example.com', reason: 'Hành vi xúc phạm', locked: true },
    { id: 3, reported: 'Người C', email: 'c@example.com', reason: 'Báo cáo sai', locked: false },
    { id: 4, reported: 'Người D', email: 'd@example.com', reason: 'Lừa đảo', locked: false },
    { id: 5, reported: 'Người E', email: 'e@example.com', reason: 'Nội dung không phù hợp', locked: true },
    { id: 6, reported: 'Người F', email: 'f@example.com', reason: 'Quấy rối', locked: false },
    { id: 7, reported: 'Người G', email: 'g@example.com', reason: 'Spam', locked: false },
    { id: 8, reported: 'Người H', email: 'h@example.com', reason: 'Hành vi xúc phạm', locked: true },
    { id: 9, reported: 'Người I', email: 'i@example.com', reason: 'Lừa đảo', locked: false },
    { id: 10, reported: 'Người J', email: 'j@example.com', reason: 'Nội dung không phù hợp', locked: false },
  ], []);

  const [data, setData] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
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
    return data
      .filter(item => {
        if (filter === 'unlocked') return !item.locked;
        if (filter === 'locked') return item.locked;
        return true;
      })
      .filter(item => {
        if (!q) return true;
        return item.reported.toLowerCase().includes(q)
          || item.email.toLowerCase().includes(q)
          || item.reason.toLowerCase().includes(q);
      });
  }, [data, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function toggleLock(id) {
    setData(prev => prev.map(item =>
      item.id === id ? { ...item, locked: !item.locked } : item
    ));
  }

  function warnUser(id) {
    const user = data.find(d => d.id === id);
    console.log('Cảnh cáo:', user?.reported);
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
      <Sidebar active="report" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Báo cáo</h1>
          </div>

          <div className="search-row">
            <div className="input-wrapper">
              <input
                className="pm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm theo người bị báo cáo, email, lý do..."
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

            <div className="filter-group">
              <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setPage(1); }}>
                Tất cả
              </button>
              <button className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`} onClick={() => { setFilter('unlocked'); setPage(1); }}>
                Không khóa
              </button>
              <button className={`filter-btn ${filter === 'locked' ? 'active' : ''}`} onClick={() => { setFilter('locked'); setPage(1); }}>
                Đã khóa
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: '22%' }} /> 
                <col style={{ width: '28%' }} />
                <col style={{ width: '24%' }} />
                <col style={{ width: '14%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Người bị báo cáo</th>
                  <th>Email</th>
                  <th>Lý do báo cáo</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td>{row.reported}</td>
                    <td>{row.email}</td>
                    <td>{row.reason}</td>
                    <td>
                      <button className="action-btn" onClick={() => warnUser(row.id)}>
                        Cảnh cáo
                      </button>
                    </td>
                    <td>
                      <button
                        className={`action-btn ${row.locked ? 'locked' : ''}`}
                        onClick={() => toggleLock(row.id)}
                      >
                        {row.locked ? 'Bỏ khóa' : 'Khóa'}
                      </button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr><td colSpan={5} className="no-data">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => goto(page - 1)} disabled={page === 1} className="page-btn">{'<'}</button>

            {visiblePages.map(p => (
              <button
                key={p}
                onClick={() => goto(p)}
                className={`page-btn ${p === page ? 'active' : ''}`}
              >
                {p}
              </button>
            ))}

            <button onClick={() => goto(page + 1)} disabled={page === totalPages} className="page-btn">{'>'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
