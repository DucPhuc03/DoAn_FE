import React from "react";
import "../../css/ProfilePostsTab.css";

const ProfilePostsTab = ({ posts, navigate }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const getStatusLabel = (status) => {
    if (!status) return null;
    if (status === "PENDING") return "Đang trao đổi";
    if (status === "WAITING") return "Đang chờ duyệt";
    if (status === "COMPLETED") return "Đã hoàn thành";
    return null;
  };

  return (
    <>
      {posts.map((post) => {
        const rawStatus = post.postStatus || post.status;
        const statusLabel = getStatusLabel(rawStatus);
        const statusClass = rawStatus === "PENDING" ? "pending" : rawStatus === "COMPLETED" ? "completed" : "waiting";

        return (
          <div
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
            className="profile-posts-card"
          >
            {post.imageUrl ? (
              <div className="profile-posts-image-container">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="profile-posts-image"
                />
              </div>
            ) : (
              <div className="profile-posts-placeholder">
                <i className="bi bi-image"></i>
              </div>
            )}
            <div className="profile-posts-content">
              <div className="profile-posts-title">{post.title}</div>
              <div className="profile-posts-footer">
                {post.category && (
                  <span className="profile-posts-category">
                    {post.category.name}
                  </span>
                )}
                {statusLabel && (
                  <span className={`profile-posts-status ${statusClass}`}>
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

