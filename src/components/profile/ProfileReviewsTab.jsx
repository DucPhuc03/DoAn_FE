import React from "react";

const ProfileReviewsTab = ({
  reviews,
  loadingReviews,
  formatDate,
  muted,
  secondary,
  surface,
}) => {
  if (loadingReviews) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "center",
          padding: "60px 20px",
          color: muted,
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
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
        >
          ⭐
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Chưa có đánh giá nào
        </div>
      </div>
    );
  }

  return (
    <>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            gridColumn: "1 / -1",
            background: surface,
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {/* Reviewer Info */}
            <div style={{ display: "flex", gap: 12, flex: 1 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: review.reviewerAvatar
                    ? "transparent"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {review.reviewerAvatar ? (
                  <img
                    src={review.reviewerAvatar}
                    alt={review.reviewerName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: surface,
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                  >
                    {review.reviewerName.charAt(0)}
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: secondary,
                    }}
                  >
                    {review.reviewerName}
                  </div>
                  {/* Rating Stars */}
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`bi ${
                          index < review.rating ? "bi-star-fill" : "bi-star"
                        }`}
                        style={{
                          color: index < review.rating ? "#fbbf24" : "#d1d5db",
                          fontSize: "14px",
                        }}
                      ></i>
                    ))}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      color: muted,
                    }}
                  >
                    {formatDate(review.reviewDate)}
                  </div>
                </div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {review.content}
                </div>

                {/* Item Info */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    background: "#f8fafc",
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {review.itemImage ? (
                    <img
                      src={review.itemImage}
                      alt={review.itemTitle}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className="bi bi-image text-muted"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: secondary,
                        marginBottom: 4,
                      }}
                    >
                      {review.itemTitle}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: muted,
                      }}
                    >
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









