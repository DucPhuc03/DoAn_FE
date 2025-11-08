import React, { useState } from "react";
import Header from "../components/Header";
import {
  FaRegHeart,
  FaHeart,
  FaPaperPlane,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaShareAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaFlag,
  FaCheckCircle,
} from "react-icons/fa";

// Fake data - matching API response structure
const postData = {
  id: 2,
  userId: 1,
  username: "phuc",
  title: "iPhone 16",
  description:
    "Điện thoại còn mới, đầy đủ phụ kiện, pin còn 95%. Máy đẹp như mới, không trầy xước.",
  itemCondition: "Mới 90%",
  postDate: "2025-10-26",
  tradeLocation: "Hà Nội",
  postStatus: null,
  category: {
    id: 1,
    name: "Điện tử",
  },
  imageUrls: [
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/1761665493984_Screenshot%202025-07-06%20202451.png",
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/1761665493984_Screenshot%202025-07-06%20202451.png",
    "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/1761665493984_Screenshot%202025-07-06%20202451.png",
  ],
  comments: [
    {
      id: 1,
      userId: 2,
      fullName: "phuc1",
      avatarUrl: "https://via.placeholder.com/40x40.png?text=P1",
      content: "good",
      commentDate: "2025-10-12",
    },
    {
      id: 2,
      userId: 1,
      fullName: "phuc",
      avatarUrl: null,
      content: "Chất lượng như nào thế",
      commentDate: "2025-11-08",
    },
  ],
  canEdit: false,
  canDelete: false,
  canReport: true,
  canUpdateStatus: false,
  totalLikes: 0,
  totalComments: 2,
  liked: false,
};

const primary = "#1e3a8a"; // Navy blue
const secondary = "#3b82f6"; // Blue
const muted = "#475569"; // Dark gray
const surface = "#ffffff";
const panel = "#f8fafc";
const accent = "#1e40af"; // Darker navy
const dark = "#0f172a"; // Black/navy

const PostDetail = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(postData.comments);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(postData.liked);
  const [totalLikes, setTotalLikes] = useState(postData.totalLikes);

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        userId: 999, // Current user ID
        fullName: "Bạn",
        avatarUrl: "https://via.placeholder.com/40x40.png?text=U",
        content: comment,
        commentDate: new Date().toISOString().split("T")[0],
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setTotalLikes(liked ? totalLikes - 1 : totalLikes + 1);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit post:", postData.id);
    alert("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) {
      // TODO: Call API to delete post
      console.log("Delete post:", postData.id);
      alert("Xóa bài đăng thành công");
    }
  };

  const handleReport = () => {
    // TODO: Open report modal
    console.log("Report post:", postData.id);
    alert("Chức năng báo cáo đang được phát triển");
  };

  const handleUpdateStatus = () => {
    // TODO: Update post status (e.g., mark as sold/completed)
    console.log("Update status for post:", postData.id);
    alert("Chức năng cập nhật trạng thái đang được phát triển");
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      <Header />
      <div
        style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 48px" }}
      >
        {/* Single seamless card */}
        <div
          style={{
            background: surface,
            borderRadius: 20,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)",
            padding: 32,
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <h1
              style={{
                fontSize: 32,
                lineHeight: 1.3,
                margin: 0,
                color: dark,
                fontWeight: 800,
              }}
            >
              {postData.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Action buttons based on permissions */}
              {postData.canEdit && (
                <button
                  title="Chỉnh sửa"
                  onClick={handleEdit}
                  style={{
                    border: "none",
                    background: surface,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    color: secondary,
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = secondary;
                    e.currentTarget.style.color = surface;
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(59, 130, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.color = secondary;
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.1)";
                  }}
                >
                  <FaEdit />
                </button>
              )}
              {postData.canDelete && (
                <button
                  title="Xóa"
                  onClick={handleDelete}
                  style={{
                    border: "none",
                    background: surface,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    color: "#ef4444",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ef4444";
                    e.currentTarget.style.color = surface;
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(239, 68, 68, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.color = "#ef4444";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.1)";
                  }}
                >
                  <FaTrash />
                </button>
              )}
              {postData.canReport && (
                <button
                  title="Báo cáo"
                  onClick={handleReport}
                  style={{
                    border: "none",
                    background: surface,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    color: "#f59e0b",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f59e0b";
                    e.currentTarget.style.color = surface;
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(245, 158, 11, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.color = "#f59e0b";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.1)";
                  }}
                >
                  <FaFlag />
                </button>
              )}
              {postData.canUpdateStatus && (
                <button
                  title="Cập nhật trạng thái"
                  onClick={handleUpdateStatus}
                  style={{
                    border: "none",
                    background: surface,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    color: "#10b981",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#10b981";
                    e.currentTarget.style.color = surface;
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(16, 185, 129, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.color = "#10b981";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.1)";
                  }}
                >
                  <FaCheckCircle />
                </button>
              )}
            </div>
          </div>

          {/* Section: Gallery + Info (grid) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "120px minmax(400px, 1.2fr) minmax(300px, 1fr)",
              gap: 24,
              marginBottom: 32,
            }}
          >
            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {postData.imageUrls && postData.imageUrls.length > 0 ? (
                postData.imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      padding: 0,
                      borderRadius: 12,
                      border: "none",
                      background: surface,
                      boxShadow:
                        idx === activeImage
                          ? `0 4px 16px ${primary}50`
                          : "0 2px 8px rgba(15, 23, 42, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      if (idx !== activeImage) {
                        e.currentTarget.style.boxShadow = `0 4px 12px ${secondary}30`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (idx !== activeImage) {
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(15, 23, 42, 0.08)";
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      style={{
                        width: "100%",
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </button>
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 70,
                    borderRadius: 8,
                    background: surface,
                    display: "grid",
                    placeItems: "center",
                    color: muted,
                    fontSize: 12,
                  }}
                >
                  No images
                </div>
              )}
            </div>

            {/* Main Image + owner */}
            <div>
              <div
                style={{
                  borderRadius: 16,
                  background: surface,
                  padding: 12,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  marginBottom: 20,
                }}
              >
                {postData.imageUrls && postData.imageUrls.length > 0 ? (
                  <img
                    src={
                      postData.imageUrls[activeImage] || postData.imageUrls[0]
                    }
                    alt={postData.title}
                    style={{
                      width: "100%",
                      height: 500,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 500,
                      borderRadius: 12,
                      background: surface,
                      display: "grid",
                      placeItems: "center",
                      color: muted,
                      fontSize: 16,
                    }}
                  >
                    No image available
                  </div>
                )}
              </div>

              <div
                style={{
                  borderRadius: 14,
                  background: surface,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                }}
              >
                {postData.username ? (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                      display: "grid",
                      placeItems: "center",
                      color: surface,
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
                    }}
                  >
                    {postData.username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: surface,
                      display: "grid",
                      placeItems: "center",
                      color: muted,
                    }}
                  >
                    <FaUser />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: dark }}>
                    {postData.username}
                  </div>
                  <div
                    style={{
                      color: muted,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <FaCalendarAlt /> Ngày đăng: {formatDate(postData.postDate)}
                  </div>
                </div>
                <button
                  style={{
                    border: "none",
                    background: surface,
                    color: primary,
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = primary;
                    e.currentTarget.style.color = surface;
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(30, 58, 138, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.color = primary;
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.1)";
                  }}
                >
                  Theo dõi
                </button>
                <button
                  title="Yêu thích"
                  onClick={handleLike}
                  style={{
                    border: "none",
                    background: liked ? secondary : surface,
                    color: liked ? surface : primary,
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                    boxShadow: liked
                      ? "0 2px 8px rgba(59, 130, 246, 0.3)"
                      : "0 2px 8px rgba(15, 23, 42, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!liked) {
                      e.currentTarget.style.background = primary;
                      e.currentTarget.style.color = surface;
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(30, 58, 138, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!liked) {
                      e.currentTarget.style.background = surface;
                      e.currentTarget.style.color = primary;
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(15, 23, 42, 0.1)";
                    }
                  }}
                >
                  {liked ? (
                    <FaHeart style={{ fill: surface }} />
                  ) : (
                    <FaRegHeart />
                  )}
                  {totalLikes > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: secondary,
                        color: surface,
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {totalLikes}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div>
              <div
                style={{
                  background: surface,
                  borderRadius: 16,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                      color: surface,
                      padding: "8px 14px",
                      borderRadius: 999,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 700,
                      fontSize: 12,
                      boxShadow: `0 2px 8px ${primary}30`,
                    }}
                  >
                    <FaTag /> {postData.category?.name || "Chưa phân loại"}
                  </div>
                </div>

                <Section title="Mô tả">
                  <p
                    style={{
                      color: dark,
                      lineHeight: 1.7,
                      fontSize: 20,
                      margin: 0,
                    }}
                  >
                    {postData.description}
                  </p>
                </Section>

                {/* Condition card */}
                <div
                  style={{
                    background: surface,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                    marginTop: 20,
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 15,
                      color: dark,
                    }}
                  >
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                        display: "grid",
                        placeItems: "center",
                        color: surface,
                        fontSize: 18,
                      }}
                    >
                      🔳
                    </span>
                    Tình trạng
                  </div>
                  <div
                    style={{
                      color: dark,
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {postData.itemCondition || "Chưa xác định"}
                  </div>
                  {postData.itemCondition && (
                    <div style={{ color: muted, fontSize: 13 }}>
                      Tình trạng sản phẩm: {postData.itemCondition}
                    </div>
                  )}
                </div>

                <Section title="Điểm gặp mặt">
                  <div
                    style={{
                      height: 200,
                      borderRadius: 12,
                      background: surface,
                      display: "grid",
                      placeItems: "center",
                      color: primary,
                      fontSize: 15,
                      marginTop: 8,
                      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 700,
                      }}
                    >
                      <FaMapMarkerAlt />{" "}
                      {postData.tradeLocation || "Chưa xác định"}
                    </div>
                  </div>
                </Section>

                <button
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                    color: surface,
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 16,
                    boxShadow: `0 8px 24px ${primary}40`,
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    marginTop: 20,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${primary}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${primary}40`;
                  }}
                >
                  Bắt đầu trao đổi
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 2,
              background: `linear-gradient(90deg, transparent, ${primary}30, transparent)`,
              margin: "32px 0",
            }}
          />

          {/* Comments Section */}
          <div style={{ maxWidth: 800, marginTop: 8 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 20,
                color: dark,
              }}
            >
              Bình luận
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                  display: "grid",
                  placeItems: "center",
                  color: surface,
                  boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
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
                    borderRadius: 12,
                    border: "none",
                    padding: 12,
                    minHeight: 60,
                    fontSize: 14,
                    resize: "none",
                    background: surface,
                    color: dark,
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${primary}30`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(15, 23, 42, 0.08)";
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <button
                    onClick={handleComment}
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                      color: surface,
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 18px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 14,
                      boxShadow: `0 4px 12px ${primary}30`,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 6px 16px ${primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 4px 12px ${primary}30`;
                    }}
                  >
                    <FaPaperPlane /> Gửi
                  </button>
                </div>
              </div>
            </div>

            {comments.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "12px 0",
                  marginBottom: 8,
                }}
              >
                {c.avatarUrl ? (
                  <img
                    src={c.avatarUrl}
                    alt={c.fullName}
                    style={{
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                      display: "grid",
                      placeItems: "center",
                      color: surface,
                      fontWeight: 700,
                      fontSize: 16,
                      boxShadow: "0 2px 8px rgba(30, 58, 138, 0.2)",
                    }}
                  >
                    {c.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div
                  style={{
                    background: surface,
                    padding: "12px 14px",
                    borderRadius: 12,
                    maxWidth: 680,
                    flex: 1,
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14, color: dark }}>
                      {c.fullName}
                    </div>
                    <div
                      style={{
                        color: muted,
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaCalendarAlt style={{ fontSize: 10 }} />
                      {formatDate(c.commentDate)}
                    </div>
                  </div>
                  <div style={{ color: dark, fontSize: 14, lineHeight: 1.6 }}>
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
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        color: primary,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontWeight: 800,
        fontSize: 12,
        marginBottom: 10,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

export default PostDetail;
