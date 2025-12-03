import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";

const emptyForm = {
  id: null,
  name: "",
  imageUrl: "",
};

export default function CategoryManagement() {
  // Fake data
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Điện thoại",
      imageUrl:
        "https://images.pexels.com/photos/6078124/pexels-photo-6078124.jpeg",
    },
    {
      id: 2,
      name: "Laptop",
      imageUrl: "https://images.pexels.com/photos/18104/pexels-photo.jpg",
    },
    {
      id: 3,
      name: "Sách",
      imageUrl:
        "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg",
    },
    {
      id: 4,
      name: "Quần áo",
      imageUrl:
        "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    },
    {
      id: 5,
      name: "Đồ gia dụng",
      imageUrl:
        "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
    },
    {
      id: 6,
      name: "Xe",
      imageUrl:
        "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg",
    },
  ]);

  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => {
      const name = (c.name || "").toLowerCase();
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

  function openCreateForm() {
    setForm(emptyForm);
    setIsEdit(false);
    setError("");
    setPreviewSrc("");
    setShowForm(true);
  }

  function openEditForm(cat) {
    setForm({
      id: cat.id ?? null,
      name: cat.name || "",
      imageUrl: cat.imageUrl || cat.image || "",
    });
    setIsEdit(true);
    setPreviewSrc(cat.imageUrl || cat.image || "");
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setIsEdit(false);
    setPreviewSrc("");
    setError("");
  }

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (form.id === id) {
      closeForm();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError("Tên danh mục không được để trống.");
      return;
    }
    setError("");

    if (isEdit && form.id != null) {
      // Cập nhật local
      setCategories((prev) =>
        prev.map((c) =>
          c.id === form.id
            ? {
                ...c,
                name: trimmedName,
                imageUrl: form.imageUrl.trim() || c.imageUrl,
              }
            : c
        )
      );
    } else {
      // Thêm mới local
      const nextId =
        categories.reduce((max, c) => Math.max(max, c.id ?? 0), 0) + 1;
      setCategories((prev) => [
        ...prev,
        {
          id: nextId,
          name: trimmedName,
          imageUrl: form.imageUrl.trim(),
        },
      ]);
    }

    closeForm();
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
                marginLeft: "auto",
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

          {/* Table */}
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
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
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
                      colSpan={4}
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
                  {error && (
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
                      {error}
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
                    >
                      Chọn ảnh từ máy (base64).
                    </div>
                  </div>

                  {previewSrc && (
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
                        Xem trước ảnh
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
                          src={previewSrc}
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
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0000a0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#000080";
                    }}
                  >
                    {isEdit ? "Cập nhật" : "Thêm mới"}
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
