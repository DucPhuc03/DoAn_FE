import axios from "../../config/config-axios";

export async function getProfile(id) {
  const { data } = await axios.get(`/api/user/profile/${id}`);
  return data;
}

export async function updateProfile(id, profileData) {
  const { data } = await axios.put(`/api/user/profile/${id}`, profileData);
  return data;
}
