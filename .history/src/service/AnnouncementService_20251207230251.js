import axios from "../config/config-axios";
export async function fetchAnnouncements() {
  const { data } = await axios.get("/api/announcement");
  return data;
}
export async function updateIsRead(id) {
  const { data } = await axios.patch(`/api/announcement/${id}`);
  return data;
}
