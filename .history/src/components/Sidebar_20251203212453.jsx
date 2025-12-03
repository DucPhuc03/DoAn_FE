// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { FaRegNewspaper } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdReport } from "react-icons/md";
import { RiUserFill } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import "./Sidebar.css";

const menuItems = [
  {
    id: "pending",
    label: "Đang chờ duyệt",
    Icon: AiOutlineCheckCircle,
    path: "/admin/pending_management",
  },
  {
    id: "report",
    label: "Báo cáo",
    Icon: MdReport,
    path: "/admin/report_management",
  },
  {
    id: "users",
    label: "Quản lý tài khoản",
    Icon: RiUserFill,
    path: "/admin/account_management",
  },
  {
    id: "cats",
    label: "Quản lý danh mục",
    Icon: BiCategory,
    path: "/admin/category_management",
  },
];

export default function Sidebar({ active: activeProp = null, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminInfo, setAdminInfo] = React.useState({
    name: "Admin",
    avatarUrl: null,
  });

  // determine active from location if not explicitly provided by prop
  const activeFromLocation = React.useMemo(() => {
    const current = location.pathname || "";
    // try to match path exactly or by prefix
    const match = menuItems.find(
      (mi) => current === mi.path || current.startsWith(mi.path)
    );
    return match ? match.id : menuItems[0].id;
  }, [location.pathname]);

  const active = activeProp ?? activeFromLocation;

  React.useEffect(() => {
    try {
      // Thử lấy thông tin admin từ một số key phổ biến trong localStorage
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("userInfo") ||
        localStorage.getItem("admin");

      if (!rawUser) return;

      const parsed = JSON.parse(rawUser);
      const name =
        parsed.fullName ||
        parsed.username ||
        parsed.name ||
        parsed.displayName ||
        "Admin";
      const avatarUrl = parsed.avatarUrl || parsed.avatar || null;

      setAdminInfo({ name, avatarUrl });
    } catch {
      // ignore parse errors, keep default admin info
    }
  }, []);

  function handleClick(item) {
    if (item.path) {
      navigate(item.path);
    }
    // still call external callback if provided (keeps previous API)
    if (onNavigate) onNavigate(item.id);
  }

  function handleLogout() {
    // Xóa token, có thể bổ sung clear thêm state khác nếu cần
    try {
      Cookies.remove("access_token");
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    navigate("/login");
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-inner">
        <div className="sidebar-user">
          {adminInfo.avatarUrl ? (
            <img
              src={adminInfo.avatarUrl}
              alt={adminInfo.name}
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-avatar sidebar-user-initials">
              {(adminInfo.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="sidebar-user-text">
            <span className="sidebar-user-name" style={{ fontSize: "16px" }}>
              {adminInfo.name}
            </span>
          </div>
        </div>

        <nav className="menu" aria-label="Sidebar menu">
          <ul role="menu" className="menu-list">
            {menuItems.map((item) => {
              const isActive = item.id === active;
              const Icon = item.Icon;
              return (
                <li
                  key={item.id}
                  role="none"
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-current={isActive ? "true" : "false"}
                    className="menu-btn"
                    onClick={() => handleClick(item)}
                  >
                    <Icon
                      className="menu-icon"
                      aria-hidden="true"
                      focusable="false"
                    />
                    <span className="label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}
