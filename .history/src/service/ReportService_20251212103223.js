import axios from "../config/config-axios";

/**
 * Tạo báo cáo người dùng
 * @param {number} reportedId - ID của người dùng bị báo cáo
 * @param {string} reason - Lý do báo cáo
 * @param {string} type - Loại báo cáo (thường là "user")
 * @returns {Promise} Response từ API
 */
export async function createReportUser(reportedId, reason, type = "user") {
  const { data } = await axios.post("/api/report/user", {
    reportedId,
    reason,
    type,
  });
  return data;
}

