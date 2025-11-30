import axios from "../../config/config-axios";

export async function getPostDetail(id) {
  const { data } = await axios.get(`/api/post/${id}`);
  return data;
}
export async function createPost(post) {
  const { data } = await axios.post("/api/post", post);
  return data;
}
export async function updatePost(id, post) {
  const { data } = await axios.put(`/api/post/${id}`, post);
  return data;
}
export async function updatePostStatus(id, status) {
  const { data } = await axios.post(`/api/post/status`, {
    postId: id,
    status: status,
  });
  return data;
}
export async function deletePost(id) {
  const { data } = await axios.delete(`/api/post/${id}`);
  return data;
}
export async function getPostComments(postId) {
  const { data } = await axios.get(`/api/post/${postId}/comments`);
  return data;
}

export async function likePost(postId) {
  const { data } = await axios.post(`/api/like/${postId}`);
  return data;
}
export async function createComment(postId, content) {
  const { data } = await axios.post(`/api/comment`, {
    postId: postId,
    content: content,
  });
  return data;
}
