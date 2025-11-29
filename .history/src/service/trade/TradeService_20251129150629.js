import axios from "../../config/config-axios";
export async function getDetailTrade(id) {
  const { data } = await axios.get(`/api/trade/${id}`);
  return data;
}
