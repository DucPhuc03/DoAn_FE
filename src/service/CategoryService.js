import axios from "../config/config-axios";

export async function getCategoryList() {
  const { data } = await axios.get("/api/category");
  return data;
}

export async function getCategoryListAdmin() {
  const { data } = await axios.get("/api/category/admin");
  return data;
}

export async function createCategory({ name, imageFile }) {
  const formData = new FormData();
  formData.append("category", JSON.stringify({ name }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const { data } = await axios.post("/api/category/admin", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateCategory(id, { name, imageFile }) {
  const formData = new FormData();
  formData.append("category", JSON.stringify({ name }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const { data } = await axios.put(`/api/category/admin/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteCategory(id) {
  const { data } = await axios.delete(`/api/category/admin/${id}`);
  return data;
}

























