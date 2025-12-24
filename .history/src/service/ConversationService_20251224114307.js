import axios from "../config/config-axios";

export async function getConversation() {
  const { data } = await axios.get("/api/conversation");
  return data;
}

export async function deleteConversation(id) {
  const { data } = await axios.delete(`/api/conversation/${id}`);
  return data;
}
export async function createConversation(postId) {
  const { data } = await axios.post("/api/conversation", { postId });
  return data;
}
export async function updateMessage(id) {
  const { data } = await axios.post(`/api/conversation/message/${id}`);
  return data;
}

/**
 * Upload a file to S3 and get back the URL
 * @param {File} file - The file to upload
 * @returns {Promise<{url: string}>} - The uploaded file URL
 */
export async function uploadChatFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("/api/s3/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
