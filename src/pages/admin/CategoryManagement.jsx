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
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f9fafb 40%, #e0f2fe 100%)",
      }}
    >
      <Sidebar active="cats" />

      <main style={{ flex: 1 }}>
        <div
          style={{
            padding: "24px 32px",
            maxWidth: 1120,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#6b7280",
                  marginBottom: 4,
                }}
              >
                Bảng điều khiển / Danh mục
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Quản lý danh mục
                </h2>
                <span
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(59,130,246,0.06)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  {categories.length} danh mục
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={openCreateForm}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                paddingInline: 16,
                borderRadius: 999,
                boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
              <span>Thêm danh mục</span>
            </button>
          </div>

          {/* Card danh sách */}
          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(6px)",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
              border: "1px solid rgba(148,163,184,0.35)",
            }}
          >
            {/* Thanh tìm kiếm */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo ID hoặc tên danh mục..."
                aria-label="Tìm kiếm danh mục"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  outline: "none",
                  background:
                    "linear-gradient(135deg, #f9fafb 0%, #ffffff 40%, #eff6ff 100%)",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 14,
                  marginBottom: 12,
                }}
              >
                {error}
              </div>
            )}

            {/* Header bảng */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 100px 1fr 160px",
                padding: "8px 12px",
                borderRadius: 10,
                background: "#f9fafb",
                fontSize: 13,
                fontWeight: 600,
                color: "#6b7280",
                marginBottom: 8,
              }}
            >
              <div>ID</div>
              <div>Ảnh</div>
              <div>Tên danh mục</div>
              <div>Hành động</div>
            </div>

            {/* Dòng dữ liệu */}
            <div>
              {filteredCategories.map((cat, idx) => {
                const name = cat.name || "";
                const img = cat.imageUrl || cat.image || "";
                return (
                  <div
                    key={cat.id ?? idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 100px 1fr 160px",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: 12,
                      background:
                        idx % 2 === 0 ? "#ffffff" : "rgba(249, 250, 251, 0.9)",
                      border: "1px solid #f3f4f6",
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ fontSize: 14, color: "#374151" }}>
                      {cat.id}
                    </div>
                    <div>
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            objectFit: "cover",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            color: "#9ca3af",
                          }}
                        >
                          Không có
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#111827",
                        fontWeight: 500,
                        paddingRight: 8,
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-start",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditForm(cat)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCategories.length === 0 && (
                <div
                  style={{
                    padding: "32px 12px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  Không có danh mục nào.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form kiểu admin */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
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
                maxWidth: 520,
                background: "#ffffff",
                borderRadius: 16,
                boxShadow: "0 24px 55px rgba(15,23,42,0.45)",
                border: "1px solid #e5e7eb",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeForm}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ padding: "16px 20px" }}>
                  {error && (
                    <div
                      style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: 14,
                        marginBottom: 12,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {isEdit && form.id != null && (
                    <div style={{ marginBottom: 12 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#6b7280",
                          marginBottom: 4,
                        }}
                      >
                        ID
                      </label>
                      <input
                        value={form.id}
                        disabled
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          fontSize: 14,
                          background: "#f9fafb",
                        }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#6b7280",
                        marginBottom: 4,
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
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#6b7280",
                        marginBottom: 4,
                      }}
                    >
                      Chọn ảnh
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ width: "100%", fontSize: 13 }}
                    />
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      Chọn ảnh từ máy (base64).
                    </div>
                  </div>

                  {previewSrc && (
                    <div style={{ marginBottom: 4 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#6b7280",
                          marginBottom: 4,
                        }}
                      >
                        Xem trước ảnh
                      </label>
                      <div
                        style={{
                          borderRadius: 12,
                          border: "1px dashed #d1d5db",
                          padding: 8,
                          textAlign: "center",
                          background: "#f9fafb",
                        }}
                      >
                        <img
                          src={previewSrc}
                          alt="Xem trước"
                          style={{
                            maxHeight: 180,
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "12px 20px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    background: "#f9fafb",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeForm}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
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
