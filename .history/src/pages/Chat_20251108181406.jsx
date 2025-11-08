import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import {
  FaEllipsisV,
  FaSmile,
  FaPaperclip,
  FaArrowUp,
  FaDollarSign,
} from "react-icons/fa";

const Chat = () => {
  const [leftTab, setLeftTab] = useState("chats"); // chats | meetings

  // Fake data - Trades (chỉ chat theo trade)
  const [trades, setTrades] = useState([
    {
      id: "trade1",
      tradeName: "Stehlampe Papier",
      userName: "Stehlampe Papier",
      preview: "You have made the first offer",
      timestamp: "5:44 PM",
      avatar: null,
      itemImage: "https://via.placeholder.com/40x40.png?text=💡",
      status: "New trade",
      messages: [
        {
          id: 1,
          type: "status",
          text: "You have made the first offer",
          timestamp: "5:44 PM",
          user: "You",
          action: "added Stehlampe Papier",
        },
      ],
    },
    {
      id: "trade2",
      tradeName: "Celine J Trade",
      userName: "Celine J",
      preview: "You have marked trade as completed",
      timestamp: "11:39 PM",
      avatar: "https://via.placeholder.com/40x40.png?text=CJ",
      itemImage: "https://via.placeholder.com/40x40.png?text=📱",
      status: "Completed",
      messages: [
        {
          id: 1,
          type: "status",
          text: "You have marked trade as completed",
          timestamp: "11:39 PM",
        },
      ],
    },
    {
      id: "trade3",
      tradeName: "Simply F. Trade",
      userName: "Simply F.",
      preview: "You have marked trade as cancelled",
      timestamp: "Nov 7, 2:58 PM",
      avatar: "https://via.placeholder.com/40x40.png?text=SF",
      itemImage: "https://via.placeholder.com/40x40.png?text=📚",
      status: "Cancelled",
      messages: [
        {
          id: 1,
          type: "status",
          text: "You have marked trade as cancelled",
          timestamp: "Nov 7, 2:58 PM",
        },
      ],
    },
    {
      id: "trade4",
      tradeName: "Leanne W. Trade",
      userName: "Leanne W.",
      preview: "You have made the first offer",
      timestamp: "Nov 6, 10:20 AM",
      avatar: "https://via.placeholder.com/40x40.png?text=LW",
      itemImage: "https://via.placeholder.com/40x40.png?text=👕",
      status: "New trade",
      messages: [],
    },
    {
      id: "trade5",
      tradeName: "Sal Trade",
      userName: "Sal",
      preview: "You have made the first offer",
      timestamp: "Nov 5, 3:15 PM",
      avatar: "https://via.placeholder.com/40x40.png?text=S",
      itemImage: "https://via.placeholder.com/40x40.png?text=🎮",
      status: "New trade",
      messages: [],
    },
  ]);

  const [selectedTradeId, setSelectedTradeId] = useState("trade1");
  const selectedTrade = useMemo(
    () => trades.find((t) => t.id === selectedTradeId) || trades[0],
    [trades, selectedTradeId]
  );

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newMessage = {
      id: Date.now(),
      type: "message",
      sender: "You",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setTrades((prev) =>
      prev.map((t) =>
        t.id === selectedTrade.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              preview: trimmed,
              timestamp: newMessage.timestamp,
            }
          : t
      )
    );
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp;
  };

  const primary = "#2563eb"; // Blue
  const yellow = "#fbbf24"; // Yellow
  const green = "#10b981"; // Green
  const purple = "#a855f7"; // Purple
  const surface = "#ffffff";
  const bgLight = "#f8f9fa";

  return (
    <div style={{ background: bgLight, minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* Left Sidebar - Trade List */}
        <div
          style={{
            width: "320px",
            background: surface,
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              gap: 8,
            }}
          >
            <button
              onClick={() => setLeftTab("chats")}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                color: leftTab === "chats" ? primary : "#6b7280",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                borderBottom:
                  leftTab === "chats"
                    ? `2px solid ${primary}`
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Chats
            </button>
            <button
              onClick={() => setLeftTab("meetings")}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                color: leftTab === "meetings" ? primary : "#6b7280",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                borderBottom:
                  leftTab === "meetings"
                    ? `2px solid ${primary}`
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Meetings
            </button>
          </div>

          {/* Trade List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {trades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => setSelectedTradeId(trade.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px",
                  cursor: "pointer",
                  background:
                    selectedTradeId === trade.id ? "#f3f4f6" : surface,
                  borderBottom: "1px solid #f3f4f6",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedTradeId !== trade.id) {
                    e.currentTarget.style.background = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTradeId !== trade.id) {
                    e.currentTarget.style.background = surface;
                  }
                }}
              >
                {/* Avatar */}
                {trade.avatar ? (
                  <img
                    src={trade.avatar}
                    alt={trade.userName}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#e5e7eb",
                      display: "grid",
                      placeItems: "center",
                      color: "#9ca3af",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {trade.userName.charAt(0)}
                  </div>
                )}

                {/* Item Image (small) */}
                <img
                  src={trade.itemImage}
                  alt="Item"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                {/* Trade Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1f2937",
                      marginBottom: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {trade.userName}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {trade.preview}
                  </div>
                </div>

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  {trade.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: surface,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {/* Avatar */}
            {selectedTrade?.avatar ? (
              <img
                src={selectedTrade.avatar}
                alt={selectedTrade.userName}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#e5e7eb",
                  display: "grid",
                  placeItems: "center",
                  color: "#9ca3af",
                  fontSize: 20,
                }}
              >
                {selectedTrade?.userName?.charAt(0) || "U"}
              </div>
            )}

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: "#1f2937" }}>
                {selectedTrade?.userName}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {selectedTrade?.status || "New trade"}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: yellow,
                  color: surface,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f59e0b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = yellow;
                }}
              >
                View trade
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: yellow,
                  color: surface,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f59e0b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = yellow;
                }}
              >
                Plan
              </button>
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  color: "#6b7280",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: bgLight,
            }}
          >
            {selectedTrade?.messages && selectedTrade.messages.length > 0 ? (
              selectedTrade.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.type === "status" ? "flex-start" : "flex-end",
                    marginBottom: 16,
                  }}
                >
                  {msg.type === "status" ? (
                    <div
                      style={{
                        background: green,
                        color: surface,
                        padding: "12px 16px",
                        borderRadius: 12,
                        maxWidth: "70%",
                        fontSize: 14,
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        {msg.text}
                      </div>
                      {msg.action && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 8,
                            fontSize: 12,
                            opacity: 0.9,
                          }}
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.2)",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 10,
                            }}
                          >
                            {msg.user?.charAt(0) || "U"}
                          </div>
                          <span>{msg.action}</span>
                        </div>
                      )}
                      <div style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: surface,
                        color: "#1f2937",
                        padding: "12px 16px",
                        borderRadius: 12,
                        maxWidth: "70%",
                        fontSize: 14,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div>{msg.text}</div>
                      <div
                        style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#9ca3af",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                  <div>No messages yet</div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e5e7eb",
              background: surface,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message"
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 20,
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              />
              <button
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 20,
                  background: green,
                  color: surface,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = green;
                }}
              >
                Trade
              </button>
              <button
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  color: "#6b7280",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <FaSmile />
              </button>

              <button
                onClick={handleSend}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: primary,
                  color: surface,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = primary;
                }}
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
