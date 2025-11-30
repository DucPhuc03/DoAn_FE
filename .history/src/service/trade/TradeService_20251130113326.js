import axios from "../../config/config-axios";
export async function getDetailTrade(id) {
  const { data } = await axios.get(`/api/trade/${id}`);
  return data;
}

export async function updateTradePost(tradeId, postId) {
  const { data } = await axios.post(`/api/trade/update-post`, {
    tradeId: tradeId,
    requesterPostId: postId,
  });
  return data;
}
