import React, { useState } from "react";
import Header from "../components/Header";
import {
  FaRegHeart,
  FaPaperPlane,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaShareAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Fake data
const post = {
  images: [
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761838431539_58791216101f9d41c40e.jpg",
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761838431539_58791216101f9d41c40e.jpg",
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761838431539_58791216101f9d41c40e.jpg",
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
const accent = "#f2c94c";

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
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "22px 14px 36px" }}>
        {/* Single seamless card */}
        <div
          style={{
            background: surface,
            borderRadius: 16,
            boxShadow: "0 10px 28px #00000012",
            padding: 16,
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h1
              style={{ fontSize: 30, lineHeight: 1.2, margin: 0, color: "#1f2937" }}
            >
              {post.title}
            </h1>
            <button
              title="Chia sẻ"
              style={{
                border: `2px solid ${panel}`,
                background: surface,
                width: 40,
                height: 40,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                color: "#2b2b38",
                boxShadow: "0 6px 18px #0000000a",
                cursor: "pointer",
              }}
            >
              <FaShareAlt />
            </button>
          </div>

          {/* Section: Gallery + Info (grid) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "180px minmax(280px, 1.1fr) minmax(260px, 1fr)",
              gap: 16,
            }}
          >
            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {post.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  style={{
                    padding: 5,
                    borderRadius: 14,
                    border: `3px solid ${idx === activeImage ? accent : "#f1f2f6"}`,
                    background: surface,
                    boxShadow:
                      idx === activeImage
                        ? "0 6px 16px #f2c94c55"
                        : "0 4px 12px #0000000a",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    style={{
                      width: "100%",
                      height: 96,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image + owner */}
            <div>
              <div
                style={{
                  borderRadius: 12,
                  background: panel,
                  padding: 10,
                  boxShadow: "inset 0 0 0 1px #edf1f7",
                }}
              >
                <img
                  src={post.images[activeImage]}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: 360,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              </div>

              <div
                style={{
                  borderRadius: 12,
                  background: panel,
                  padding: 10,
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "inset 0 0 0 1px #edf1f7",
                }}
              >
                <img
                  src={post.owner.avatar}
                  alt="User"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #eef2ff",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{post.owner.name}</div>
                  <div
                    style={{
                      color: muted,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FaCalendarAlt /> Ngày đăng: {post.owner.date}
                  </div>
                </div>
                <button
                  style={{
                    border: `1px solid ${primary}`,
                    background: panel,
                    color: primary,
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Theo dõi
                </button>
                <button
                  title="Yêu thích"
                  style={{
                    border: "none",
                    background: panel,
                    color: primary,
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <FaRegHeart />
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div>
              <div
                style={{
                  background: panel,
                  borderRadius: 12,
                  boxShadow: "inset 0 0 0 1px #e9edf5",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      background: "#e9f0ff",
                      color: primary,
                      padding: "5px 10px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    <FaTag /> {post.category}
                  </div>
                </div>

                <Section title="Mô tả">
                  <p style={{ color: "#2f3645", lineHeight: 1.55, fontSize: 14 }}>
                    {post.description}
                  </p>
                </Section>

                {/* Condition card */}
                <div
                  style={{
                    background: surface,
                    border: "1px solid #e9edf5",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: "#eef4ff",
                        display: "grid",
                        placeItems: "center",
                        color: "#2f3a5f",
                        fontSize: 16,
                      }}
                    >
                      🔳
                    </span>
                    Tình trạng
                  </div>
                  <div style={{ color: "#2f3645", fontSize: 14 }}>Chưa xác định</div>
                  <div style={{ color: muted, fontSize: 12 }}>
                    Condition is not specified.
                  </div>
                </div>

                <Section title="Điểm gặp mặt">
                  <div
                    style={{
                      height: 180,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, #dbeafe, #e9efff)`,
                      border: "1px solid #dbe0ee",
                      display: "grid",
                      placeItems: "center",
                      color: "#334155",
                      fontSize: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 700,
                      }}
                    >
                      <FaMapMarkerAlt /> Map placeholder
                    </div>
                  </div>
                </Section>

                <button
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background: primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: 15,
                    boxShadow: "0 6px 20px #2563eb35",
                    cursor: "pointer",
                    letterSpacing: 0.3,
                  }}
                >
                  Bắt đầu trao đổi
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#edf1f7", margin: "16px 0" }} />

          {/* Comments Section */}
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>
              Bình luận
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: panel,
                  display: "grid",
                  placeItems: "center",
                  color: muted,
                }}
              >
                <FaUser />
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "1.5px solid #e4e9f2",
                    padding: 10,
                    minHeight: 50,
                    fontSize: 14,
                    resize: "none",
                    background: panel,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <button
                    onClick={handleComment}
                    style={{
                      background: primary,
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      padding: "8px 14px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    <FaPaperPlane /> Gửi
                  </button>
                </div>
              </div>
            </div>

            {comments.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "8px 0",
                }}
              >
                <img
                  src={c.user.avatar}
                  alt={c.user.name}
                  style={{
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    border: "1.3px solid #e6e6ed",
                  }}
                />
                <div
                  style={{
                    background: panel,
                    padding: "8px 10px",
                    borderRadius: 10,
                    maxWidth: 620,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                    {c.user.name}
                  </div>
                  <div
                    style={{ color: "#3b465b", fontSize: 14, lineHeight: 1.45 }}
                  >
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div
      style={{
        color: muted,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        fontWeight: 800,
        fontSize: 11,
        marginBottom: 4,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

export default PostDetail;
