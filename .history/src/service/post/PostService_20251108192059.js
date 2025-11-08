import axios from "../../config/config-axios";

export async function getPostDetail(id) {
  const { data } = await axios.get(`/api/post/${id}`);
  return data;
}
