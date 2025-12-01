import axios from "../../config/config-axios";
export async function createMeeting(meeting) {
  const { data } = await axios.post(`/api/meeting`, meeting);
  return data;
}
export async function acceptedMeeting(meetingId) {
  const { data } = await axios.patch(`/api/meeting/${meetingId}`);
  return data;
}
export async function cancelMeeting(meetingId) {
  const { data } = await axios.delete(`/api/meeting`);
  return data;
}
