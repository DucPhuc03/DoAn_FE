import axios from "../../config/config-axios";

export async function getProfile(id) {
  const { data } = await axios.get("/api/user/profile/1");
  return data;
}
