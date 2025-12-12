import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ModelMap from "../components/ModelMap.jsx";
import {
  getProfile,
  updateProfile,
  updateAvatar,
} from "../service/UserService";
import Cookies from "js-cookie";
import "../css/EditProfile.css";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const handleLocationChange = ({ lat, lng }) => {
    console.log("Nhận từ Map:", lat, lng);
    setLocation({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    bio: "",
    email: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await getProfile(id);
      if (response.code === 1000 && response.data) {
        const profile = response.data;
        setFormData({
          fullName: profile.fullName || "",
          phoneNumber: profile.phoneNumber || "",
          address: profile.address || "",
          bio: profile.bio || "",
          email: profile.email || "",
          latitude: profile.latitude || null,
          longitude: profile.longitude || null,
        });
        // Set current avatar
        if (profile.avatarUrl) {
          setCurrentAvatar(profile.avatarUrl);
          setAvatarPreview(profile.avatarUrl);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateProfile(id, formData);
      if (response.code === 1000) {
        setSuccess("Cập nhật hồ sơ thành công!");
        setTimeout(() => {
          navigate(`/profile/${id}`);
        }, 1500);
      } else {
        setError(response.message || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setAvatarFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setError("Vui lòng chọn ảnh để tải lên");
      return;
    }

    try {
      setUploadingAvatar(true);
      setError("");

      // Create FormData
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await updateAvatar(formData);
      if (response.code === 1000) {
        setSuccess("Cập nhật ảnh đại diện thành công!");
        setCurrentAvatar(avatarPreview);
        setAvatarFile(null);
        // Update user in localStorage if needed
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && response.data?.avatarUrl) {
          user.avatarUrl = response.data.avatarUrl;
          localStorage.setItem("user", JSON.stringify(user));
        }
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } else {
        setError(response.message || "Có lỗi xảy ra khi cập nhật ảnh");
      }
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError(
        err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      // Clear localStorage
      localStorage.removeItem("user");
      // Clear cookies
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      // Navigate to login
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="editprofile-page">
        <Header />
        <div className="editprofile-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const primary = "#2563eb";
  const surface = "#ffffff";

  return (
    <div className="editprofile-page">
      <Header />
      <div className="editprofile-container">
        {/* Header */}
        <div className="editprofile-header">
          <h1 className="editprofile-title">Chỉnh sửa hồ sơ</h1>
          <p className="editprofile-subtitle">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        {/* Main Content - Single Card */}
        <div className="editprofile-card-wrapper">
          <div className="editprofile-layout">
            {/* Left Column - Avatar Upload */}
            <div className="editprofile-avatar-section">
              <div className="editprofile-avatar-wrapper">
                {/* Avatar Preview */}
                <div className="editprofile-avatar-preview">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="editprofile-avatar-image"
                    />
                  ) : (
                    <i className="bi bi-person-fill editprofile-avatar-placeholder"></i>
                  )}
                </div>

                {/* Upload Button */}
                <label
                  htmlFor="avatar-upload"
                  className="editprofile-avatar-select"
                >
                  <i className="bi bi-camera"></i>
                  Chọn ảnh
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />

                {/* Upload Button */}
                {avatarFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="editprofile-avatar-upload"
                  >
                    {uploadingAvatar ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-upload"></i>
                        Tải lên
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="editprofile-form-section">
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="editprofile-field">
                <label className="editprofile-label">
                  <i className="bi bi-person"></i>
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Nhập họ và tên"
                  className="editprofile-input"
                  required
                />
              </div>

              {/* Email */}
              <div className="editprofile-field">
                <label className="editprofile-label">
                  <i className="bi bi-envelope"></i>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="Nhập email"
                  className="editprofile-input"
                  required
                />
              </div>

              {/* Phone */}
              <div className="editprofile-field">
                <label className="editprofile-label">
                  <i className="bi bi-telephone"></i>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  placeholder="Nhập số điện thoại"
                  className="editprofile-input"
                />
              </div>

              {/* Address */}
              <div className="editprofile-field">
                <label className="editprofile-label">
                  <i className="bi bi-geo-alt"></i>
                  Địa chỉ
                </label>
                <ModelMap onLocationChange={handleLocationChange} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange("address")}
                  placeholder="Nhập địa chỉ"
                  className="editprofile-input"
                />
              </div>

              {/* Bio */}
              <div className="editprofile-field" style={{ marginBottom: 32 }}>
                <label className="editprofile-label">
                  <i className="bi bi-info-circle"></i>
                  Giới thiệu
                </label>
                <textarea
                  value={formData.bio}
                  onChange={handleChange("bio")}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                  rows={5}
                  className="editprofile-textarea"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="editprofile-error">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="editprofile-success">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="editprofile-actions">
                <div className="editprofile-actions-left">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    className="editprofile-cancel-btn"
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="editprofile-submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="editprofile-logout-btn"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  Đăng xuất
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
