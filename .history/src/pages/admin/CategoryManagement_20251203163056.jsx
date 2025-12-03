import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  createCategory,
  deleteCategory,
  getCategoryListAdmin,
  updateCategory,
} from "../../service/category/CategoryService";

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
  const [search, setSearch] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8F8F8",
      }}
    >
      <Sidebar active="cats" />

      <main style={{ flex: 1, padding: "24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#000",
              }}
            >
              Quản lý danh mục
            </h1>
          </div>

          {/* Top Bar: Filter, Search, Add Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <button
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#6b7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Filter"
            >
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

            <div
              style={{
                flex: 1,
                position: "relative",
                maxWidth: "400px",
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  outline: "none",
                  background: "#ffffff",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
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

            <button
              onClick={openCreateForm}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#000080",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                marginLeft: "300px",
              }}
            >
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

          {fetchError && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              {fetchError}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#6b7280",
                fontSize: "15px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              Đang tải danh mục...
            </div>
          ) : (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                        width: "100px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                        width: "150px",
                      }}
                    >
                      Ảnh
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Tên danh mục
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                        width: "200px",
                      }}
                    >
                      Trạng thái
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#6b7280",
                        borderBottom: "1px solid #e5e7eb",
                        width: "200px",
                      }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, idx) => (
                    <tr
                      key={cat.id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: 600,
                        }}
                      >
                        {cat.id}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {cat.image || cat.imageUrl ? (
                          <img
                            src={cat.image || cat.imageUrl}
                            alt={cat.name}
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "8px",
                              background: "#f3f4f6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              color: "#9ca3af",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            Không có
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: 500,
                        }}
                      >
                        {cat.name}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background:
                              (cat.status || "") === "ACTIVE"
                                ? "#d1fae5"
                                : "#fee2e2",
                            color:
                              (cat.status || "") === "ACTIVE"
                                ? "#065f46"
                                : "#991b1b",
                          }}
                        >
                          {(cat.status || "ACTIVE") === "ACTIVE"
                            ? "Đang hoạt động"
                            : "Đã xóa"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => openEditForm(cat)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "6px",
                              border: "1px solid #000080",
                              background: "#ffffff",
                              color: "#000080",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#000080";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#000080";
                            }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            style={{
                              padding: "6px 16px",
                              borderRadius: "6px",
                              border: "1px solid #dc2626",
                              background: "#ffffff",
                              color: "#dc2626",
                              fontSize: "13px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#dc2626";
                              e.currentTarget.style.color = "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#ffffff";
                              e.currentTarget.style.color = "#dc2626";
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCategories.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: "40px",
                          textAlign: "center",
                          color: "#9ca3af",
                          fontSize: "14px",
                        }}
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1050,
            }}
            onClick={closeForm}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  aria-label="Close"
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "none",
                    background: "transparent",
                    fontSize: "24px",
                    color: "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#111827";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6b7280";
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ padding: "20px" }}>
                  {formError && (
                    <div
                      style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      {formError}
                    </div>
                  )}

                  {isEdit && form.id != null && (
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        ID
                      </label>
                      <input
                        value={form.id}
                        disabled
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                          background: "#f9fafb",
                          color: "#6b7280",
                          cursor: "not-allowed",
                        }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Tên danh mục <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nhập tên danh mục"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#000080";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(0, 0, 128, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Chọn ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ width: "100%", fontSize: "13px" }}
                    />
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        color: "#9ca3af",
                      }}
                    ></div>
                  </div>

                  {(previewSrc || form.imageUrl) && (
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#374151",
                          marginBottom: "6px",
                        }}
                      >
                        {" "}
                      </label>
                      <div
                        style={{
                          border: "1px dashed #d1d5db",
                          borderRadius: "8px",
                          padding: "8px",
                          background: "#f9fafb",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={previewSrc || form.imageUrl}
                          alt="Xem trước"
                          style={{
                            maxHeight: "180px",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    padding: "16px 20px",
                    borderTop: "1px solid #e5e7eb",
                    background: "#f9fafb",
                  }}
                >
                  <button
                    type="button"
                    onClick={closeForm}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      background: "#ffffff",
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #000080",
                      background: "#000080",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: submitting ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0000a0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#000080";
                    }}
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
      </main>
    </div>
  );
}
