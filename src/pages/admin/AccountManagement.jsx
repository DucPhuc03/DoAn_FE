import React from 'react';
import Sidebar from '../../components/Sidebar';
import './PostManagement.css'; // reuse the same CSS used by PostManagement

export default function AccountManagement() {
  // fake dataset for accounts
  const initialData = React.useMemo(() => [
    { id: 1, username: 'user01', email: 'user01@example.com', role: 'user', reports: 0, locked: false },
    { id: 2, username: 'nguyenvan', email: 'nv@example.com', role: 'user', reports: 2, locked: true },
    { id: 3, username: 'tranthi', email: 'tranthi@example.com', role: 'admin', reports: 0, locked: false },
    { id: 4, username: 'hotrokhach', email: 'helpdesk@example.com', role: 'user', reports: 1, locked: false },
    { id: 5, username: 'phamha', email: 'phamha@example.com', role: 'user', reports: 5, locked: true },
    { id: 6, username: 'admin01', email: 'admin01@example.com', role: 'admin', reports: 0, locked: false },
    { id: 7, username: 'leminh', email: 'leminh@example.com', role: 'user', reports: 3, locked: false },
    { id: 8, username: 'ngoclan', email: 'ngoclan@example.com', role: 'user', reports: 0, locked: false },
    { id: 9, username: 'phantri', email: 'phantri@example.com', role: 'user', reports: 7, locked: true },
    { id: 10, username: 'trananh', email: 'trananh@example.com', role: 'user', reports: 1, locked: false },
  ], []);

  const [data, setData] = React.useState(initialData);
  const [inputValue, setInputValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // 'all' | 'unlocked' | 'locked'
  const [page, setPage] = React.useState(1);
  const perPage = 5;

  // clear search (keeps current filter)
  function clearSearch() {
    setInputValue('');
    setQuery('');
    setPage(1);
  }

  // apply search
  function applySearch() {
    setQuery(inputValue.trim());
    setPage(1);
  }

  function onInputKeyDown(e) {
    if (e.key === 'Enter') applySearch();
  }

  // filter + search logic (search username/email/role)
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
        return item.username.toLowerCase().includes(q)
          || item.email.toLowerCase().includes(q)
          || item.role.toLowerCase().includes(q);
      });
  }, [data, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  // toggle lock/unlock (same behaviour as PostManagement)
  function toggleLock(id) {
    setData(prev => prev.map(item => item.id === id ? { ...item, locked: !item.locked } : item));
  }

  // visible pages helper (3 pages centered)
  function getVisiblePages(total, current) {
    if (total <= 3) return Array.from({ length: total }).map((_, i) => i + 1);
    if (current === 1) return [1, 2, 3];
    if (current === total) return [total - 2, total - 1, total];
    return [current - 1, current, current + 1];
  }
  const visiblePages = getVisiblePages(totalPages, page);

  // compute STT based on overall index (continues across pages)
  const startIndex = (page - 1) * perPage;

  return (
    <div className="pm-root">
      <Sidebar active="users" />

      <main className="pm-main">
        <div className="pm-wrapper">
          <div className="pm-header">
            <h1>Quản lý tài khoản</h1>
          </div>

          <div className="search-row">
            <div className="input-wrapper">
              <input
                className="pm-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm tài khoản"
              />

              <img
                src="/clear_search_icon.png"
                alt="Clear"
                className={`clear-icon ${inputValue ? 'visible' : ''}`}
                onClick={clearSearch}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') clearSearch(); }}
              />

              <img
                src="/search_icon.png"
                alt="Search"
                className="search-icon"
                onClick={applySearch}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') applySearch(); }}
              />
            </div>

            <div className="filter-group" role="radiogroup" aria-label="Bộ lọc trạng thái">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => { setFilter('all'); setPage(1); }}
                aria-pressed={filter === 'all'}
              >
                Tất cả
              </button>

              <button
                className={`filter-btn ${filter === 'unlocked' ? 'active' : ''}`}
                onClick={() => { setFilter('unlocked'); setPage(1); }}
                aria-pressed={filter === 'unlocked'}
              >
                Không khóa
              </button>

              <button
                className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
                onClick={() => { setFilter('locked'); setPage(1); }}
                aria-pressed={filter === 'locked'}
              >
                Đã khóa
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pm-table">
              <colgroup>
                <col style={{ width: '8%' }} />  {/* STT */}
                <col style={{ width: '24%' }} /> {/* Username */}
                <col style={{ width: '28%' }} /> {/* Email */}
                <col style={{ width: '12%' }} /> {/* Role */}
                <col style={{ width: '16%' }} /> {/* Reports */}
                <col style={{ width: '12%' }} /> {/* Action */}
              </colgroup>

              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Số lần bị báo cáo</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {pageData.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                    <td style={{ fontWeight: 600 }}>{startIndex + idx + 1}</td>
                    <td>{row.username}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>{row.reports}</td>
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
                  <tr>
                    <td colSpan={6} className="no-data">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => goto(page - 1)} disabled={page === 1} className="page-btn">{'<'}</button>

            {visiblePages.map((p) => (
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