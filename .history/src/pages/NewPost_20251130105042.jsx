import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { PiImageSquareDuotone } from "react-icons/pi";
import { LuMapPin, LuTag } from "react-icons/lu";
import { getCategoryList } from "../service/category/CategoryService.js";
import { createPost } from "../service/post/PostService.js";

const palette = {
  primary: "#6d5dfc",
  primarySoft: "#f3f1ff",
  border: "#e5e0ff",
  text: "#2c2443",
  muted: "#6d6a7c",
  warning: "#ffb703",
};

const conditions = ["Hàng mới", "Gần như mới", "Đã qua sử dụng"];

const defaultForm = {
  title: "",
  description: "",
  tags: "",
  value: "",
  meetingSpot: "",
  category: "",
  condition: "",
  images: [],
};

const NewPost = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const previews = useMemo(
    () => formData.images.map((img) => ({ src: img.preview, name: img.name })),
    [formData.images]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError("");
        const response = await getCategoryList();
        const list = Array.isArray(response?.data) ? response.data : [];
        setCategories(
          list.map((item) => ({
            value: String(item.id),
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategoryError("Không thể tải danh mục. Vui lòng thử lại sau.");
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      size: file.size,
    }));
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!currentUser?.id) {
        throw new Error("Bạn cần đăng nhập để tạo bài đăng.");
      }

      if (!formData.images.length) {
        throw new Error("Vui lòng thêm ít nhất một ảnh sản phẩm.");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        tag: formData.tags,
        itemCondition: formData.condition,
        tradeLocation: formData.meetingSpot,
        categoryId: Number(formData.category),
        userId: currentUser.id,
      };

      const multipart = new FormData();
      multipart.append("postDTO", JSON.stringify(payload));
      formData.images.forEach(({ file }) => {
        multipart.append("images", file);
      });

      await createPost(multipart);
      setMessage("Bài đăng đã được tạo! Chúng tôi sẽ duyệt sớm nhất.");
      setFormData(defaultForm);
    } catch (error) {
      const friendlyMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";
      setErrorMessage(friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#fdfcff" }}>
      <Header />
      <div className="container py-4 py-md-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ color: palette.text }}>
            Tạo bài đăng mới
          </h1>
        </div>

        <form
          className="card border-0 shadow-sm p-4 p-lg-5"
          onSubmit={handleSubmit}
        >
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div
                className="h-100 d-flex flex-column justify-content-center text-center rounded-5 p-4"
                style={{
                  border: `2px dashed ${palette.border}`,
                  background: palette.primarySoft,
                  color: palette.text,
                }}
              >
                <PiImageSquareDuotone size={70} className="mx-auto mb-3" />
                <h5 className="fw-bold mb-2">Thêm ảnh sản phẩm</h5>
                <p className="text-muted small mb-4">
                  Kéo thả hoặc chọn ảnh để mọi người thấy rõ hơn món đồ của bạn.
                </p>
                <label className="btn btn-primary rounded-pill px-4 py-2 mb-3">
                  + Thêm ảnh
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {previews.length > 0 && (
                <div className="row g-2 mt-3">
                  {previews.map((img, idx) => (
                    <div className="col-4" key={`${img.name}-${idx}`}>
                      <div className="rounded-4 overflow-hidden border">
                        <img src={img.src} alt={img.name} className="w-100" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-7">
              <div className="mb-3">
                <label className="form-label fw-semibold">Tiêu đề</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-4"
                  placeholder="Nhập tiêu đề"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Mô tả</label>
                <textarea
                  rows={4}
                  className="form-control rounded-4"
                  placeholder="Mô tả món đồ ..."
                  value={formData.description}
                  onChange={handleChange("description")}
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Yêu cầu muốn đổi <LuTag className="ms-1" />
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-4"
                    placeholder="Nhập #tags"
                    value={formData.tags}
                    onChange={handleChange("tags")}
                  />
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-4"
                style={{ background: "#fff9f0" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">
                    Điểm gặp mặt <LuMapPin className="ms-1" />
                  </span>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none fw-semibold"
                    style={{ color: palette.primary }}
                  >
                    Chọn địa điểm
                  </button>
                </div>
                {formData.meetingSpot ? (
                  <p className="mb-0 text-dark">{formData.meetingSpot}</p>
                ) : (
                  <p className="mb-0 text-danger small"></p>
                )}
                <input
                  type="text"
                  className="form-control rounded-4 mt-2"
                  placeholder=""
                  value={formData.meetingSpot}
                  onChange={handleChange("meetingSpot")}
                />
              </div>

              <div className="row g-3 mt-1 mt-md-3">
                <SelectionCard
                  label="Danh mục"
                  value={formData.category}
                  options={categories}
                  onChange={handleChange("category")}
                  placeholder={
                    categoryLoading
                      ? "Đang tải danh mục..."
                      : "Lựa chọn danh mục"
                  }
                  disabled={categoryLoading || categories.length === 0}
                  helperText={categoryError}
                />
                <SelectionCard
                  label="Tình trạng"
                  value={formData.condition}
                  options={conditions.map((item) => ({
                    value: item,
                    label: item,
                  }))}
                  onChange={handleChange("condition")}
                />
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 mt-5">
            <button
              type="button"
              className="btn rounded-pill py-3 flex-grow-1"
              style={{ background: palette.primarySoft, color: palette.text }}
              onClick={() => setFormData(defaultForm)}
              disabled={submitting}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="btn rounded-pill py-3 flex-grow-1 text-dark"
              style={{
                background: submitting ? "#fef3c7" : palette.warning,
                opacity: submitting ? 0.7 : 1,
              }}
              disabled={submitting}
            >
              {submitting ? "Đang đăng..." : "Đăng bài"}
            </button>
          </div>

          {message && (
            <div className="alert alert-info rounded-pill mt-4 mb-0 text-center">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const SelectionCard = ({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Lựa chọn",
  disabled = false,
  helperText = "",
}) => (
  <div className="col-md-6">
    <div className="rounded-4 border p-3 h-100">
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold">{label}</span>
        <span className="text-primary fw-semibold">Chọn</span>
      </div>
      <select
        className="form-select rounded-4 mt-2"
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {helperText && (
        <p className="text-danger small mb-0 mt-2">{helperText}</p>
      )}
    </div>
  </div>
);

export default NewPost;
