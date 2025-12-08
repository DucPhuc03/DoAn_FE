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
import { getConversation } from "../service/ConversationService";
import { acceptedMeeting, cancelMeeting } from "../service/MeetingService";
import { updateTradeStatus } from "../service/TradeService";

if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

const Chat = () => {
  const [leftTab, setLeftTab] = useState("chats"); // chats | meetings

  const [conversations, setConversations] = useState([]); // flat list từ API
  const [expandedGroups, setExpandedGroups] = useState(new Set()); // group nào đang mở
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

  // Gom nhóm conversations theo partner để render dropdown
  const groupedConversations = useMemo(() => {
    const groupsMap = new Map();

    conversations.forEach((conv) => {
      const partner = conv.partner || {};
      const partnerId =
        partner.id ||
        partner.userId ||
        conv.partnerId ||
        conv.username ||
        conv.partnerUsername ||
        "unknown";

      if (!groupsMap.has(partnerId)) {
        groupsMap.set(partnerId, {
          partnerId,
          username:
            partner.username ||
            conv.username ||
            conv.partnerUsername ||
            "Người dùng",
          avatar:
            partner.avatarUrl || conv.userAvatar || conv.partnerAvatar || null,
          conversations: [],
        });
      }

      groupsMap.get(partnerId).conversations.push(conv);
    });

    return Array.from(groupsMap.values());
  }, [conversations]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getConversation();

        // Transform new response structure:
        // data is an object with keys (user group) -> array of conversations
        const conversationsData = [];
        if (response?.data && typeof response.data === "object") {
          Object.values(response.data).forEach((group) => {
            if (Array.isArray(group)) {
              group.forEach((conv) => conversationsData.push(conv));
            }
          });
        } else if (Array.isArray(response)) {
          conversationsData.push(...response);
        }

        const transformedConversations = conversationsData.map((conv) => {
          const partner = conv.partner || {};
          return {
            conversationId: conv.conversationId || conv.id,
            itemTitle: conv.itemTitle || conv.postTitle,
            itemImage: conv.itemImage || conv.postImage,
            username:
              partner.username ||
              conv.username ||
              conv.partnerUsername ||
              "Người dùng",
            userAvatar:
              partner.avatarUrl ||
              conv.userAvatar ||
              conv.partnerAvatar ||
              null,
            messages: Array.isArray(conv.messages) ? conv.messages : [],
            meeting: conv.meeting || null,
            tradeId: conv.tradeId || null,
            partner,
          };
        });

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

  // Refresh conversations to update meeting status
  const refreshConversations = async () => {
    try {
      const response = await getConversation();
      const conversationsData = [];

      if (response?.data && typeof response.data === "object") {
        Object.values(response.data).forEach((group) => {
          if (Array.isArray(group)) {
            group.forEach((conv) => conversationsData.push(conv));
          }
        });
      } else if (Array.isArray(response)) {
        conversationsData.push(...response);
      }

      const transformedConversations = conversationsData.map((conv) => {
        const partner = conv.partner || {};
        return {
          conversationId: conv.conversationId || conv.id,
          itemTitle: conv.itemTitle || conv.postTitle,
          itemImage: conv.itemImage || conv.postImage,
          username:
            partner.username ||
            conv.username ||
            conv.partnerUsername ||
            "Người dùng",
          userAvatar:
            partner.avatarUrl || conv.userAvatar || conv.partnerAvatar || null,
          messages: Array.isArray(conv.messages) ? conv.messages : [],
          meeting: conv.meeting || null,
          tradeId: conv.tradeId || null,
          partner,
        };
      });

      setConversations(transformedConversations);
    } catch (err) {
      console.error("Error refreshing conversations:", err);
    }
  };

  const handleAcceptMeeting = async () => {
    if (
      !window.confirm("Bạn có chắc chắn muốn chấp nhận lịch hẹn này không?")
    ) {
      return;
    }
    if (!selectedConversation?.meeting?.meetingId) return;

    try {
      await acceptedMeeting(selectedConversation.meeting.meetingId);
      // Refresh conversations to update meeting status
      await refreshConversations();
    } catch (error) {
      console.error("Error accepting meeting:", error);
      alert("Không thể chấp nhận lịch hẹn. Vui lòng thử lại.");
    }
  };

  const handleRejectMeeting = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn từ chối lịch hẹn này không?")) {
      return;
    }
    if (!selectedConversation?.meeting?.meetingId) return;

    try {
      await cancelMeeting(selectedConversation.meeting.meetingId);
      // Refresh conversations to update meeting status
      await refreshConversations();
    } catch (error) {
      console.error("Error rejecting meeting:", error);
      alert("Không thể từ chối lịch hẹn. Vui lòng thử lại.");
    }
  };

  const handleCancelMeeting = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
      return;
    }
    if (!selectedConversation?.meeting?.meetingId) return;

    try {
      await cancelMeeting(selectedConversation.meeting.meetingId);
      // Refresh conversations to update meeting status
      await refreshConversations();
    } catch (error) {
      console.error("Error canceling meeting:", error);
      alert("Không thể hủy lịch hẹn. Vui lòng thử lại.");
    }
  };

  const primary = "#2563eb"; // Blue
  const yellow = "#fbbf24"; // Yellow
  const green = "#10b981"; // Green
  const purple = "#a855f7"; // Purple
  const surface = "#ffffff";
  const bgLight = "#f8f9fa";
  const [showHeaderActions, setShowHeaderActions] = useState(false);
  const [headerActionLoading, setHeaderActionLoading] = useState(false);

  const handleCompleteTradeFromHeader = async () => {
    if (!selectedConversation?.tradeId) {
      alert("Không tìm thấy mã trao đổi");
      return;
    }
    try {
      setHeaderActionLoading(true);
      const response = await updateTradeStatus(selectedConversation.tradeId);
      if (response?.code === 1000) {
        alert("Đã cập nhật trạng thái trao đổi");
        await refreshConversations();
      } else {
        alert(response?.message || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating trade status:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setHeaderActionLoading(false);
      setShowHeaderActions(false);
    }
  };

  // Tạo list dùng cho tab (Chats / Meetings)
  const tabGroups = useMemo(() => {
    if (leftTab === "chats") return groupedConversations;

    // Tab meetings: chỉ các cuộc có meeting
    return groupedConversations
      .map((g) => ({
        ...g,
        conversations: g.conversations.filter((c) => c.meeting),
      }))
      .filter((g) => g.conversations.length > 0);
  }, [leftTab, groupedConversations]);

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
            ) : tabGroups.length === 0 ? (
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
              tabGroups.map((group) => {
                const isOpen = expandedGroups.has(group.partnerId);
                const totalConvs = group.conversations.length;

                return (
                  <div key={group.partnerId}>
                    {/* HEADER CỦA 1 NGƯỜI (dropdown) */}
                    <div
                      onClick={() => toggleGroup(group.partnerId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        cursor: "pointer",
                        background: "#f9fafb",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      {/* Avatar partner */}
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          alt={group.username}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#e5e7eb",
                            display: "grid",
                            placeItems: "center",
                            color: "#9ca3af",
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          {group.username.charAt(0)}
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#1f2937",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {group.username}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                          }}
                        >
                          {totalConvs} cuộc trao đổi
                        </div>
                      </div>

                      {/* icon dropdown + badge số cuộc */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      ></div>
                    </div>

                    {/* LIST CÁC CUỘC TRAO ĐỔI VỚI NGƯỜI NÀY */}
                    {isOpen &&
                      group.conversations.map((conversation) => {
                        const lastMessage =
                          conversation.messages[
                            conversation.messages.length - 1
                          ];
                        const itemTitle = conversation.itemTitle || "Sản phẩm";
                        const preview =
                          lastMessage?.content || "Chưa có tin nhắn";
                        const timestamp = formatTimestamp(
                          lastMessage?.timestamp
                        );
                        const isActive =
                          selectedConversationId ===
                          conversation.conversationId;

                        return (
                          <div
                            key={conversation.conversationId}
                            onClick={() =>
                              setSelectedConversationId(
                                conversation.conversationId
                              )
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 16px 10px 64px", // thụt vào cho dễ nhìn
                              cursor: "pointer",
                              background: isActive ? "#eef2ff" : "#ffffff",
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
                                e.currentTarget.style.background = "#ffffff";
                              }
                            }}
                          >
                            {/* Hình item */}
                            {conversation.itemImage ? (
                              <img
                                src={conversation.itemImage}
                                alt={itemTitle}
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
                                {itemTitle?.charAt(0) || "?"}
                              </div>
                            )}

                            {/* Thông tin trade */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: "#111827",
                                  marginBottom: 2,
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

                            {/* time */}
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
              gap: 16,
              padding: "12px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {/* LEFT: avatar + thumbnail sản phẩm */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexShrink: 0,
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

              {/* Thumbnail sản phẩm */}
              {selectedConversation?.itemImage ? (
                <img
                  src={selectedConversation.itemImage}
                  alt={selectedConversation.itemTitle || "Sản phẩm"}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#ede9fe",
                    color: "#6d5dfc",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {selectedConversation?.itemTitle?.charAt(0) || "?"}
                </div>
              )}
            </div>

            {/* MIDDLE: title + time + location + status */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {/* Title sản phẩm (giống "Size 6 Boots") */}
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#1f2937",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedConversation?.itemTitle || "Đang trao đổi"}
              </div>

              {/* Dòng thời gian + địa điểm (Dec 08, 10:00 PM · address) */}
              <div
                style={{
                  fontSize: 13,
                  color: "#4b5563",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedConversation?.meeting
                  ? [
                      selectedConversation.meeting.meetingDate
                        ? new Date(
                            selectedConversation.meeting.meetingDate
                          ).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : null,
                      selectedConversation.meeting.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : selectedConversation?.username || "Người dùng"}
              </div>

              {/* Trạng thái meeting: Waiting for confirmation */}
              {selectedConversation?.meeting && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    marginTop: 2,
                    color:
                      selectedConversation.meeting.status === "WAITING"
                        ? "#ef4444"
                        : selectedConversation.meeting.status === "SCHEDULED"
                        ? "#16a34a"
                        : "#6b7280",
                  }}
                >
                  {selectedConversation.meeting.status === "WAITING" &&
                    "Đang chờ xác nhận"}
                  {selectedConversation.meeting.status === "SCHEDULED" &&
                    "Đã xác nhận lịch hẹn"}
                  {selectedConversation.meeting.status === "CANCELLED" &&
                    "Lịch hẹn đã hủy"}
                </div>
              )}
            </div>

            {/* RIGHT: các nút action giữ nguyên như cũ */}
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

              <div style={{ position: "relative" }}>
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
                  onClick={() => setShowHeaderActions((prev) => !prev)}
                >
                  <FaEllipsisV />
                </button>
                {showHeaderActions && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      minWidth: 180,
                      zIndex: 10,
                    }}
                  >
                    <button
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                      onClick={handleCompleteTradeFromHeader}
                      disabled={headerActionLoading}
                    >
                      {headerActionLoading ? "Đang xử lý..." : "Hoàn thành"}
                    </button>
                    <button
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#dc2626",
                      }}
                      onClick={() => {
                        setShowHeaderActions(false);
                        alert("Chức năng báo cáo đang được phát triển");
                      }}
                    >
                      Báo cáo
                    </button>
                  </div>
                )}
              </div>
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
              >
                Trade
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
          onSuccess={refreshConversations}
        />
      )}
    </div>
  );
};

export default Chat;
