import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPostDetail } from "../service/post/PostService";
import {
  FaRegHeart,
  FaHeart,
  FaPaperPlane,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaShareAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const primary = "#2563eb";
const muted = "#6b7587";
const surface = "#ffffff";
const panel = "#f7f9fc";
const accent = "#f2c94c";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await getPostDetail(id);
        if (response.code === 1000) {
          setPostData(response.data);
          setComments(response.data.comments || []);
          setLiked(response.data.liked || false);
          setTotalLikes(response.data.totalLikes || 0);
          setActiveImage(0);
        } else {
          setError(response.message || "Failed to load post");
        }
      } catch (err) {
        setError("Error loading post");
        console.error("Error fetching post detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        userId: 999,
        fullName: "Bạn",
        avatarUrl: null,
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={{ background: "#eef2f7", minHeight: "100vh" }}>
        <Header />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
          <div style={{ textAlign: "center", color: muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div>Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div style={{ background: "#eef2f7", minHeight: "100vh" }}>
        <Header />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
          <div style={{ textAlign: "center", color: "#ef4444" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div>{error || "Không thể tải thông tin bài đăng"}</div>
          </div>
        </div>
      </div>
    );
  }

  const images =
    postData.imageUrls && postData.imageUrls.length > 0
      ? postData.imageUrls
      : [];

  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "22px 14px 36px" }}>
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
              style={{
                fontSize: 30,
                lineHeight: 1.2,
                margin: 0,
                color: "#1f2937",
              }}
            >
              {postData.title}
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
              gridTemplateColumns:
                "180px minmax(280px, 1.1fr) minmax(260px, 1fr)",
              gap: 16,
            }}
          >
            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      padding: 5,
                      borderRadius: 14,
                      border: `3px solid ${
                        idx === activeImage ? accent : "#f1f2f6"
                      }`,
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
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 96,
                    borderRadius: 14,
                    background: panel,
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
                  borderRadius: 12,
                  background: panel,
                  padding: 10,
                  boxShadow: "inset 0 0 0 1px #edf1f7",
                }}
              >
                {images.length > 0 ? (
                  <img
                    src={images[activeImage] || images[0]}
                    alt={postData.title}
                    style={{
                      width: "100%",
                      height: 360,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 360,
                      borderRadius: 10,
                      background: panel,
                      display: "grid",
                      placeItems: "center",
                      color: muted,
                      fontSize: 14,
                    }}
                  >
                    Không có hình ảnh
                  </div>
                )}
              </div>

              <div
                style={{
                  borderRadius: 12,
                  background: panel,
                  padding: 10,
                  marginTop: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "inset 0 0 0 1px #edf1f7",
                }}
              >
                {postData.username ? (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${primary}, #1e40af)`,
                      display: "grid",
                      placeItems: "center",
                      color: surface,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {postData.username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: panel,
                      display: "grid",
                      placeItems: "center",
                      color: muted,
                    }}
                  >
                    <FaUser style={{ fontSize: 14 }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {postData.username}
                  </div>
                  <div
                    style={{
                      color: muted,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <FaCalendarAlt /> Ngày đăng: {formatDate(postData.postDate)}
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
                  onClick={handleLike}
                  style={{
                    border: "none",
                    background: panel,
                    color: liked ? "#ef4444" : primary,
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {liked ? (
                    <FaHeart style={{ fill: "#ef4444" }} />
                  ) : (
                    <FaRegHeart />
                  )}
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
                      fontSize: 16,
                    }}
                  >
                    <FaTag /> {postData.category?.name || "Chưa phân loại"}
                  </div>
                </div>

                <Section title="Mô tả">
                  <p
                    style={{ color: "#2f3645", lineHeight: 1.55, fontSize: 16 }}
                  >
                    {postData.description || "Chưa có mô tả"}
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
                    <span></span>
                    Tình trạng
                  </div>
                  <div style={{ color: "#2f3645", fontSize: 14 }}>
                    {postData.itemCondition || "Chưa xác định"}
                  </div>
                  {!postData.itemCondition && (
                    <div style={{ color: muted, fontSize: 12 }}>
                      Condition is not specified.
                    </div>
                  )}
                </div>

                <Section title="Điểm gặp mặt">
                  <div
                    style={{
                      marginTop: 6,
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
                      <FaMapMarkerAlt />{" "}
                      {postData.tradeLocation || "Chưa xác định"}
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

            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "8px 0",
                  }}
                >
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.fullName}
                      style={{
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        border: "1.3px solid #e6e6ed",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${primary}, #1e40af)`,
                        display: "grid",
                        placeItems: "center",
                        color: surface,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {c.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div
                    style={{
                      background: panel,
                      padding: "8px 10px",
                      borderRadius: 10,
                      maxWidth: 620,
                    }}
                  >
                    <div
                      style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}
                    >
                      {c.fullName}
                    </div>
                    <div
                      style={{
                        color: "#3b465b",
                        fontSize: 14,
                        lineHeight: 1.45,
                      }}
                    >
                      {c.content}
                    </div>
                    <div
                      style={{
                        color: muted,
                        fontSize: 11,
                        marginTop: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FaCalendarAlt style={{ fontSize: 10 }} />
                      {formatDate(c.commentDate)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: muted,
                  fontSize: 14,
                }}
              >
                Chưa có bình luận nào
              </div>
            )}
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
