import React, { useState, useEffect } from "react";
import { getPostUser } from "../service/post/PostService";
import { updateTradePost } from "../service/trade/TradeService";

const ListPostModal = ({ onClose, userId, tradeId, onSelectPost }) => {
  const surface = "#ffffff";
  const primary = "#2563eb";
  const secondary = "#1f2937";
  const muted = "#6b7280";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getPostUser(userId);

        // Handle API response structure
        const data = response?.data || response;
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          setError("Không tìm thấy dữ liệu bài đăng");
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Không thể tải danh sách bài đăng");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleSelectPost = async (post) => {
    if (!tradeId || !post.id) {
      setError("Thiếu thông tin trao đổi hoặc bài đăng");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      const response = await updateTradePost(tradeId, post.id);

      // Handle success
      if (response?.code === 1000 || response?.data) {
        if (onSelectPost) {
          onSelectPost(post);
        }
        onClose();
      } else {
        setError(response?.message || "Cập nhật trao đổi thất bại");
      }
    } catch (err) {
      console.error("Error updating trade post:", err);
      setError(err?.response?.data?.message || "Không thể cập nhật trao đổi");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1060,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: surface,
          borderRadius: 16,
          maxWidth: "800px",
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: secondary,
            }}
          >
            Chọn bài đăng của bạn
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: muted,
            }}
          >
            Chọn một bài đăng để cập nhật trao đổi
          </p>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "24px 20px",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#ef4444",
              }}
            >
              <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
              <p className="mb-0">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: muted,
              }}
            >
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              <p className="mb-0">Không có bài đăng nào</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => !updating && handleSelectPost(post)}
                  style={{
                    background: surface,
                    borderRadius: 12,
                    padding: 0,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: updating ? "not-allowed" : "pointer",
                    opacity: updating ? 0.6 : 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    if (!updating) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(0, 0, 0, 0.12)";
                      e.currentTarget.style.borderColor = primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updating) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    {post.imageUrl ? (
                      <>
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: 160,
                            objectFit: "cover",
                            transition: "transform 0.3s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            const fallback = e.target.nextElementSibling;
                            if (fallback) {
                              fallback.style.display = "grid";
                            }
                          }}
                        />
                        <div
                          style={{
                            width: "100%",
                            height: 160,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "none",
                            placeItems: "center",
                            color: surface,
                            fontSize: 36,
                          }}
                        >
                          <i className="bi bi-image"></i>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "grid",
                          placeItems: "center",
                          color: surface,
                          fontSize: 36,
                        }}
                      >
                        <i className="bi bi-image"></i>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: 12, flex: 1 }}>
                    {/* Title */}
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: secondary,
                        marginBottom: 8,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.title}
                    </div>

                    {/* Category */}
                    {post.category && (
                      <div
                        style={{
                          fontSize: 12,
                          color: primary,
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.category.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPostModal;
