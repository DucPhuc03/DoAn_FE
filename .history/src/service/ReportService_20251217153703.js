import axios from "../config/config-axios";

export async function createReportUser(reportedId, reason, type = "user") {
  const { data } = await axios.post("/api/report", {
    reportedId,
    reason,
    type,
  });
  return data;
}

export async function createReportPost(
  reportedId,
  postId,
  reason,
  type = "post"
) {
  const { data } = await axios.post("/api/report", {
    reportedId,
    reason,
    postId,
    type,
  });
  return data;
}

export async function getReport() {
  const { data } = await axios.get("/api/report");
  return data;
}
