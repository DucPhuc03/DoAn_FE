// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdReport } from "react-icons/md";
import { RiUserFill } from "react-icons/ri";
import { BiCategory } from "react-icons/bi";
import "./Sidebar.css";

const menuItems = [
  {
    id: "posts",
    label: "Quản lý bài đăng",
    Icon: FaRegNewspaper,
    path: "/admin/post_management",
  },
  {
    id: "pending",
    label: "Chờ duyệt",
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

  function handleClick(item) {
    if (item.path) {
      navigate(item.path);
    }
    // still call external callback if provided (keeps previous API)
    if (onNavigate) onNavigate(item.id);
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="brand-logo">TD</div>
          <div className="brand-text">
            <span className="brand-title">TraoDoiDo</span>
            <span className="brand-subtitle">Bảng quản trị</span>
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
      </div>
    </aside>
  );
}
