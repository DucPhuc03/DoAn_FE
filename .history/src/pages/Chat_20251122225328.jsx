import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import TradeModal from "../components/TradeModal";
import PlanModal from "../components/PlanModal";
import {
  FaEllipsisV,
  FaSmile,
  FaPaperclip,
  FaArrowUp,
  FaDollarSign,
} from "react-icons/fa";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Cookies from "js-cookie";

if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

const sampleConversations = [
  {
    conversationId: 1,
    itemTitle: "iPhone 16",
    itemImage: null,
    username: null,
    userAvatar: null,
    messages: [
      {
        id: 1,
        senderId: 1,
        senderName: "phuc",
        timestamp: "2025-11-06T15:52:35.540464",
        avatarUrl:
          "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761970519508_58791216101f9d41c40e.jpg",
        content: "hello",
        read: false,
        me: true,
      },
      {
        id: 2,
        senderId: 1,
        senderName: null,
        timestamp: "2025-11-06T17:29:01.105307",
        avatarUrl:
          "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761838431539_58791216101f9d41c40e.jpg",
        content: "hello",
        read: false,
        me: true,
      },
      {
        id: 3,
        senderId: 2,
        senderName: "phucabc",
        timestamp: "2025-11-06T17:30:02.697978",
        avatarUrl:
          "https://traodoido.s3.ap-southeast-1.amazonaws.com/profile/1761970519508_58791216101f9d41c40e.jpg",
        content: "hello",
        read: false,
        me: false,
      },
    ],
  },
  {
    conversationId: 2,
    itemTitle: "Áo khoác Canada Goose",
    itemImage: "https://via.placeholder.com/40x40.png?text=🧥",
    username: "ThuHien",
    userAvatar: "https://via.placeholder.com/48x48.png?text=TH",
    messages: [
      {
        id: 11,
        senderId: 9,
        senderName: "ThuHien",
        timestamp: "2025-11-10T08:11:00.000Z",
        avatarUrl: "https://via.placeholder.com/48x48.png?text=TH",
        content: "Áo còn nguyên tag chứ bạn?",
        read: true,
        me: false,
      },
      {
        id: 12,
        senderId: 1,
        senderName: "Bạn",
        timestamp: "2025-11-10T08:12:30.000Z",
        avatarUrl: null,
        content: "Nguyên tag và còn ấm lắm nha!",
        read: true,
        me: true,
      },
    ],
  },
  {
    conversationId: 3,
    itemTitle: "Bộ bàn học trẻ em",
    itemImage: "https://via.placeholder.com/40x40.png?text=🪑",
    username: "GreenHouse",
    userAvatar: null,
    messages: [
      {
        id: 21,
        senderId: 6,
        senderName: "GreenHouse",
        timestamp: "2025-11-11T13:45:10.000Z",
        avatarUrl: null,
        content: "Bạn có thể gửi thêm ảnh bàn không?",
        read: false,
        me: false,
      },
    ],
  },
];

const Chat = () => {
  const [leftTab, setLeftTab] = useState("chats"); // chats | meetings

  const [conversations, setConversations] = useState(sampleConversations);

  const [selectedConversationId, setSelectedConversationId] = useState(
    sampleConversations[0]?.conversationId
  );
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find((c) => c.conversationId === selectedConversationId) ||
      conversations[0],
    [conversations, selectedConversationId]
  );

  useEffect(() => {
    if (!selectedConversationId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);
    stompClientRef.current = client;
    const token = Cookies.get("access_token");

    client.connect(
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      () => {
        console.log(
          `WebSocket connected for conversation ${selectedConversationId}`
        );

        // Subscribe to the chat topic
        const topic = `/chat-trade/${selectedConversationId}`;
        subscriptionRef.current = client.subscribe(topic, (message) => {
          try {
            const messageData = JSON.parse(message.body);
            console.log("Received message:", messageData);

            // Update conversations with the new message
            setConversations((prev) =>
              prev.map((conversation) =>
                conversation.conversationId === selectedConversationId
                  ? {
                      ...conversation,
                      messages: [...conversation.messages, messageData],
                    }
                  : conversation
              )
            );
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        console.log(`Subscribed to topic: ${topic}`);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      // Unsubscribe from the topic
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      // Disconnect WebSocket
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("WebSocket disconnected");
        });
        stompClientRef.current = null;
      }
    };
  }, [selectedConversationId]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedConversation || !stompClientRef.current) return;

    // Check if WebSocket is connected
    if (!stompClientRef.current.connected) {
      console.error("WebSocket is not connected");
      return;
    }

    // Send message to backend via WebSocket
    const destination = `/app/chat.sendMessage/${selectedConversationId}`;

    // Backend expects String, so we send the message content as JSON string
    const messagePayload = JSON.stringify({
      content: trimmed,
    });

    stompClientRef.current.send(destination, {}, messagePayload);
    console.log(`Sent message to ${destination}:`, trimmed);

    // Clear input field
    setInputValue("");

    // Note: Message will be received via subscription and added to conversations automatically
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
      });
    } catch (error) {
      return timestamp;
    }
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
            {conversations.map((conversation) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1];
              const displayName =
                conversation.username ||
                lastMessage?.senderName ||
                "Người dùng";
              const preview = lastMessage?.content || "Chưa có tin nhắn";
              const timestamp = formatTimestamp(lastMessage?.timestamp);
              const avatar =
                conversation.userAvatar || lastMessage?.avatarUrl || null;
              const isActive =
                selectedConversationId === conversation.conversationId;

              return (
                <div
                  key={conversation.conversationId}
                  onClick={() =>
                    setSelectedConversationId(conversation.conversationId)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px",
                    cursor: "pointer",
                    background: isActive ? "#f3f4f6" : surface,
                    borderBottom: "1px solid #f3f4f6",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = surface;
                    }
                  }}
                >
                  {/* Avatar */}
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={displayName}
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
                      {displayName.charAt(0)}
                    </div>
                  )}

                  {/* Item Image (small) */}
                  {conversation.itemImage ? (
                    <img
                      src={conversation.itemImage}
                      alt={conversation.itemTitle}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: "#ede9fe",
                        color: "#6d5dfc",
                        fontSize: 14,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        fontWeight: 600,
                      }}
                    >
                      {conversation.itemTitle?.charAt(0) || "?"}
                    </div>
                  )}

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
                      {displayName}
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
                      {preview}
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
                    {timestamp}
                  </div>
                </div>
              );
            })}
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
            {selectedConversation?.userAvatar ? (
              <img
                src={selectedConversation.userAvatar}
                alt={selectedConversation.username || "Người dùng"}
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
                {selectedConversation?.username?.charAt(0) || "U"}
              </div>
            )}

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#1f2937",
                  width: "200px",
                }}
              >
                {selectedConversation?.username || "Người dùng"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", width: "200px" }}>
                {selectedConversation?.itemTitle || "Đang trao đổi"}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => setShowTradeModal(true)}
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
                Xem
              </button>
              <button
                onClick={() => setShowPlanModal(true)}
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
                Lên lịch
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
            {selectedConversation?.messages &&
            selectedConversation.messages.length > 0 ? (
              selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.me ? "flex-end" : "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      background: msg.me ? primary : surface,
                      color: msg.me ? surface : "#1f2937",
                      padding: "12px 16px",
                      borderRadius: 12,
                      maxWidth: "70%",
                      fontSize: 14,
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div>{msg.content}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: msg.me ? "rgba(255,255,255,0.8)" : "#9ca3af",
                        marginTop: 4,
                      }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
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

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal
          onClose={() => setShowTradeModal(false)}
          conversation={selectedConversation}
        />
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <PlanModal
          onClose={() => setShowPlanModal(false)}
          conversation={selectedConversation}
        />
      )}
    </div>
  );
};

export default Chat;
