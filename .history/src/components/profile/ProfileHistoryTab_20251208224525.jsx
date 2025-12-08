import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { updateTradeStatus } from "../../service/TradeService";
import { createReview } from "../../service/ReviewService";

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
          Chưa có lịch sử trao đổi
        </div>
        <div style={{ fontSize: 14 }}>
          Những trao đổi hoàn thành sẽ được hiển thị tại đây.
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
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e2e8f0",
            marginBottom: 16,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              paddingBottom: 12,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: trade.userAvatar
                    ? "transparent"
                    : "linear-gradient(135deg, #64748b 0%, #0f172a 100%)",
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

            {/* trạng thái ngắn gọn (badge) */}
            <div>
              {trade.reviewed === true && trade.canRate === false ? (
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#d1fae5",
                    color: "#047857",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Đã đánh giá
                </span>
              ) : trade.canComplete === false && trade.canRate === false ? (
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#fef3c7",
                    color: "#b45309",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Đang chờ xác nhận
                </span>
              ) : trade.canComplete ? (
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Chờ bạn hoàn thành
                </span>
              ) : trade.canRate ? (
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#ede9fe",
                    color: "#4c1d95",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  Chờ bạn đánh giá
                </span>
              ) : null}
            </div>
          </div>

          {/* Trade Items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {/* Requester Post */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: muted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Sản phẩm yêu cầu
              </div>
              {trade.requesterPostImage ? (
                <img
                  src={trade.requesterPostImage}
                  alt={trade.requesterPostTitle}
                  style={{
                    width: "100%",
                    maxHeight: 160,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    background: "#e5e7eb",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-image text-muted"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              )}
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: secondary,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 40,
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
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: surface,
                  fontSize: 22,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                }}
              >
                <FaExchangeAlt />
              </div>
            </div>

            {/* Owner Post */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: 12,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: muted,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Sản phẩm của bạn
              </div>
              {trade.ownerPostImage ? (
                <img
                  src={trade.ownerPostImage}
                  alt={trade.ownerPostTitle}
                  style={{
                    width: "100%",
                    maxHeight: 160,
                    objectFit: "cover",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    background: "#e5e7eb",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-image text-muted"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              )}
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: secondary,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: 40,
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
              gap: 10,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {trade.reviewed === true && trade.canRate === false ? (
              <div
                style={{
                  padding: "8px 16px",
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
                  padding: "8px 16px",
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
                      padding: "8px 18px",
                      borderRadius: 8,
                      background: "#f59e0b",
                      color: surface,
                      border: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.18)",
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
                      padding: "8px 18px",
                      borderRadius: 8,
                      background: "transparent",
                      color: primary,
                      border: `2px solid ${primary}`,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.25s",
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
                marginTop: 14,
                padding: 14,
                borderRadius: 10,
                background: "#f9fafb",
                border: `1px dashed ${primary}33`,
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
