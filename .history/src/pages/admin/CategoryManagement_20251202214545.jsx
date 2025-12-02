import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../service/category/CategoryService";

const emptyForm = {
  id: null,
  name: "",
  imageUrl: "",
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");
      const data = await getCategory();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Không tải được danh sách danh mục. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      const name = (c.name || c.categoryName || "").toLowerCase();
      const idText = String(c.id ?? "").toLowerCase();
      return name.includes(q) || idText.includes(q);
    });
  }, [categories, search]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setForm((prev) => ({ ...prev, imageUrl: result }));
        setPreviewSrc(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleAddNew() {
    setForm(emptyForm);
    setIsEdit(false);
    setError("");
  }

  function handleEdit(cat) {
    setForm({
      id: cat.id ?? null,
      name: cat.name || cat.categoryName || "",
      imageUrl: cat.imageUrl || cat.image || "",
    });
    setIsEdit(true);
    setPreviewSrc(cat.imageUrl || cat.image || "");
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      setSubmitting(true);
      setError("");
      await deleteCategory(id);
      await loadCategories();
      if (form.id === id) {
        setForm(emptyForm);
        setIsEdit(false);
        setPreviewSrc("");
      }
    } catch (e) {
      console.error(e);
      setError("Xóa danh mục thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError("Tên danh mục không được để trống.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const payload = {
        name: trimmedName,
        imageUrl: form.imageUrl.trim(),
      };
      if (isEdit && form.id != null) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }
      await loadCategories();
      setForm(emptyForm);
      setIsEdit(false);
      setPreviewSrc("");
    } catch (err) {
      console.error(err);
      setError(
        (err?.response?.data && err.response.data.message) ||
          "Lưu danh mục thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <Sidebar active="cats" />

      <main className="flex-grow-1">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Quản lý danh mục</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              + Thêm danh mục
            </button>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo ID hoặc tên danh mục..."
                        aria-label="Tìm kiếm danh mục"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-3">{error}</div>
                  )}

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" style={{ width: "10%" }}>
                            ID
                          </th>
                          <th scope="col" style={{ width: "20%" }}>
                            Ảnh
                          </th>
                          <th scope="col" style={{ width: "40%" }}>
                            Tên danh mục
                          </th>
                          <th scope="col" style={{ width: "30%" }}>
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && (
                          <tr>
                            <td colSpan={4} className="text-center py-3">
                              Đang tải...
                            </td>
                          </tr>
                        )}

                        {!loading &&
                          filteredCategories.map((cat, idx) => {
                            const name = cat.name || cat.categoryName || "";
                            const img = cat.imageUrl || cat.image || "";
                            return (
                              <tr key={cat.id ?? idx}>
                                <td>{cat.id}</td>
                                <td>
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={name}
                                      className="rounded"
                                      style={{
                                        width: 60,
                                        height: 60,
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <span className="text-muted">Không có</span>
                                  )}
                                </td>
                                <td>{name}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEdit(cat)}
                                    disabled={submitting}
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(cat.id)}
                                    disabled={submitting}
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                        {!loading && filteredCategories.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center py-3">
                              Không có danh mục nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                  </h5>

                  <form onSubmit={handleSubmit}>
                    {isEdit && form.id != null && (
                      <div className="mb-3">
                        <label className="form-label">ID</label>
                        <input
                          value={form.id}
                          disabled
                          className="form-control"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">
                        Tên danh mục <span className="text-danger">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Nhập tên danh mục"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Chọn ảnh</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageFileChange}
                      />
                      <small className="text-muted">
                        Bạn có thể chọn ảnh từ máy (sẽ được convert sang base64)
                        hoặc nhập link ảnh bên dưới.
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Link ảnh (URL)</label>
                      <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setPreviewSrc(e.target.value);
                        }}
                        className="form-control"
                        placeholder="https://..."
                      />
                    </div>

                    {(previewSrc || form.imageUrl) && (
                      <div className="mb-3">
                        <label className="form-label">Xem trước ảnh</label>
                        <div className="border rounded p-2 text-center bg-light">
                          <img
                            src={previewSrc || form.imageUrl}
                            alt="Xem trước"
                            className="img-fluid rounded"
                            style={{
                              maxHeight: 180,
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between">
                      {isEdit && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleAddNew}
                          disabled={submitting}
                        >
                          Hủy chỉnh sửa
                        </button>
                      )}
                      <button
                        type="submit"
                        className="btn btn-primary ms-auto"
                        disabled={submitting}
                      >
                        {submitting
                          ? "Đang lưu..."
                          : isEdit
                          ? "Cập nhật danh mục"
                          : "Thêm danh mục"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
