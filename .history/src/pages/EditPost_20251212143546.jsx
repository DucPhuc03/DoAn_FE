import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PiImageSquareDuotone } from "react-icons/pi";
import { LuMapPin, LuTag } from "react-icons/lu";
import { getCategoryList } from "../service/CategoryService.js";
import { getPostDetail, updatePost } from "../service/PostService.js";
import ModelMap from "../components/ModelMap.jsx";
import "../css/EditPost.css";

const palette = {
  primary: "#6d5dfc",
  primarySoft: "#f3f1ff",
  border: "#e5e0ff",
  text: "#2c2443",
  muted: "#6d6a7c",
  warning: "#ffb703",
};

const conditions = ["Hàng mới", "Gần như mới", "Đã qua sử dụng"];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    meetingSpot: "",
    category: "",
    condition: "",
    latitude: null,
    longitude: null,
    images: [],
    existingImages: [],
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const handleLocationChange = ({ lat, lng }) => {
    console.log("Nhận từ Map:", lat, lng);
    setLocation({ lat, lng });
  };
  const previews = useMemo(
    () => [
      ...formData.existingImages.map((img) => ({
        src: img,
        name: "existing",
        isExisting: true,
      })),
      ...formData.images.map((img) => ({
        src: img.preview,
        name: img.name,
        isExisting: false,
      })),
    ],
    [formData.images, formData.existingImages]
  );

  useEffect(() => {
    fetchCategories();
    fetchPostData();
  }, [id]);

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

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const response = await getPostDetail(id);
      const post = response.data || response;

      setFormData({
        title: post.title || "",
        description: post.description || "",
        tags: post.tag || "",
        meetingSpot: post.tradeLocation || "",
        category: post.category?.id ? String(post.category.id) : "",
        condition: post.itemCondition || "",
        latitude: post.latitude || null,
        longitude: post.longitude || null,
        images: [],
        existingImages: post.imageUrls || [],
      });
    } catch (error) {
      console.error("Failed to load post", error);
      setErrorMessage(
        "Không thể tải thông tin bài đăng. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

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
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      const newIndex = index - formData.existingImages.length;
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== newIndex),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!currentUser?.id) {
        throw new Error("Bạn cần đăng nhập để chỉnh sửa bài đăng.");
      }

      if (previews.length === 0) {
        throw new Error("Vui lòng giữ lại ít nhất một ảnh sản phẩm.");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        tag: formData.tags,
        itemCondition: formData.condition,
        tradeLocation: formData.meetingSpot,
        categoryId: Number(formData.category),
        latitude: formData.lat,
        longitude: formData.lng,
        userId: currentUser.id,
      };

      const multipart = new FormData();
      multipart.append("postDTO", JSON.stringify(payload));

      // Append existing images that should be kept
      if (formData.existingImages.length > 0) {
        multipart.append(
          "existingImageUrls",
          JSON.stringify(formData.existingImages)
        );
      }

      // Append new images
      formData.images.forEach(({ file }) => {
        multipart.append("images", file);
      });

      await updatePost(id, multipart);
      setMessage("Bài đăng đã được cập nhật thành công!");
      setTimeout(() => {
        navigate(`/post/${id}`);
      }, 1500);
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

  if (loading) {
    return (
      <div className="editpost-page">
        <Header />
        <div className="container py-4 py-md-5">
          <div className="editpost-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editpost-page">
      <Header />
      <div className="container py-4 py-md-5">
        <div className="text-center mb-4">
          <h1 className="editpost-title">Chỉnh sửa bài đăng</h1>
        </div>

        <form className="editpost-form" onSubmit={handleSubmit}>
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="editpost-upload-area">
                <PiImageSquareDuotone
                  size={70}
                  className="editpost-upload-icon"
                />
                <h5 className="editpost-upload-title">Thêm ảnh sản phẩm</h5>
                <p className="editpost-upload-subtitle">
                  Thêm ảnh mới hoặc giữ lại ảnh hiện có.
                </p>
                <label className="btn btn-primary editpost-upload-btn">
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
                <div className="row g-2 editpost-previews">
                  {previews.map((img, idx) => (
                    <div
                      className="col-4 editpost-preview-item"
                      key={`${img.name}-${idx}`}
                    >
                      <div className="editpost-preview-wrapper">
                        <img
                          src={img.src}
                          alt={img.name}
                          className="editpost-preview-image"
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm editpost-preview-remove"
                          onClick={() => handleRemoveImage(idx, img.isExisting)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-7">
              <div className="mb-3">
                <label className="form-label editpost-label">Tiêu đề</label>
                <input
                  type="text"
                  className="form-control editpost-input-lg"
                  placeholder="Nhập tiêu đề"
                  value={formData.title}
                  onChange={handleChange("title")}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label editpost-label">Mô tả</label>
                <textarea
                  rows={4}
                  className="form-control editpost-input"
                  placeholder="Mô tả món đồ ..."
                  value={formData.description}
                  onChange={handleChange("description")}
                  required
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label editpost-label">
                    Yêu cầu muốn đổi <LuTag className="ms-1" />
                  </label>
                  <input
                    type="text"
                    className="form-control editpost-input"
                    placeholder="Nhập yêu cầu"
                    value={formData.tags}
                    onChange={handleChange("tags")}
                  />
                </div>
              </div>

              <div className="editpost-meeting-section">
                <div className="editpost-meeting-header">
                  <span className="editpost-meeting-label">
                    Điểm gặp mặt <LuMapPin className="ms-1" />
                  </span>
                  <button
                    type="button"
                    className="btn btn-link editpost-meeting-btn"
                  >
                    Chọn địa điểm
                  </button>
                </div>
                <ModelMap onLocationChange={handleLocationChange} />
                <input
                  type="text"
                  className="form-control editpost-input mt-2"
                  placeholder="Nhập địa điểm trao đổi"
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

          <div className="editpost-actions">
            <button
              type="button"
              className="btn editpost-cancel-btn"
              onClick={() => navigate(`/post/${id}`)}
              disabled={submitting}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="btn editpost-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật bài đăng"}
            </button>
          </div>

          {message && (
            <div className="alert alert-success editpost-alert">{message}</div>
          )}

          {errorMessage && (
            <div className="alert alert-danger editpost-alert">
              {errorMessage}
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

export default EditPost;
