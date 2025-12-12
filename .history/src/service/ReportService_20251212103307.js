import axios from "../config/config-axios";

export async function createReportUser(reportedId, reason, type = "user") {
  const { data } = await axios.post("/api/report", {
    reportedId,
    reason,
    type,
  });
  return data;
}
