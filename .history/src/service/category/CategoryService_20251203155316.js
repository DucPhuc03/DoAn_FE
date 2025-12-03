import axios from "../../config/config-axios";

export async function getCategoryList() {
  const { data } = await axios.get("/api/category");
  return data;
}

export async function getCategoryListAdmin() {
  const { data } = await axios.get("/api/category/admin");
  return data;
}

export async function createCategory(category) {
  const { data } = await axios.post("/api/category/admin", category);
  return data;
}

export async function updateCategory(id, category) {
  const { data } = await axios.put(`/api/category/admin/${id}`, category);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await axios.delete(`/api/category/admin/${id}`);
  return data;
}
