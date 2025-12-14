import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ProfileReviewsTab.css";

const ProfileReviewsTab = ({ reviews, loadingReviews, formatDate }) => {
  const navigate = useNavigate();
  if (loadingReviews) {
    return (
      <div className="profile-reviews-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="profile-reviews-empty">
        <div className="profile-reviews-empty-icon">⭐</div>
        <div className="profile-reviews-empty-title">Chưa có đánh giá nào</div>
      </div>
    );
  }

  return (
    <>
      {reviews.map((review) => (
        <div key={review.id} className="profile-reviews-card">
          <div className="profile-reviews-card-inner">
            {/* Reviewer Info */}
            <div className="profile-reviews-reviewer">
              {/* Avatar */}
              <div
                className="profile-reviews-avatar"
                style={{
                  background: review.reviewerAvatar
                    ? "transparent"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: review.reviewerId ? "pointer" : "default",
                }}
                onClick={() => {
                  if (review.reviewerId) {
                    navigate(`/profile/${review.reviewerId}`);
                  }
                }}
              >
                {review.reviewerAvatar ? (
                  <img src={review.reviewerAvatar} alt={review.reviewerName} />
                ) : (
                  <span className="profile-reviews-avatar-text">
                    {review.reviewerName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div className="profile-reviews-content">
                <div className="profile-reviews-header">
                  <div className="profile-reviews-name">
                    {review.reviewerName}
                  </div>
                  {/* Rating Stars */}
                  <div className="profile-reviews-rating">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`bi ${
                          index < review.rating ? "bi-star-fill filled" : "bi-star empty"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <div className="profile-reviews-date">
                    {formatDate(review.reviewDate)}
                  </div>
                </div>
                <div className="profile-reviews-text">{review.content}</div>

                {/* Item Info */}
                <div className="profile-reviews-item">
                  {review.itemImage ? (
                    <img
                      src={review.itemImage}
                      alt={review.itemTitle}
                      className="profile-reviews-item-image"
                    />
                  ) : (
                    <div className="profile-reviews-item-placeholder">
                      <i className="bi bi-image"></i>
                    </div>
                  )}
                  <div className="profile-reviews-item-info">
                    <div className="profile-reviews-item-title">
                      {review.itemTitle}
                    </div>
                    <div className="profile-reviews-item-label">
                      Sản phẩm đã trao đổi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileReviewsTab;



















