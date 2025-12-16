import axios from "../config/config-axios";
export async function getReview(id) {
  const { data } = await axios.get(`/api/review/user/${id}`);
  return data;
}

export async function createReview(reviewData) {
  const { data } = await axios.post(`/api/review`, reviewData);
  return data;
}



















