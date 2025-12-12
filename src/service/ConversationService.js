import axios from "../config/config-axios";

export async function getConversation() {
  const { data } = await axios.get("/api/conversation");
  return data;
}
export async function createConversation(postId) {
  const { data } = await axios.post("/api/conversation", { postId });
  return data;
}









