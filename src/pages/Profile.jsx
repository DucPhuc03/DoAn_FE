import React, { useState } from "react";
import Header from "../components/Header";
import { FaMapMarkerAlt, FaRegHeart, FaExchangeAlt, FaUserFriends, FaUserPlus } from "react-icons/fa";

// Mock Data
const userData = {
  avatar: "https://via.placeholder.com/160x160.png?text=Avatar",
  name: "Nguyễn Văn A",
  location: "Hà Nội, Việt Nam",
  interest: "Đồ công nghệ",
  following: 2,
  followers: 2,
  exchanges: 2,
  intro: "Xin chào! Tôi thích trao đổi đồ điện tử và công nghệ mới. Tham gia trao đổi, mình sẽ nhiệt tình hỗ trợ!",
};
const userTabs = ["Bài đăng", "Đã thích", "Đánh giá"];
const userCards = [
  {
    title: "Laptop Macbook Pro M1",
    user: "Nguyễn Văn B",
    distance: "2km",
    image: "https://via.placeholder.com/240x160.png?text=Product+1",
  },
  {
    title: "iPhone 12 cũ",
    user: "Trần Thị C",
    distance: "5km",
    image: "https://via.placeholder.com/240x160.png?text=Product+2",
  },
  {
    title: "Tai nghe Bluetooth",
    user: "Phạm Văn D",
    distance: "3km",
    image: "https://via.placeholder.com/240x160.png?text=Product+3",
  },
];

const primary = "#2563eb";
const secondary = "#333";
const bgProfile = "#f6f8fa";

const Profile = () => {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ background: bgProfile, minHeight: "100vh" }}>
      <Header />
      {/* Profile Container */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: '36px 12px 28px' }}>
        {/* Box */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 6px 24px #e3e7ed4d",
            padding: "32px 36px 30px 36px",
            marginTop: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {/* Avatar */}
            <img
              src={userData.avatar}
              alt="Avatar"
              style={{
                width: 128, height: 128, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 14px #2563eb29",
                border: `4px solid ${primary}`,
                flexShrink: 0,
              }}
            />
            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 26, color: secondary }}>{userData.name}</div>
              <div style={{ display: "flex", gap: 15, margin: "12px 0 20px" }}>
                <span style={{ display: "flex", alignItems: "center", background: "#edf4fd", borderRadius: 6, padding: "6px 13px", fontWeight: 500, color: primary, fontSize: 15 }}>
                  <FaMapMarkerAlt style={{ marginRight: 7 }} /> Địa điểm
                </span>
                <span style={{ display: "flex", alignItems: "center", background: "#fef3f6", borderRadius: 6, padding: "6px 13px", fontWeight: 500, color: "#d72660", fontSize: 15 }}>
                  <FaRegHeart style={{ marginRight: 7 }} /> Quan tâm
                </span>
                <button style={{ display: "flex", alignItems: "center", background: primary, color: "#fff", border: "none", padding: "6px 18px", borderRadius: 8, fontWeight: 500, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #2563eb25" }}>
                  <FaUserPlus style={{ marginRight: 8, fontSize: 17 }} />Theo dõi
                </button>
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: 38, marginBottom: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: primary, marginBottom: 1, letterSpacing: 1 }}>{userData.exchanges}</div>
                  <div style={{ color: secondary, fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><FaExchangeAlt /> Đã trao đổi</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: primary, marginBottom: 1, letterSpacing: 1 }}>{userData.followers}</div>
                  <div style={{ color: secondary, fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><FaUserFriends /> Người theo dõi</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: primary, marginBottom: 1, letterSpacing: 1 }}>{userData.following}</div>
                  <div style={{ color: secondary, fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><FaUserPlus /> Đang theo dõi</div>
                </div>
              </div>
            </div>
          </div>
          {/* Intro */}
          <div style={{ margin: "30px 2px 0 2px", paddingTop: 14, borderTop: "1px solid #edf0fb" }}>
            <div style={{ color: secondary, fontWeight: 600, fontSize: 16, marginBottom: 3 }}>Giới thiệu</div>
            <div style={{ color: "#495057", fontStyle: "italic", fontSize: 15 }}>{userData.intro}</div>
          </div>
        </div>
        {/* Tabs + Cards */}
        <div
          style={{
            margin: "28px 0 0",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 18px #e3e7ed33",
            minHeight: 340,
            padding: "0 3px 7px 3px",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: 7, padding: "22px 34px 0 34px", borderBottom: "1px solid #f2f2f2" }}>
            {userTabs.map((t, idx) => (
              <button
                key={t}
                style={{
                  padding: "10px 30px",
                  border: "none",
                  borderRadius: 9,
                  background: tab === idx ? primary : "#f2f6fb",
                  color: tab === idx ? "#fff" : primary,
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: -1,
                  boxShadow: tab === idx ? "0 2px 12px #2563eb27" : undefined,
                  borderBottom: tab === idx ? `4px solid ${primary}` : "4px solid transparent",
                  cursor: "pointer",
                  transition: 'all .2s',
                }}
                onClick={() => setTab(idx)}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 30, minHeight: 220, flexWrap: "wrap", justifyContent: 'flex-start', padding: 37 }}>
            {userCards.map((card, i) => (
              <div
                key={i}
                style={{
                  width: 260,
                  background: "#f6f9ff",
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 24,
                  boxShadow: "0 3px 14px #2563eb18",
                  transition: "transform .18s, box-shadow .18s",
                  cursor: "pointer",
                  border: `1.5px solid #e5eaf5` ,
                  display: 'flex', flexDirection: 'column', alignItems: 'start',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-7px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 24px #2563eb2f';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 3px 14px #2563eb18';
                }}
              >
                <img
                  style={{ width: "100%", height: 148, objectFit: "cover", borderRadius: 10, boxShadow: "0 2px 7px #a1bac327" }}
                  src={card.image}
                  alt={card.title}
                />
                <div style={{ marginTop: 13, fontWeight: 700, fontSize: 17, color: secondary }}>{card.title}</div>
                <div style={{ color: primary, fontWeight: 500, fontSize: 15, margin: '2px 0 0 0' }}>{card.user}</div>
                <div style={{ color: "#687288", fontSize: 14, fontStyle: 'italic' }}>Khoảng cách: {card.distance}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 5, marginBottom: 10 }}>
            <button
              style={{
                padding: "13px 44px",
                borderRadius: 10,
                fontWeight: 600,
                border: "none",
                background: primary,
                color: "#fff",
                fontSize: 16,
                boxShadow: '0 1px 7px #2563eb25',
                cursor: 'pointer',
                transition: 'background .14s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={e => (e.currentTarget.style.background = primary)}
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
