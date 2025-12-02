import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";

const emptyForm = {
  id: null,
  name: "",
  imageUrl: "",
};

export default function CategoryManagement() {
  // Fake data, không gọi API
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

  function handleAddNew() {
    setForm(emptyForm);
    setIsEdit(false);
    setError("");
    setPreviewSrc("");
    setShowForm(true);
  }

  function handleEdit(cat) {
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

  function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (form.id === id) {
      setForm(emptyForm);
      setIsEdit(false);
      setPreviewSrc("");
      setShowForm(false);
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

    setForm(emptyForm);
    setIsEdit(false);
    setPreviewSrc("");
    setShowForm(false);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar active="cats" />

      <main style={{ flex: 1 }}>
        <div style={{ padding: "24px 32px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Quản lý danh mục
            </h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddNew}
            >
              + Thêm danh mục
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1.2fr)",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* Danh sách */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Search */}
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

              {/* Header row */}
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

              {/* Rows */}
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
                          idx % 2 === 0
                            ? "#ffffff"
                            : "rgba(249, 250, 251, 0.9)",
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
                          onClick={() => handleEdit(cat)}
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

            {/* Form */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                border: "1px solid #e5e7eb",
                minHeight: 220,
              }}
            >
              {!showForm ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    textAlign: "center",
                    fontSize: 14,
                    padding: "16px 8px",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
                  <div style={{ marginBottom: 4 }}>
                    Chọn "Thêm danh mục" hoặc nút Sửa để mở form.
                  </div>
                </div>
              ) : (
                <>
                  <h5
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 16,
                    }}
                  >
                    {isEdit ? "Sửa danh mục" : "Thêm danh mục mới"}
                  </h5>

                  <form onSubmit={handleSubmit}>
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
                        Chọn ảnh từ máy (base64) hoặc nhập link ảnh bên dưới.
                      </div>
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
                        Link ảnh (URL)
                      </label>
                      <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={(e) => {
                          handleChange(e);
                          setPreviewSrc(e.target.value);
                        }}
                        placeholder="https://..."
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

                    {(previewSrc || form.imageUrl) && (
                      <div style={{ marginBottom: 16 }}>
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
                            src={previewSrc || form.imageUrl}
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

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setForm(emptyForm);
                          setIsEdit(false);
                          setPreviewSrc("");
                          setShowForm(false);
                          setError("");
                        }}
                      >
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {isEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
