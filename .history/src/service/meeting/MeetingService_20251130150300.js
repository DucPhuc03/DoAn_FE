import axios from "../../config/config-axios";
export async function createMeeting(meeting) {
  const { data } = await axios.post(`/api/meeting`, meeting);
  return data;
}
