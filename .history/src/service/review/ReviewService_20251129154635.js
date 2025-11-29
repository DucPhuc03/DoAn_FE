import axios from "../../config/config-axios";
export async function getReview(id) {
  const { data } = await axios.get(`/api/review/user/${id}`);
  return data;
}
