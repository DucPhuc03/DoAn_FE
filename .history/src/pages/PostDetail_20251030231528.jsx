import React, { useState } from "react";
import Header from "../components/Header";
import { FaRegHeart, FaPaperPlane, FaTag, FaCalendarAlt, FaUser, FaShareAlt, FaMapMarkerAlt } from "react-icons/fa";

// Fake data
const post = {
  images: [
    "https://via.placeholder.com/900x600.png?text=Ảnh+1",
    "https://via.placeholder.com/900x600.png?text=Ảnh+2",
    "https://via.placeholder.com/900x600.png?text=Ảnh+3",
  ],
  title: "Laptop Macbook Pro M1 2020",
  category: "Điện tử / Laptop",
  description:
    "Macbook Pro M1 2020, bản 8GB/256GB. Máy đẹp 98%, pin ~200 chu kỳ. Full phụ kiện, dùng văn phòng cực mượt.",
  condition:
    "Ưu tiên trao đổi với iPhone đời từ 12 trở lên hoặc Kindle Oasis. Có thể thương lượng thêm.",
  owner: {
    avatar: "https://via.placeholder.com/44x44.png?text=U",
    name: "Nguyễn Văn B",
    date: "20/10/2025",
  },
};
const fakeComments = [
  {
    user: {
      avatar: "https://via.placeholder.com/36x36.png?text=A",
      name: "Mai Nhật A",
    },
    content: "Sản phẩm còn như mới không bạn?",
  },
  {
    user: {
      avatar: "https://via.placeholder.com/36x36.png?text=C",
      name: "Trần Văn C",
    },
    content: "Bạn muốn trao đổi với thiết bị nào?",
  },
];

const primary = "#2563eb";
const muted = "#6b7587";
const surface = "#ffffff";
const panel = "#f7f9fc";
const accent = "#f2c94c"; // vàng nhạt cho khung thumbnail

const PostDetail = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(fakeComments);
  const [activeImage, setActiveImage] = useState(0);

  const handleComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          user: {
            avatar: "https://via.placeholder.com/36x36.png?text=U",
            name: "Bạn",
          },
          content: comment,
        },
      ]);
      setComment("");
    }
  };

  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "26px 16px 40px" }}>
        {/* Title Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 42, lineHeight: 1.1, margin: 0, color: '#1e1b4b' }}>{post.title}</h1>
          <button title="Chia sẻ" style={{ border: `2px solid ${panel}`, background: surface, width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', color: '#2b2b38', boxShadow: '0 6px 18px #0000000a', cursor: 'pointer' }}>
            <FaShareAlt />
          </button>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px minmax(300px, 1.15fr) minmax(280px, 1fr)",
            gap: 24,
          }}
        >
          {/* Thumbnails */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {post.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                style={{
                  padding: 6,
                  borderRadius: 18,
                  border: `3px solid ${idx === activeImage ? accent : '#f1f2f6'}`,
                  background: surface,
                  boxShadow: idx === activeImage ? '0 8px 20px #f2c94c55' : '0 6px 16px #0000000a',
                  cursor: 'pointer',
                }}
              >
                <img src={img} alt={`thumb-${idx}`} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 14 }} />
              </button>
            ))}
          </div>

          {/* Left: Main Image & owner */}
          <div>
            <div
              style={{
                background: surface,
                borderRadius: 16,
                boxShadow: "0 8px 28px #00000014",
                padding: 16,
              }}
            >
              <img
                src={post.images[activeImage]}
                alt={post.title}
                style={{
                  width: "100%",
                  height: 540,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 4px 18px #0000001a",
                }}
              />
            </div>

            <div
              style={{
                background: surface,
                borderRadius: 16,
                boxShadow: "0 8px 28px #0000000f",
                padding: 16,
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <img
                src={post.owner.avatar}
                alt="User"
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #eef2ff" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{post.owner.name}</div>
                <div style={{ color: muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  <FaCalendarAlt /> Ngày đăng: {post.owner.date}
                </div>
              </div>
              <button
                style={{ border: `1px solid ${primary}`, background: panel, color: primary, padding: "8px 14px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}
              >
                Theo dõi
              </button>
              <button
                title="Yêu thích"
                style={{ border: "none", background: panel, color: primary, width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", cursor: "pointer" }}
              >
                <FaRegHeart />
              </button>
            </div>
          </div>

          {/* Right: Info card */}
          <div>
            <div
              style={{
                position: "sticky",
                top: 16,
                background: surface,
                borderRadius: 16,
                boxShadow: "0 10px 34px #00000012",
                padding: "22px 22px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  background: "#e9f0ff",
                  color: primary,
                  padding: "6px 10px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                  <FaTag /> {post.category}
                </div>
              </div>

              <Section title="Description">
                <p style={{ color: "#2f3645", lineHeight: 1.6 }}>{post.description}</p>
              </Section>

              {/* Condition card */}
              <div style={{ background: panel, border: '1px solid #e9edf5', borderRadius: 14, padding: 14, marginBottom: 18 }}>
                <div style={{ fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 12, background: '#eef4ff', display: 'grid', placeItems: 'center', color: '#2f3a5f' }}>🔳</span>
                  Condition
                </div>
                <div style={{ color: '#2f3645' }}>Unspecified</div>
                <div style={{ color: muted, fontSize: 14 }}>Condition is not specified.</div>
              </div>

              <Section title="Meeting spots">
                <div style={{ height: 220, borderRadius: 12, background: `linear-gradient(135deg, #dbeafe, #e9efff)`, border: '1px solid #dbe0ee', display: 'grid', placeItems: 'center', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><FaMapMarkerAlt /> Map placeholder</div>
                </div>
              </Section>

              <button
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: "0 6px 20px #2563eb45",
                  cursor: "pointer",
                  letterSpacing: 0.3,
                }}
              >
                Bắt đầu trao đổi
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div
          style={{
            background: surface,
            borderRadius: 16,
            boxShadow: "0 8px 28px #0000000f",
            padding: "22px 20px 24px",
            marginTop: 24,
            maxWidth: 800,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Bình luận</div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: panel, display: "grid", placeItems: "center", color: muted }}>
              <FaUser />
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1.5px solid #e4e9f2",
                  padding: 12,
                  minHeight: 56,
                  fontSize: 15,
                  resize: "none",
                  background: panel,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  onClick={handleComment}
                  style={{
                    background: primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 16px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <FaPaperPlane /> Gửi
                </button>
              </div>
            </div>
          </div>

          {comments.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0" }}>
              <img
                src={c.user.avatar}
                alt={c.user.name}
                style={{ borderRadius: "50%", width: 36, height: 36, border: "1.3px solid #e6e6ed" }}
              />
              <div style={{ background: panel, padding: "10px 12px", borderRadius: 12, maxWidth: 640 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.user.name}</div>
                <div style={{ color: "#3b465b", fontSize: 15, lineHeight: 1.5 }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ color: muted, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>
      {title}
    </div>
    {children}
  </div>
);

export default PostDetail;
