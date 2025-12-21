import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  createCategory,
  deleteCategory,
  getCategoryListAdmin,
  updateCategory,
} from "../../service/CategoryService";
import "../../css/CategoryManagement.css";

const emptyForm = {
  id: null,
  name: "",
  imageUrl: "",
  status: "ACTIVE",
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadCategories();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function loadCategories() {
    try {
      setLoading(true);
      setFetchError("");
      const response = await getCategoryListAdmin();
      setCategories(response?.data || []);
    } catch (error) {
      setFetchError(
        error?.response?.data?.message || "Không thể tải danh mục. Thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const status = (c.status || "").toLowerCase();
      const idText = String(c.id ?? "").toLowerCase();
      return name.includes(q) || idText.includes(q) || status.includes(q);
    });
  }, [categories, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / rowsPerPage)
  );
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = filteredCategories.slice(startIndex, endIndex);

  function goto(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewSrc(form.imageUrl || "");
      return;
    }
    setSelectedFile(file);
    setPreviewSrc(URL.createObjectURL(file));
  }

  function openCreateForm() {
    setForm(emptyForm);
    setIsEdit(false);
    setFormError("");
    setPreviewSrc("");
    setSelectedFile(null);
    setShowForm(true);
  }

  function openEditForm(cat) {
    setForm({
      id: cat.id ?? null,
      name: cat.name || "",
      imageUrl: cat.image || "",
      status: cat.status || "ACTIVE",
    });
    setIsEdit(true);
    setPreviewSrc(cat.image || "");
    setSelectedFile(null);
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setIsEdit(false);
    setPreviewSrc("");
    setSelectedFile(null);
    setFormError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      alert(error?.response?.data?.message || "Không thể xóa danh mục.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setFormError("Tên danh mục không được để trống.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      if (isEdit && form.id != null) {
        await updateCategory(form.id, {
          name: trimmedName,
          imageFile: selectedFile || null,
        });
      } else {
        await createCategory({
          name: trimmedName,
          imageFile: selectedFile || null,
        });
      }
      closeForm();
      await loadCategories();
    } catch (error) {
      setFormError(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="category-layout">
      <Sidebar active="cats" />

      <main className="category-main">
        <div className="category-container">
          {/* Header */}
          <div className="category-header">
            <h1 className="category-title">Quản lý danh mục</h1>
          </div>

          {/* Top Bar: Filter, Search, Add Button */}
          <div className="category-topbar">
            <button className="category-filter-btn" title="Filter">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4h12M4 8h8M6 12h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="category-search-wrapper">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
                className="category-search-input"
              />
              <svg
                className="category-search-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM13 13l-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <button onClick={openCreateForm} className="category-add-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Thêm danh mục</span>
            </button>
          </div>

          {fetchError && <div className="category-error">{fetchError}</div>}

          {/* Table */}
          {loading ? (
            <div className="category-loading">Đang tải danh mục...</div>
          ) : (
            <div className="category-table-wrapper">
              <table className="category-table">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>ID</th>
                    <th style={{ width: "150px" }}>Ảnh</th>
                    <th>Tên danh mục</th>
                    <th style={{ width: "500px" }}>Trạng thái</th>
                    <th style={{ width: "200px" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600 }}>{cat.id}</td>
                      <td>
                        {cat.image || cat.imageUrl ? (
                          <img
                            src={cat.image || cat.imageUrl}
                            alt={cat.name}
                            className="category-image"
                          />
                        ) : (
                          <div className="category-image-placeholder">
                            Không có
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td>
                        <span
                          className={`category-badge ${
                            (cat.status || "") === "ACTIVE"
                              ? "category-badge-active"
                              : "category-badge-deleted"
                          }`}
                        >
                          {(cat.status || "ACTIVE") === "ACTIVE"
                            ? "Đang hoạt động"
                            : "Đã xóa"}
                        </span>
                      </td>
                      <td>
                        <div className="category-actions">
                          <button
                            onClick={() => openEditForm(cat)}
                            className="category-btn"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="category-btn category-btn-danger"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="category-table-empty">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="category-pagination">
          <div className="category-pagination-info">
            {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of{" "}
            {filteredCategories.length}
          </div>

          <div className="category-pagination-controls">
            <div className="category-rows-select">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="category-page-nav">
              <button
                onClick={() => goto(page - 1)}
                disabled={page === 1}
                className="category-page-btn"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8l4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="category-page-text">
                {page}/{totalPages}
              </span>
              <button
                onClick={() => goto(page + 1)}
                disabled={page === totalPages}
                className="category-page-btn"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 12l4-4-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Form */}
          {showForm && (
            <div className="category-modal-overlay" onClick={closeForm}>
              <div
                className="category-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="category-modal-header">
                  <h2 className="category-modal-title">
                    {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                  </h2>
                  <button
                    type="button"
                    onClick={closeForm}
                    aria-label="Close"
                    className="category-modal-close"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="category-modal-body">
                    {formError && (
                      <div className="category-form-error">{formError}</div>
                    )}

                    {isEdit && form.id != null && (
                      <div className="category-form-group">
                        <label className="category-form-label">ID</label>
                        <input
                          value={form.id}
                          disabled
                          className="category-form-input"
                          style={{ background: "#f9fafb", color: "#6b7280", cursor: "not-allowed" }}
                        />
                      </div>
                    )}

                    <div className="category-form-group">
                      <label className="category-form-label">
                        Tên danh mục <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nhập tên danh mục"
                        className="category-form-input"
                      />
                    </div>

                    <div className="category-form-group">
                      <label className="category-form-label">Chọn ảnh</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{ width: "100%", fontSize: "13px" }}
                      />
                    </div>

                    {(previewSrc || form.imageUrl) && (
                      <div className="category-form-group">
                        <div className="category-upload-area">
                          <img
                            src={previewSrc || form.imageUrl}
                            alt="Xem trước"
                            className="category-upload-preview"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="category-modal-footer">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="category-modal-cancel"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="category-modal-submit"
                    >
                      {submitting
                        ? "Đang xử lý..."
                        : isEdit
                        ? "Cập nhật"
                        : "Thêm mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
