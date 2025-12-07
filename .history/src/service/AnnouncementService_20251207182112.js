import axios from "../config/config-axios";
export async function fetchAnnouncements() {
  const { data } = await axios.get("/api/announcement");
  return data;
}
