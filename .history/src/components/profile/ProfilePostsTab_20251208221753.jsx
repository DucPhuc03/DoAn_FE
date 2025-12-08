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
    <>
      {posts.map((post) => {
        const rawStatus = post.postStatus || post.status;
        const statusLabel = getStatusLabel(rawStatus);

        return (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            style={{
              background: surface,
              borderRadius: 16,
              padding: 0,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.borderColor = primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
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
                    height: 140,
                    objectFit: "cover",
                    transition: "transform 0.3s",
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
                  height: 140,
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
            <div style={{ padding: 14, position: "relative", flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "auto",
                  gap: 8,
                }}
              >
                {post.category && (
                  <span
                    style={{
                      fontSize: 14,
                      color: primary,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.category.name}
                  </span>
                )}
                {statusLabel && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: 999,
                      backgroundColor:
                        rawStatus === "PENDING" ? "#fef3c7" : "#e0f2fe",
                      color: rawStatus === "PENDING" ? "#92400e" : "#1d4ed8",
                      whiteSpace: "nowrap",
                      marginLeft: "auto",
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
    </>
  );
};

export default ProfilePostsTab;
