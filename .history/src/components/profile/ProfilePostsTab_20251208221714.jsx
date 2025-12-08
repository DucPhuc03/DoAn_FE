import React from "react";

const ProfilePostsTab = ({ posts, navigate, primary, secondary, surface }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const getStatusLabel = (status) => {
    if (!status) return null;
    if (status === "PENDING") return "Đang trao đổi";
    if (status === "WAITING") return "Đang chờ duyệt";
    return null;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 4 phần tử / hàng
        gap: 16, // khoảng cách giữa các item
      }}
    >
      {posts.map((post) => {
        const rawStatus = post.postStatus || post.status;
        const statusLabel = getStatusLabel(rawStatus);

        return (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{
              background: surface,
              borderRadius: 14,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",

              /* thu nhỏ item để đảm bảo 4 cái/1 hàng */
              height: 240,
              transition: "all .25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.borderColor = primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            {post.imageUrl ? (
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: 120, // giảm chiều cao hình
                    objectFit: "cover",
                    transition: "transform .25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 120,
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  display: "grid",
                  placeItems: "center",
                  color: surface,
                  fontSize: 32,
                }}
              >
                <i className="bi bi-image"></i>
              </div>
            )}

            <div style={{ padding: 10, flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: secondary,
                  marginBottom: 6,
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.title}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                {post.category && (
                  <span
                    style={{
                      fontSize: 13,
                      color: primary,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 80,
                    }}
                  >
                    {post.category.name}
                  </span>
                )}

                {statusLabel && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: 999,
                      backgroundColor:
                        rawStatus === "PENDING" ? "#fef3c7" : "#e0f2fe",
                      color: rawStatus === "PENDING" ? "#92400e" : "#1d4ed8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePostsTab;
