import React, { useState } from "react";
import { FaExchangeAlt, FaStar, FaRegStar } from "react-icons/fa";
import { updateTradeStatus } from "../../service/TradeService";
import { createReview } from "../../service/ReviewService";
import "../../css/ProfileHistoryTab.css";

const ProfileHistoryTab = ({ trades, loadingTrades, onRefreshTrades }) => {
  const [submittingTradeId, setSubmittingTradeId] = useState(null);
  const [reviewingTradeId, setReviewingTradeId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const formatCompletionDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleCompleteTrade = async (tradeId) => {
    try {
      setSubmittingTradeId(tradeId);
      const response = await updateTradeStatus(tradeId);
      if (response?.code === 1000) {
        alert("Đã cập nhật trạng thái trao đổi thành công");
        if (onRefreshTrades) {
          await onRefreshTrades();
        }
      } else {
        alert(response?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Update trade status error:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setSubmittingTradeId(null);
    }
  };

  const handleOpenReview = (trade) => {
    setReviewingTradeId(trade.tradeId);
    setReviewForm({
      rating: 5,
      comment: "",
      reviewedId: trade.userId,
    });
  };

  const handleSubmitReview = async (trade) => {
    if (!reviewForm.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const payload = {
      reviewedId: trade.userId,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      tradeId: trade.tradeId,
    };

    try {
      setSubmittingReview(true);
      const response = await createReview(payload);
      if (response?.code === 1000) {
        alert("Đã gửi đánh giá thành công");
        setReviewingTradeId(null);
        setReviewForm({ rating: 5, comment: "" });
        if (onRefreshTrades) {
          await onRefreshTrades();
        }
      } else {
        alert(response?.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    } catch (error) {
      console.error("Create review error:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`history-star ${
          star <= (hoveredStar || reviewForm.rating) ? "filled" : "empty"
        }`}
        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
        onMouseEnter={() => setHoveredStar(star)}
        onMouseLeave={() => setHoveredStar(0)}
      >
        {star <= (hoveredStar || reviewForm.rating) ? (
          <FaStar />
        ) : (
          <FaRegStar />
        )}
      </span>
    ));
  };

  if (loadingTrades) {
    return (
      <div className="history-loading">
        <div className="history-loading-dots">
          <div className="history-loading-dot"></div>
          <div className="history-loading-dot"></div>
          <div className="history-loading-dot"></div>
        </div>
        <p className="history-loading-text">Đang tải lịch sử giao dịch...</p>
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">📋</div>
        <h3 className="history-empty-title">Chưa có lịch sử giao dịch</h3>
        <p className="history-empty-subtitle">
          Các giao dịch của bạn sẽ xuất hiện ở đây
        </p>
      </div>
    );
  }

  return (
    <>
      {trades.map((trade) => (
        <div key={trade.tradeId} className="history-card">
          {/* Accent Line */}
          <div className="history-card-accent"></div>

          {/* Header with user info */}
          <div className="history-header">
            <div className="history-user-section">
              {/* User Avatar */}
              <div className="history-avatar">
                {trade.userAvatar ? (
                  <img src={trade.userAvatar} alt={trade.userName} />
                ) : (
                  <span className="history-avatar-text">
                    {trade.userName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <div className="history-user-name">
                  {trade.userName || "Người dùng"}
                </div>
                <div className="history-trade-id">
                  Mã giao dịch:
                  <span className="history-trade-id-badge">
                    #{trade.tradeId}
                  </span>
                </div>
                {/* Hiển thị ngày hoàn thành nếu trạng thái là COMPLETED */}
                {trade.status === "COMPLETED" && trade.dateComplete && (
                  <div className="history-completion-date">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Hoàn thành: {formatCompletionDate(trade.dateComplete)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trade Items */}
          <div className="history-trade-items">
            {/* Requester Post */}
            <div className="history-product-card">
              <div className="history-product-label">🎁 Sản phẩm yêu cầu</div>
              {trade.requesterPostImage ? (
                <img
                  src={trade.requesterPostImage}
                  alt={trade.requesterPostTitle}
                  className="history-product-image"
                />
              ) : (
                <div className="history-product-placeholder">
                  <i className="bi bi-image"></i>
                </div>
              )}
              <div className="history-product-title">
                {trade.requesterPostTitle}
              </div>
            </div>

            {/* Exchange Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="history-exchange-icon">
                <FaExchangeAlt />
              </div>
            </div>

            {/* Owner Post */}
            <div className="history-product-card">
              <div className="history-product-label">🏠 Sản phẩm của bạn</div>
              {trade.ownerPostImage ? (
                <img
                  src={trade.ownerPostImage}
                  alt={trade.ownerPostTitle}
                  className="history-product-image"
                />
              ) : (
                <div className="history-product-placeholder">
                  <i className="bi bi-image"></i>
                </div>
              )}
              <div className="history-product-title">
                {trade.ownerPostTitle}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="history-actions">
            {trade.reviewed === true && trade.canRate === false ? (
              <div className="history-status-badge reviewed">
                <i className="bi bi-check-circle-fill"></i>
                Đã đánh giá
              </div>
            ) : trade.canComplete === false && trade.canRate === false ? (
              <div className="history-status-badge pending">
                <i className="bi bi-hourglass-split"></i>
                Đang chờ xác nhận
              </div>
            ) : (
              <>
                {trade.canComplete && (
                  <button
                    className="history-complete-btn"
                    onClick={() => handleCompleteTrade(trade.tradeId)}
                    disabled={submittingTradeId === trade.tradeId}
                  >
                    {submittingTradeId === trade.tradeId ? (
                      <>
                        <span className="spinner-border spinner-border-sm"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle"></i>
                        Hoàn thành
                      </>
                    )}
                  </button>
                )}
                {trade.canRate && (
                  <button
                    className="history-review-btn"
                    onClick={() => handleOpenReview(trade)}
                  >
                    <i className="bi bi-star"></i>
                    Đánh giá
                  </button>
                )}
              </>
            )}
          </div>

          {/* Review Form */}
          {trade.canRate && reviewingTradeId === trade.tradeId && (
            <div className="history-review-form">
              <div className="history-review-title">
                <span style={{ fontSize: "24px" }}>⭐</span>
                Gửi đánh giá cho {trade.userName}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <span className="history-star-label">Chọn số sao:</span>
                <div className="history-star-rating">{renderStars()}</div>
              </div>

              <textarea
                className="history-textarea"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Chia sẻ trải nghiệm của bạn về giao dịch này..."
              />

              <div className="history-form-actions">
                <button
                  type="button"
                  className="history-cancel-btn"
                  onClick={() => {
                    setReviewingTradeId(null);
                    setReviewForm({ rating: 5, comment: "" });
                    setHoveredStar(0);
                  }}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Hủy
                </button>
                <button
                  type="button"
                  className="history-submit-btn"
                  onClick={() => handleSubmitReview(trade)}
                  disabled={submittingReview}
                >
                  {submittingReview ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Gửi đánh giá
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ProfileHistoryTab;
