import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TradeModal from "../components/TradeModal";
import PlanModal from "../components/PlanModal";
import { FaEllipsisV, FaArrowUp } from "react-icons/fa";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Cookies from "js-cookie";
import {
  getConversation,
  deleteConversation,
} from "../service/ConversationService";
import { acceptedMeeting, cancelMeeting } from "../service/MeetingService";
import { updateTradeStatus } from "../service/TradeService";
import "../css/Chat.css";

if (typeof window !== "undefined" && typeof window.global === "undefined") {
  window.global = window;
}

const Chat = () => {
  const navigate = useNavigate();
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

  const partnerId = useMemo(() => {
    const partner = selectedConversation?.partner || {};
    return (
      partner.id ||
      partner.userId ||
      selectedConversation?.partnerId ||
      selectedConversation?.partner?.user_id ||
      null
    );
  }, [selectedConversation]);

  const handleOpenPartnerProfile = () => {
    if (partnerId) {
      navigate(`/profile/${partnerId}`);
    }
  };

  const handleOpenPostDetail = () => {
    const postId =
      selectedConversation?.postId ||
      selectedConversation?.postID ||
      selectedConversation?.itemId ||
      selectedConversation?.itemID ||
      selectedConversation?.ownerPostId ||
      selectedConversation?.requesterPostId;
    if (postId) {
      navigate(`/post/${postId}`);
    }
  };

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

  const handleDeleteConversation = async () => {
    if (!selectedConversation?.conversationId) {
      alert("Không tìm thấy cuộc trò chuyện");
      return;
    }

    if (
      !window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")
    ) {
      return;
    }

    try {
      const response = await deleteConversation(
        selectedConversation.conversationId
      );
      alert("Đã xóa cuộc trò chuyện");
      await refreshConversations();
      // Reset selected conversation
      setSelectedConversationId(null);
      // Close dropdown
      setShowHeaderActions(false);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Không thể xóa cuộc trò chuyện. Vui lòng thử lại.");
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
    <div className="chat-page">
      <Header />

      <div className="chat-container">
        {/* Left Sidebar - Trade List */}
        <div className="chat-sidebar">
          {/* Tabs */}
          <div className="chat-tabs">
            <button
              onClick={() => setLeftTab("chats")}
              className={`chat-tab-btn ${leftTab === "chats" ? "active" : ""}`}
            >
              Trò chuyện
            </button>
            <button
              onClick={() => setLeftTab("meetings")}
              className={`chat-tab-btn ${
                leftTab === "meetings" ? "active" : ""
              }`}
            >
              Cuộc họp
            </button>
          </div>

          {/* Trade List */}
          <div className="chat-list">
            {loading ? (
              <div className="chat-loading">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="chat-loading-text">
                  Đang tải cuộc trò chuyện...
                </div>
              </div>
            ) : tabGroups.length === 0 ? (
              <div className="chat-empty">
                <i className="bi bi-chat-dots chat-empty-icon"></i>
                <div className="chat-empty-text">
                  Chưa có cuộc trò chuyện nào
                </div>
              </div>
            ) : (
              tabGroups.map((group) => {
                const isOpen = expandedGroups.has(group.partnerId);
                const totalConvs = group.conversations.length;

                return (
                  <div key={group.partnerId}>
                    {/* Group Header */}
                    <div
                      onClick={() => toggleGroup(group.partnerId)}
                      className="chat-group-header"
                    >
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          alt={group.username}
                          className="chat-group-avatar"
                        />
                      ) : (
                        <div className="chat-group-avatar-placeholder">
                          {group.username.charAt(0)}
                        </div>
                      )}

                      <div className="chat-group-info">
                        <div className="chat-group-name">{group.username}</div>
                        <div className="chat-group-count">
                          {totalConvs} cuộc trao đổi
                        </div>
                      </div>
                    </div>

                    {/* Conversation Items */}
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
                            className={`chat-item ${isActive ? "active" : ""}`}
                          >
                            {conversation.itemImage ? (
                              <img
                                src={conversation.itemImage}
                                alt={itemTitle}
                                className="chat-item-image"
                              />
                            ) : (
                              <div className="chat-item-image-placeholder">
                                {itemTitle?.charAt(0) || "?"}
                              </div>
                            )}

                            <div className="chat-item-info">
                              <div className="chat-item-title">{itemTitle}</div>
                              <div className="chat-item-preview">{preview}</div>
                            </div>

                            <div className="chat-item-time">{timestamp}</div>
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
        <div className="chat-main">
          {/* Chat Header */}
          <div className="chat-header">
            {/* LEFT: avatar + thumbnail */}
            <div className="chat-header-left">
              {selectedConversation?.userAvatar ? (
                <img
                  src={selectedConversation.userAvatar}
                  alt={selectedConversation.username || "Người dùng"}
                  className="chat-header-avatar"
                  onClick={handleOpenPartnerProfile}
                  style={{ cursor: partnerId ? "pointer" : "default" }}
                />
              ) : (
                <div
                  className="chat-header-avatar-placeholder"
                  onClick={handleOpenPartnerProfile}
                  style={{ cursor: partnerId ? "pointer" : "default" }}
                >
                  {selectedConversation?.username?.charAt(0) || "U"}
                </div>
              )}

              {selectedConversation?.itemImage ? (
                <img
                  src={selectedConversation.itemImage}
                  alt={selectedConversation.itemTitle || "Sản phẩm"}
                  className="chat-header-item-image"
                  onClick={handleOpenPostDetail}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <div
                  className="chat-header-item-placeholder"
                  onClick={handleOpenPostDetail}
                  style={{ cursor: "pointer" }}
                >
                  {selectedConversation?.itemTitle?.charAt(0) || "?"}
                </div>
              )}
            </div>

            {/* MIDDLE: title + info */}
            <div className="chat-header-middle">
              <div className="chat-header-title">
                {selectedConversation?.itemTitle || "Đang trao đổi"}
              </div>

              <div className="chat-header-subtitle">
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

              {selectedConversation?.meeting && (
                <>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className={`chat-header-status ${
                        selectedConversation.meeting.status === "WAITING"
                          ? "waiting"
                          : selectedConversation.meeting.status === "SCHEDULED"
                          ? "scheduled"
                          : "cancelled"
                      }`}
                    >
                      {selectedConversation.meeting.status === "WAITING" &&
                        (selectedConversation.meeting.creator
                          ? "Đang chờ xác nhận"
                          : "Lịch hẹn chờ bạn xác nhận")}
                      {selectedConversation.meeting.status === "SCHEDULED" &&
                        "Đã xác nhận lịch hẹn"}
                      {selectedConversation.meeting.status === "CANCELLED" &&
                        "Lịch hẹn đã hủy"}
                    </div>
                    {selectedConversation.meeting.status === "SCHEDULED" && (
                      <button
                        onClick={handleCancelMeeting}
                        className="chat-btn-cancel-small"
                        title="Hủy lịch hẹn"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>

                  {selectedConversation.meeting.status === "WAITING" &&
                    !selectedConversation.meeting.creator && (
                      <div className="chat-header-actions-row">
                        <button
                          onClick={handleAcceptMeeting}
                          className="chat-btn chat-btn-green chat-btn-pill"
                        >
                          Đồng ý
                        </button>
                        <button
                          onClick={handleRejectMeeting}
                          className="chat-btn chat-btn-red chat-btn-pill"
                        >
                          Hủy bỏ
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>

            {/* RIGHT: action buttons */}
            <div className="chat-header-right">
              <button
                onClick={() => setShowTradeModal(true)}
                className="chat-btn chat-btn-yellow"
              >
                Xem
              </button>

              {selectedConversation?.meeting ? (
                <>
                  {selectedConversation.meeting.canEdit && (
                    <button
                      onClick={() => setShowPlanModal(true)}
                      className="chat-btn chat-btn-yellow"
                    >
                      Sửa lịch
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="chat-btn chat-btn-yellow"
                >
                  Lên lịch
                </button>
              )}

              <div style={{ position: "relative" }}>
                <button
                  className="chat-btn-menu"
                  onClick={() => setShowHeaderActions((prev) => !prev)}
                >
                  <FaEllipsisV />
                </button>
                {showHeaderActions && (
                  <div className="chat-header-dropdown">
                    <button
                      className="chat-dropdown-btn"
                      onClick={handleCompleteTradeFromHeader}
                      disabled={headerActionLoading}
                    >
                      {headerActionLoading ? "Đang xử lý..." : "Hoàn thành"}
                    </button>
                    {selectedConversation?.meeting?.status !== "SCHEDULED" && (
                      <button
                        className="chat-dropdown-btn"
                        onClick={handleDeleteConversation}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {selectedConversation?.messages &&
            selectedConversation.messages.length > 0 ? (
              selectedConversation.messages.map((msg) => {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.id;
                const isMyMessage = msg.senderId === userId;

                return (
                  <div
                    key={msg.id}
                    className={`chat-message ${
                      isMyMessage ? "sent" : "received"
                    }`}
                  >
                    <div className="chat-message-bubble">
                      <div>{msg.content}</div>
                      <div className="chat-message-time">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="chat-no-messages">
                <div>
                  <div className="chat-no-messages-icon">💬</div>
                  <div>No messages yet</div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="chat-input-row">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message"
                className="chat-input"
              />
              <button className="chat-trade-btn">Trade</button>
              <button
                onClick={handleSend}
                disabled={!wsConnected || !inputValue.trim()}
                className={`chat-send-btn ${
                  wsConnected && inputValue.trim() ? "active" : "disabled"
                }`}
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
