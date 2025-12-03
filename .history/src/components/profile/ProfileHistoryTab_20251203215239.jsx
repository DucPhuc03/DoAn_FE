import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { updateTradeStatus } from "../../service/trade/TradeService";
import { createReview } from "../../service/review/ReviewService";

const ProfileHistoryTab = ({
  trades,
  loadingTrades,
  onRefreshTrades,
  primary,
  secondary,
  surface,
  muted,
}) => {
  const [submittingTradeId, setSubmittingTradeId] = useState(null);
  const [reviewingTradeId, setReviewingTradeId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleCompleteTrade = async (tradeId) => {
    try {
      setSubmittingTradeId(tradeId);
      const response = await updateTradeStatus(tradeId);
      if (response?.code === 1000) {
        alert("Đã cập nhật trạng thái trao đổi thành công");
        // Refresh danh sách trades để cập nhật trạng thái
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
        // Refresh danh sách trades để cập nhật trạng thái
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
  if (loadingTrades) {
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

  if (!trades || trades.length === 0) {
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
          📋
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Chưa có lịch sử
        </div>
      </div>
    );
  }

  return (
    <>
      {trades.map((trade) => (
        <div
          key={trade.tradeId}
          style={{
            gridColumn: "1 / -1",
            background: surface,
            borderRadius: 14,
            padding: 18,
            boxShadow: "0 1px 4px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: 12,
          }}
        >
          {/* Header with user info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "2px solid #f1f5f9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* User Avatar */}
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: trade.userAvatar
                    ? "transparent"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {trade.userAvatar ? (
                  <img
                    src={trade.userAvatar}
                    alt={trade.userName}
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
                    {trade.userName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: secondary,
                    marginBottom: 4,
                  }}
                >
                  {trade.userName || "Người dùng"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: muted,
                  }}
                >
                  Mã trao đổi: #{trade.tradeId}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr auto 1.1fr",
              gap: 16,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            {/* Requester Post */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: 12,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: muted,
                  fontWeight: 600,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Sản phẩm yêu cầu
              </div>
              {trade.requesterPostImage ? (
                <img
                  src={trade.requesterPostImage}
                  alt={trade.requesterPostTitle}
                  style={{
                    width: "70%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "70%",
                  height: 150,
                  background: "#e5e7eb",
                  borderRadius: 8,
                  marginBottom: 8,
                  display: trade.requesterPostImage ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-image text-muted"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  width: "70%",
                  fontSize: 14,
                  color: secondary,
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
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
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: surface,
                  fontSize: 20,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                <FaExchangeAlt />
              </div>
            </div>

            {/* Owner Post */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 10,
                padding: 12,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: muted,
                  fontWeight: 600,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Sản phẩm của bạn
              </div>
              {trade.ownerPostImage ? (
                <img
                  src={trade.ownerPostImage}
                  alt={trade.ownerPostTitle}
                  style={{
                    width: "70%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "70%",
                  height: 150,
                  background: "#e5e7eb",
                  borderRadius: 8,
                  marginBottom: 8,
                  display: trade.ownerPostImage ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="bi bi-image text-muted"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: secondary,
                  lineHeight: 1.4,
                }}
              >
                {trade.ownerPostTitle}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {trade.reviewed === true && trade.canRate === false ? (
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#d1fae5",
                  color: "#065f46",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Đã đánh giá
              </div>
            ) : trade.canComplete === false && trade.canRate === false ? (
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#fef3c7",
                  color: "#d97706",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Đang chờ xác nhận
              </div>
            ) : (
              <>
                {trade.canComplete && (
                  <button
                    onClick={() => handleCompleteTrade(trade.tradeId)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      background: "#f59e0b",
                      color: surface,
                      border: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    {submittingTradeId === trade.tradeId
                      ? "Đang xử lý..."
                      : "Hoàn thành"}
                  </button>
                )}
                {trade.canRate && (
                  <button
                    onClick={() => handleOpenReview(trade)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      background: "transparent",
                      color: primary,
                      border: `2px solid ${primary}`,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  >
                    Đánh giá
                  </button>
                )}
              </>
            )}
          </div>

          {/* Review Form */}
          {trade.canRate && reviewingTradeId === trade.tradeId && (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 10,
                background: "#f9fafb",
                border: "1px dashed #e5e7eb",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 8,
                  color: secondary,
                }}
              >
                Gửi đánh giá cho {trade.userName}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 14, color: muted }}>Số sao:</span>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      rating: Number(e.target.value),
                    }))
                  }
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: 14,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Nhập nội dung đánh giá..."
                style={{
                  width: "100%",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  padding: 10,
                  fontSize: 14,
                  resize: "vertical",
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setReviewingTradeId(null);
                    setReviewForm({ rating: 5, comment: "" });
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "white",
                    color: "#4b5563",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitReview(trade)}
                  disabled={submittingReview}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: primary,
                    color: surface,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: submittingReview ? 0.7 : 1,
                  }}
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
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
