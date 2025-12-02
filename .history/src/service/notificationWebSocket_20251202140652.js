import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Cookies from "js-cookie";

let stompClient = null;
let subscribed = false;

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

      // Ở backend bạn dùng convertAndSendToUser(..., "/queue/notification", payload)
      // Với userDestinationPrefix = "/private", client cần subscribe: /private/queue/notification
      // Spring sẽ tự route đúng theo user đã xác thực (principal)
      const destination = "/user/queue/notification";

      client.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          console.log("Received trade notification:", payload);

          const content =
            payload.notifyContent ||
            `${payload.requesterName || "Ai đó"} muốn trao đổi với bạn.`;

          // Ở đây đơn giản dùng alert; bạn có thể thay thế bằng toast hoặc UI đẹp hơn
          alert(content);
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
