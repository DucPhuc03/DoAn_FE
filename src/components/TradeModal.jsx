import React from "react";

const TradeModal = ({ onClose, conversation }) => {
  // Color constants
  const surface = "#ffffff";
  const primary = "#2563eb";

  // Fake data for trade information
  const tradeData = {
    user1: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar:
        "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761970519508_58791216101f9d41c40e.jpg",
      item: {
        name: "iPhone 16 Pro Max 256GB",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      },
    },
    user2: {
      id: 2,
      name: conversation?.username || "Nguyễn Thị B",
      avatar:
        conversation?.userAvatar ||
        "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761838431539_58791216101f9d41c40e.jpg",
      item: {
        name: conversation?.itemTitle || "MacBook Pro M3 14 inch",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      },
    },
  };

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
          <div
            className="trade-items-container"
            style={{
              gap: "20px",
              alignItems: "center",
            }}
          >
            {/* User 1 */}
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
                {tradeData.user1.avatar ? (
                  <img
                    src={tradeData.user1.avatar}
                    alt={tradeData.user1.name}
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
                    {tradeData.user1.name.charAt(0)}
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
                  {tradeData.user1.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                  }}
                >
                  Người trao đổi
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
                  <img
                    src={tradeData.user1.item.image}
                    alt={tradeData.user1.item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                  {tradeData.user1.item.name}
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

            {/* User 2 */}
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
                {tradeData.user2.avatar ? (
                  <img
                    src={tradeData.user2.avatar}
                    alt={tradeData.user2.name}
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
                    {tradeData.user2.name.charAt(0)}
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
                  {tradeData.user2.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                  }}
                >
                  Người trao đổi
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
                  <img
                    src={tradeData.user2.item.image}
                    alt={tradeData.user2.item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                  {tradeData.user2.item.name}
                </div>
              </div>
            </div>
          </div>
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
          <button
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
            Xác nhận trao đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;

