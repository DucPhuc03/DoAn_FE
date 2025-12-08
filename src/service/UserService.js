import axios from "../config/config-axios";

export async function getProfile(id) {
  const { data } = await axios.get(`/api/user/profile/${id}`);
  return data;
}

export async function updateProfile(id, profileData) {
  const { data } = await axios.patch(`/api/user/profile`, profileData);
  return data;
}

export async function updateAvatar(avatar) {
  const { data } = await axios.patch(`/api/user/avatar`, avatar);
  return data;
}

export async function getAllUser() {
  const { data } = await axios.get(`/api/user/admin`);
  return data;
}
export async function updateUserStatus(id) {
  const { data } = await axios.patch(`/api/user/admin/status/${id}`);
  return data;
}

export async function followUser(userId) {
  const { data } = await axios.post(`/api/follow/${userId}`);
  return data;
}

export async function unfollowUser(userId) {
  const { data } = await axios.delete(`/api/user/follow/${userId}`);
  return data;
}

export async function reportUser(userId, reason) {
  const { data } = await axios.post(`/api/user/report/${userId}`, { reason });
  return data;
}






