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
import { getConversation } from "../service/conversation/ConversationService";

if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

const Chat = () => {
  const [leftTab, setLeftTab] = useState("chats"); // chats | meetings

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find((c) => c.conversationId === selectedConversationId) ||
      conversations[0],
    [conversations, selectedConversationId]
  );

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getConversation();

        // Handle API response structure
        let conversationsData = [];
        if (response?.data) {
          conversationsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          conversationsData = response;
        }

        // Transform data if needed to match expected structure
        const transformedConversations = conversationsData.map((conv) => ({
          conversationId: conv.conversationId || conv.id,
          itemTitle: conv.itemTitle || conv.postTitle,
          itemImage: conv.itemImage || conv.postImage,
          username: conv.username || conv.partnerUsername,
          userAvatar: conv.userAvatar || conv.partnerAvatar,
          messages: conv.messages || [],
          meeting: conv.meeting || null,
          tradeId: conv.tradeId || null,
        }));

        setConversations(transformedConversations);

        // Set first conversation as selected if available
        if (transformedConversations.length > 0) {
          setSelectedConversationId(
            (prev) => prev || transformedConversations[0].conversationId
          );
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Không thể tải danh sách cuộc trò chuyện");
        // Fallback to sample data if API fails
        setConversations(sampleConversations);
        if (sampleConversations.length > 0) {
          setSelectedConversationId(
            (prev) => prev || sampleConversations[0].conversationId
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      setWsConnected(false);
      return;
    }

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Cleanup previous connection
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        console.warn("Error unsubscribing:", e);
      }
      subscriptionRef.current = null;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        stompClientRef.current.disconnect(() => {
          console.log("Previous WebSocket disconnected");
        });
      } catch (e) {
        console.warn("Error disconnecting:", e);
      }
      stompClientRef.current = null;
    }

    setWsConnected(false);
    setWsError(null);

    // Get WebSocket URL from environment or use default
    const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
    const socket = new SockJS(wsUrl);
    const client = Stomp.over(socket);

    // Disable debug logging in production
    client.debug = () => {}; // Suppress STOMP debug logs

    stompClientRef.current = client;
    const token = Cookies.get("access_token");

    const connectHeaders = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    client.connect(
      connectHeaders,
      () => {
        console.log(
          `WebSocket connected for conversation ${selectedConversationId}`
        );
        setWsConnected(true);
        setWsError(null);

        // Subscribe to the chat topic
        const topic = `/chat-trade/${selectedConversationId}`;
        try {
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
        } catch (error) {
          console.error("Error subscribing to topic:", error);
        }
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        setWsConnected(false);

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (selectedConversationId) {
            // Trigger reconnection by updating a state or re-running effect
            console.log("Attempting to reconnect WebSocket...");
            setWsError(null);
            // Force re-render to reconnect
            setSelectedConversationId((prev) => prev);
          }
        }, 3000);
      }
    );

    return () => {
      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Unsubscribe from the topic
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (e) {
          console.warn("Error unsubscribing in cleanup:", e);
        }
        subscriptionRef.current = null;
      }

      // Disconnect WebSocket
      if (stompClientRef.current) {
        try {
          if (stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
              console.log("WebSocket disconnected");
            });
          }
        } catch (e) {
          console.warn("Error disconnecting in cleanup:", e);
        }
        stompClientRef.current = null;
      }

      setWsConnected(false);
    };
  }, [selectedConversationId]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedConversation || !stompClientRef.current) return;

    // Get userId from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const senderId = user?.id;

    // Check if WebSocket is connected
    if (!stompClientRef.current.connected) {
      // Try to reconnect
      if (selectedConversationId) {
        setSelectedConversationId((prev) => prev);
      }
      return;
    }

    try {
      // Send message to backend via WebSocket
      const destination = `/app/chat.sendMessage/${selectedConversationId}`;

      // Backend expects ChatMessageDTO with senderId and content
      const messagePayload = JSON.stringify({
        senderId: senderId,
        content: trimmed,
      });

      stompClientRef.current.send(destination, {}, messagePayload);
      console.log(`Sent message to ${destination}:`, {
        senderId,
        content: trimmed,
      });

      // Clear input field
      setInputValue("");
      setWsError(null);

      // Note: Message will be received via subscription and added to conversations automatically
    } catch (error) {
      console.error("Error sending message:", error);
      setWsError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
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
            {loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 12,
                  color: "#6b7280",
                }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div style={{ fontSize: 14 }}>Đang tải cuộc trò chuyện...</div>
              </div>
            ) : conversations.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 12,
                  color: "#9ca3af",
                }}
              >
                <i className="bi bi-chat-dots" style={{ fontSize: 48 }}></i>
                <div style={{ fontSize: 14 }}>Chưa có cuộc trò chuyện nào</div>
              </div>
            ) : (
              conversations.map((conversation) => {
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];
                const displayName =
                  conversation.username ||
                  lastMessage?.senderName ||
                  "Người dùng";
                const itemTitle = conversation.itemTitle || "Sản phẩm";
                const preview = lastMessage?.content || "Chưa có tin nhắn";
                const timestamp = formatTimestamp(lastMessage?.timestamp);
                const avatar = conversation.userAvatar || null;
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
                        {itemTitle}
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
              })
            )}
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
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div>
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
              {/* Meeting Info */}
              {selectedConversation?.meeting && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      color: "black",
                      fontSize: 16,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <i className="bi bi-calendar-event"></i>
                      Lịch hẹn
                    </div>

                    {selectedConversation.meeting.meetingDate && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <i
                          className="bi bi-calendar"
                          style={{ fontSize: 11 }}
                        ></i>
                        <span>
                          {new Date(
                            selectedConversation.meeting.meetingDate
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                    {selectedConversation.meeting.time && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <i className="bi bi-clock" style={{ fontSize: 11 }}></i>
                        <span>{selectedConversation.meeting.time}</span>
                      </div>
                    )}
                    {selectedConversation.meeting.location && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <i
                          className="bi bi-geo-alt"
                          style={{ fontSize: 11 }}
                        ></i>
                        <span>{selectedConversation.meeting.location}</span>
                      </div>
                    )}
                  </div>
                  {/* Accept/Reject Buttons */}
                  {!selectedConversation.meeting.creator &&
                    selectedConversation.meeting.status === "WAITING" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            // TODO: Implement accept meeting
                            console.log("Accept meeting");
                          }}
                          style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 8,
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
                          Đồng ý
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Implement reject meeting
                            console.log("Reject meeting");
                          }}
                          style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: 8,
                            background: "#c33131ff",
                            color: surface,
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dc2626";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ef4444";
                          }}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginRight: "50px",
              }}
            >
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
              {selectedConversation?.meeting ? (
                <>
                  {selectedConversation.meeting.canEdit && (
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
                      Sửa lịch
                    </button>
                  )}
                </>
              ) : (
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
              )}
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
              selectedConversation.messages.map((msg) => {
                // Get current user ID from localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id;
                const isMyMessage = msg.senderId === userId;

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMyMessage ? "flex-end" : "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        background: isMyMessage ? primary : surface,
                        color: isMyMessage ? surface : "#1f2937",
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
                          color: isMyMessage
                            ? "rgba(255,255,255,0.8)"
                            : "#9ca3af",
                          marginTop: 4,
                        }}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
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

          {/* Connection Status */}
          {/* {wsError && (
            <div
              style={{
                padding: "8px 20px",
                background: "#fef2f2",
                borderTop: "1px solid #fecaca",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="bi bi-exclamation-triangle text-danger"></i>
                <small className="text-danger">{wsError}</small>
              </div>
              <button
                onClick={() => {
                  setWsError(null);
                  if (selectedConversationId) {
                    setSelectedConversationId((prev) => prev);
                  }
                }}
                className="btn btn-sm btn-outline-danger"
                style={{ fontSize: "12px", padding: "2px 8px" }}
              >
                Thử lại
              </button>
            </div>
          )} */}

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
                disabled={!wsConnected || !inputValue.trim()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    wsConnected && inputValue.trim() ? primary : "#9ca3af",
                  color: surface,
                  display: "grid",
                  placeItems: "center",
                  cursor:
                    wsConnected && inputValue.trim()
                      ? "pointer"
                      : "not-allowed",
                  transition: "all 0.2s",
                  opacity: wsConnected && inputValue.trim() ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (wsConnected && inputValue.trim()) {
                    e.currentTarget.style.background = "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (wsConnected && inputValue.trim()) {
                    e.currentTarget.style.background = primary;
                  }
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
          tradeId={
            selectedConversation?.tradeId ||
            selectedConversation?.conversationId
          }
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
