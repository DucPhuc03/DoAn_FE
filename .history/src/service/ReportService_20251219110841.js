import axios from "../config/config-axios";

export async function createReportUser(reportedId, reason, type) {
  const { data } = await axios.post("/api/report", {
    reportedId,
    reason,
    type: type,
  });
  return data;
}

export async function createReportPost(reportedId, postId, reason, type) {
  const { data } = await axios.post("/api/report", {
    reportedId,
    reason,
    postId: postId,
    type: type,
  });
  return data;
}

export async function getReport() {
  const { data } = await axios.get("/api/report");
  return data;
}
export async function getPostReport(id) {
  const { data } = await axios.get(`/api/report/admin/${id}`);
  return data;
}
