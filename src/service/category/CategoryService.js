import axios from "../../config/config-axios";

export async function getCategoryList() {
  const { data } = await axios.get("/api/category");
  return data;
}
