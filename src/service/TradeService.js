import axios from "../config/config-axios";
export async function getDetailTrade(id) {
  const { data } = await axios.get(`/api/trade/${id}`);
  return data;
}

export async function createTrade(trade) {
  const { data } = await axios.post("/api/trade", trade);
  return data;
}

export async function updateTradePost(tradeId, postId) {
  const { data } = await axios.post(`/api/trade/update-post`, {
    tradeId: tradeId,
    requesterPostId: postId,
  });
  return data;
}

export async function getTradeUser() {
  const { data } = await axios.get(`/api/trade/user`);
  return data;
}

export async function updateTradeStatus(tradeId) {
  const { data } = await axios.patch(`/api/trade/${tradeId}`);
  return data;
}

