import React, { useState, useEffect } from "react";
import { getDetailTrade } from "../service/TradeService";
import ListPostModal from "./ListPostModal";

const TradeModal = ({ onClose, conversation, tradeId }) => {
  // Color constants
  const surface = "#ffffff";
  const primary = "#2563eb";

  const [tradeData, setTradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showListPostModal, setShowListPostModal] = useState(false);

  useEffect(() => {
    const fetchTradeDetail = async () => {
      if (!tradeId) {
        setError("Không tìm thấy ID trao đổi");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getDetailTrade(tradeId);

        // Handle API response structure
        const data = response?.data || response;
        if (data) {
          setTradeData(data);
        } else {
          setError("Không tìm thấy dữ liệu trao đổi");
        }
      } catch (err) {
        console.error("Error fetching trade detail:", err);
        setError("Không thể tải thông tin trao đổi");
      } finally {
        setLoading(false);
      }
    };

    fetchTradeDetail();
  }, [tradeId]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
        padding: "20px",
        marginTop: "80px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: surface,
          borderRadius: 16,
          maxWidth: "600px",
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e7eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
        >
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            Thông tin trao đổi
          </h3>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Chi tiết món đồ của hai bên
          </p>
        </div>

        {/* Trade Content */}
        <div
          style={{
            padding: "24px 20px",
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#ef4444",
              }}
            >
              <i className="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
              <p className="mb-0">{error}</p>
            </div>
          ) : tradeData ? (
            <div
              className="trade-items-container"
              style={{
                gap: "20px",
                alignItems: "center",
              }}
            >
              {/* Requester - Left Side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  {tradeData.requesterAvatar ? (
                    <img
                      src={tradeData.requesterAvatar}
                      alt={tradeData.requesterName || "Requester"}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "grid",
                        placeItems: "center",
                        color: "#9ca3af",
                        fontSize: 24,
                        border: "2px solid #e5e7eb",
                      }}
                    >
                      {tradeData.requesterName
                        ? tradeData.requesterName.charAt(0).toUpperCase()
                        : "R"}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1f2937",
                      marginBottom: 2,
                    }}
                  >
                    {tradeData.requesterName || "Người yêu cầu"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    Người yêu cầu
                  </div>
                </div>

                {/* Item Card */}
                <div
                  style={{
                    width: "100%",
                    background: "#f9fafb",
                    borderRadius: 12,
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(37, 99, 235, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Item Image */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 8,
                      overflow: "hidden",
                      marginBottom: 8,
                      background: "#fff",
                    }}
                  >
                    {tradeData.itemRequesterImage ? (
                      <img
                        src={tradeData.itemRequesterImage}
                        alt={tradeData.itemRequesterTitle || "Item"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          background: "#f3f4f6",
                          color: "#9ca3af",
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: 32 }}></i>
                      </div>
                    )}
                  </div>

                  {/* Item Name */}
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#1f2937",
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {tradeData.itemRequesterTitle || "Chưa có tên"}
                  </div>
                </div>
              </div>

              {/* Exchange Arrow - Desktop */}
              <div
                className="exchange-arrow-desktop"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    display: "grid",
                    placeItems: "center",
                    color: surface,
                    fontSize: 20,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  <i className="bi bi-arrow-left-right"></i>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Trao đổi
                </div>
              </div>

              {/* Exchange Arrow - Mobile */}
              <div
                className="exchange-arrow-mobile"
                style={{
                  display: "none",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  width: "100%",
                  padding: "12px 0",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    display: "grid",
                    placeItems: "center",
                    color: surface,
                    fontSize: 20,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  <i className="bi bi-arrow-down"></i>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Trao đổi
                </div>
              </div>

              {/* Owner - Right Side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  {tradeData.ownerAvatar ? (
                    <img
                      src={tradeData.ownerAvatar}
                      alt={tradeData.ownerName || "Owner"}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "grid",
                        placeItems: "center",
                        color: "#9ca3af",
                        fontSize: 24,
                        border: "2px solid #e5e7eb",
                      }}
                    >
                      {tradeData.ownerName
                        ? tradeData.ownerName.charAt(0).toUpperCase()
                        : "O"}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1f2937",
                      marginBottom: 2,
                    }}
                  >
                    {tradeData.ownerName || "Chủ sở hữu"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    Chủ sở hữu
                  </div>
                </div>

                {/* Item Card */}
                <div
                  style={{
                    width: "100%",
                    background: "#f9fafb",
                    borderRadius: 12,
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(37, 99, 235, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Item Image */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 8,
                      overflow: "hidden",
                      marginBottom: 8,
                      background: "#fff",
                    }}
                  >
                    {tradeData.itemOwnerImage ? (
                      <img
                        src={tradeData.itemOwnerImage}
                        alt={tradeData.itemOwnerTitle || "Item"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          background: "#f3f4f6",
                          color: "#9ca3af",
                        }}
                      >
                        <i className="bi bi-image" style={{ fontSize: 32 }}></i>
                      </div>
                    )}
                  </div>

                  {/* Item Name */}
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#1f2937",
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {tradeData.itemOwnerTitle || "Chưa có tên"}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "16px 20px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: surface,
              color: "#6b7280",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface;
            }}
          >
            Đóng
          </button>
          {tradeData?.canUpdate && (
            <button
              onClick={() => setShowListPostModal(true)}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: 8,
                background: "#2563eb",
                color: surface,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2563eb";
              }}
            >
              Cập nhật trao đổi
            </button>
          )}
        </div>
      </div>

      {/* ListPostModal */}
      {showListPostModal && (
        <ListPostModal
          onClose={() => setShowListPostModal(false)}
          userId={tradeData?.requesterId || tradeData?.ownerId}
          tradeId={tradeId}
          onSelectPost={(post) => {
            // Refresh trade data after update
            if (tradeId) {
              const fetchTradeDetail = async () => {
                try {
                  const response = await getDetailTrade(tradeId);
                  const data = response?.data || response;
                  if (data) {
                    setTradeData(data);
                  }
                } catch (err) {
                  console.error("Error refreshing trade detail:", err);
                }
              };
              fetchTradeDetail();
            }
          }}
        />
      )}
    </div>
  );
};

export default TradeModal;
