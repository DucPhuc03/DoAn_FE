import React, { useMemo, useState } from "react";
import Header from "../components/Header";

const Chat = () => {
  const [leftTab, setLeftTab] = useState("messages"); // messages | schedules

  // Fake data với nhiều cuộc trò chuyện
  const [threads, setThreads] = useState([
    {
      id: "t1",
      name: "Nguyễn Văn A",
      preview: "Tin nhắn...",
      avatar: "👤",
      messages: [],
      item: { title: "Tiêu đề", thumbnail: "🖼️" },
    },
    {
      id: "t2",
      name: "Trần Thị B",
      preview: "Cảm ơn bạn đã quan tâm",
      avatar: "👤",
      messages: [
        { id: 1, sender: "Trần Thị B", text: "Xin chào, bạn có muốn trao đổi không?" },
      ],
      item: { title: "Áo khoác mùa đông", thumbnail: "🧥" },
    },
    {
      id: "t3",
      name: "Lê Văn C",
      preview: "Sản phẩm còn hàng không?",
      avatar: "👤",
      messages: [
        { id: 1, sender: "Bạn", text: "Sản phẩm còn hàng không?" },
        { id: 2, sender: "Lê Văn C", text: "Còn bạn nhé, bạn muốn trao đổi gì?" },
      ],
      item: { title: "Sách lập trình", thumbnail: "📚" },
    },
    {
      id: "t4",
      name: "Phạm Thị D",
      preview: "Đã xem tin nhắn",
      avatar: "👤",
      messages: [],
      item: { title: "Bàn làm việc", thumbnail: "🪑" },
    },
    {
      id: "t5",
      name: "Hoàng Văn E",
      preview: "Bạn có thể gửi thêm ảnh không?",
      avatar: "👤",
      messages: [
        { id: 1, sender: "Hoàng Văn E", text: "Bạn có thể gửi thêm ảnh không?" },
      ],
      item: { title: "Giày thể thao", thumbnail: "👟" },
    },
  ]);

  const [selectedThreadId, setSelectedThreadId] = useState("t1");
  const selectedThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) || threads[0],
    [threads, selectedThreadId]
  );

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newMessage = { id: Date.now(), sender: "Bạn", text: trimmed };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? { ...t, messages: [...t.messages, newMessage], preview: trimmed }
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

  return (
    <div className="div">
      <Header />
      
      {/* Dark Grey Header with "Chat" */}
      <div className="bg-dark text-white py-2">
        <div className="container-fluid px-4">
          <h5 className="mb-0 fw-bold">Chat</h5>
        </div>
      </div>

      <div className="container-fluid p-0" style={{ height: "calc(100vh - 140px)" }}>
        <div className="row g-0 h-100">
          {/* Left Sidebar */}
          <div className="col-3 border-end bg-white d-flex flex-column" style={{ minWidth: "280px" }}>
            {/* Tabs */}
            <div className="d-flex px-3 pt-3 pb-2 border-bottom">
              <button
                className={`btn btn-sm border-0 px-3 py-2 d-flex align-items-center gap-2 ${
                  leftTab === "messages" ? "text-primary border-bottom border-primary border-2" : "text-muted"
                }`}
                onClick={() => setLeftTab("messages")}
                style={{ borderRadius: 0 }}
              >
                {leftTab === "messages" && <i className="bi bi-chat-dots"></i>}
                <span>Nhắn tin</span>
              </button>
              <button
                className={`btn btn-sm border-0 px-3 py-2 ${
                  leftTab === "schedules" ? "text-primary border-bottom border-primary border-2" : "text-muted"
                }`}
                onClick={() => setLeftTab("schedules")}
                style={{ borderRadius: 0 }}
              >
                Lịch hẹn
              </button>
            </div>

            {/* Chat List */}
            <div className="flex-grow-1 overflow-auto">
              {threads.map((t) => (
                <div
                  key={t.id}
                  role="button"
                  onClick={() => setSelectedThreadId(t.id)}
                  className={`d-flex align-items-center gap-3 px-3 py-3 border-bottom ${
                    selectedThreadId === t.id ? "bg-light" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-person text-white fs-5"></i>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold text-truncate">{t.name}</div>
                    <div className="small text-muted text-truncate">{t.preview}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Section */}
          <div className="col-3 border-end bg-white d-flex flex-column" style={{ minWidth: "280px" }}>
            {/* Header with avatar, name, and buttons */}
            <div className="d-flex align-items-center gap-3 px-3 py-3 border-bottom">
              <div
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "48px", height: "48px" }}
              >
                <i className="bi bi-person text-white fs-5"></i>
              </div>
              <div className="fw-semibold flex-grow-1">{selectedThread?.name}</div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-primary">Xem trao đổi</button>
                <button className="btn btn-sm btn-outline-primary">Đặt lịch</button>
              </div>
            </div>

            {/* Empty space or thread list */}
            <div className="flex-grow-1 overflow-auto p-3">
              {/* Có thể thêm danh sách tin nhắn hoặc để trống */}
            </div>
          </div>

          {/* Right Chat Panel */}
          <div className="col-6 bg-white d-flex flex-column">
            {/* Chat Messages Area */}
            <div className="flex-grow-1 overflow-auto p-4" style={{ background: "#f8f9fa" }}>
              {selectedThread?.messages.length > 0 ? (
                selectedThread.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`d-flex mb-3 ${
                      m.sender === "Bạn" ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-3 ${
                        m.sender === "Bạn" ? "bg-primary text-white" : "bg-white border shadow-sm"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <div className="text-center">
                    <i className="bi bi-chat-dots fs-1 mb-3"></i>
                    <p>Chưa có tin nhắn nào</p>
                  </div>
                </div>
              )}

              {/* Product/Item Block (Blue) - shown at bottom of messages */}
              {selectedThread && (
                <div className="mt-auto">
                  <div
                    className="bg-primary text-white rounded-3 p-3 d-flex align-items-center gap-3"
                    style={{ maxWidth: "300px" }}
                  >
                    <div
                      className="bg-white bg-opacity-20 rounded d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i className="bi bi-image text-white fs-4"></i>
                    </div>
                    <div className="fw-semibold">{selectedThread.item.title}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-top px-3 py-3 bg-white">
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-link text-muted p-2">
                  <i className="bi bi-emoji-smile fs-5"></i>
                </button>
                <button className="btn btn-link text-muted p-2">
                  <i className="bi bi-paperclip fs-5"></i>
                </button>
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill px-3 py-2"
                  placeholder="Nhập tin nhắn..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: "0.95rem" }}
                />
                <button
                  className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                  onClick={handleSend}
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
