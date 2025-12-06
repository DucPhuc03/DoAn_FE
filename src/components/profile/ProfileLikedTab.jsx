import React from "react";

const ProfileLikedTab = ({
  likedPosts,
  navigate,
  primary,
  secondary,
  surface,
  muted,
}) => {
  if (!likedPosts || likedPosts.length === 0) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "center",
          padding: "60px 20px",
          color: muted,
        }}
      >
        <div
          style={{
            fontSize: 64,
            marginBottom: 16,
            opacity: 0.5,
          }}
        ></div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Chưa yêu thích bài đăng nào
        </div>
      </div>
    );
  }

  return (
    <>
      {likedPosts.map((post) => (
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
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.15)";
            e.currentTarget.style.borderColor = primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <div style={{ position: "relative", overflow: "hidden" }}>
            {post.imageUrl ? (
              <>
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
                    height: 140,
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
          </div>

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
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: muted,
                }}
              >
                <i
                  className="bi bi-heart-fill"
                  style={{ color: "#ec4899" }}
                ></i>
                <span style={{ fontWeight: 600 }}>{post.totalLikes || 0}</span>
              </div>
              {post.category && (
                <span
                  style={{
                    fontSize: 15,
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileLikedTab;


