import axios from "../config/config-axios";

export async function getPostDetail(id) {
  const { data } = await axios.get(`/api/post/${id}`);
  return data;
}
export async function getPostUser(id) {
  const { data } = await axios.get(`/api/post/user/${id}`);
  return data;
}
export async function getPostRecommend() {
  const { data } = await axios.get(`/api/post/recommend`);
  return data;
}
export async function getPostAdmin() {
  const { data } = await axios.get(`/api/post/admin`);
  return data;
}

export async function getAllPosts(title, categoryName, maxDistance, page) {
  const { data } = await axios.get(
    `/api/post/search?title=${title}&categoryName=${categoryName}&maxDistance=${maxDistance}&page=${page}&size=18`
  );
  return data;
}
export async function createPost(post) {
  const { data } = await axios.post("/api/post", post);
  return data;
}
export async function updatePost(id, post) {
  const { data } = await axios.patch(`/api/post/${id}`, post);
  return data;
}
export async function updatePostStatus(id, status) {
  const { data } = await axios.post(`/api/post/status`, {
    postId: id,
    status: status,
  });
  return data;
}

export async function updateStatusPost(id, status) {
  return updatePostStatus(id, status);
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

export async function createViewHistory(postId) {
  const { data } = await axios.post(`/api/view/${postId}`);
  return data;
}

