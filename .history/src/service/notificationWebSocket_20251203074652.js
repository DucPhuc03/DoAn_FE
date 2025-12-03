import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Cookies from "js-cookie";

let stompClient = null;
let subscribed = false;

// Hiển thị toast ở góc phải, tự ẩn sau 5s
const showNotificationToast = (message) => {
  if (typeof document === "undefined") return;

  // Tạo container chung nếu chưa có
  let container = document.getElementById("trade-notification-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "trade-notification-toast-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      pointerEvents: "none",
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    minWidth: "260px",
    maxWidth: "360px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "#323232",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    pointerEvents: "auto",
    opacity: "0",
    transform: "translateX(16px)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  });

  container.appendChild(toast);

  // Hiện toast (animate)
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  // Ẩn sau 5s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(16px)";
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
      // Nếu không còn toast nào thì bỏ container
      if (!container.hasChildNodes() && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 200);
  }, 5000);
};

export const connectNotificationWebSocket = () => {
  // Nếu đã có kết nối và đã subscribe thì bỏ qua
  if (stompClient && stompClient.connected && subscribed) {
    return;
  }

  // Lấy URL WebSocket (giống Chat.jsx)
  const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  const socket = new SockJS(wsUrl);
  const client = Stomp.over(socket);

  // Tắt log debug
  client.debug = () => {};

  const token = Cookies.get("access_token");
  const connectHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  client.connect(
    connectHeaders,
    () => {
      console.log("Notification WebSocket connected");
      stompClient = client;
      const destination = "/user/queue/notification";

      client.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          console.log("Received trade notification:", payload);

          const content =
            payload.notifyContent ||
            `${payload.requesterName || "Ai đó"} muốn trao đổi với bạn.`;

          // Thay alert bằng toast góc phải, xuất hiện trong 5s
          showNotificationToast(content);
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      });

      subscribed = true;
      console.log(`Subscribed to notification destination: ${destination}`);
    },
    (error) => {
      console.error("Notification WebSocket error:", error);
    }
  );
};
