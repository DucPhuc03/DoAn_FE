import React from "react";
import "../../css/ProfileLikedTab.css";

const ProfileLikedTab = ({ likedPosts, navigate }) => {
  if (!likedPosts || likedPosts.length === 0) {
    return (
      <div className="profile-liked-empty">
        <div className="profile-liked-empty-icon"></div>
        <div className="profile-liked-empty-title">
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
          className="profile-liked-card"
        >
          <div className="profile-liked-image-container">
            {post.imageUrl ? (
              <>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="profile-liked-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = e.target.nextElementSibling;
                    if (fallback) {
                      fallback.style.display = "grid";
                    }
                  }}
                />
                <div className="profile-liked-fallback" style={{ display: "none" }}>
                  <i className="bi bi-image"></i>
                </div>
              </>
            ) : (
              <div className="profile-liked-fallback">
                <i className="bi bi-image"></i>
              </div>
            )}
          </div>

          <div className="profile-liked-content">
            <div className="profile-liked-title">{post.title}</div>
            <div className="profile-liked-footer">
              <div className="profile-liked-likes">
                <i className="bi bi-heart-fill"></i>
                <span>{post.totalLikes || 0}</span>
              </div>
              {post.category && (
                <span className="profile-liked-category">
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











