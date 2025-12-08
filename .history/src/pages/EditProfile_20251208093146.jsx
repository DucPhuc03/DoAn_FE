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
      latitude: location.lat,
      longitude: location.lng,
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
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <Header />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
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
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: 8,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Chỉnh sửa hồ sơ
          </h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 32,
            alignItems: "start",
          }}
          className="edit-profile-layout"
        >
          {/* Left Column - Avatar Upload */}
          <div
            style={{
              background: surface,
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              padding: "32px",
              border: "1px solid #f1f5f9",
              position: "sticky",
              top: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* Avatar Preview */}
              <div
                style={{
                  position: "relative",
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid #e5e7eb",
                  background: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <i
                    className="bi bi-person-fill"
                    style={{ fontSize: 80, color: "#9ca3af" }}
                  ></i>
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="avatar-upload"
                style={{
                  padding: "10px 20px",
                  border: `2px dashed ${primary}`,
                  borderRadius: 10,
                  background: "#f0f7ff",
                  color: primary,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0f2fe";
                  e.currentTarget.style.borderColor = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f7ff";
                  e.currentTarget.style.borderColor = primary;
                }}
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
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 10,
                    background: uploadingAvatar
                      ? "#9ca3af"
                      : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: surface,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: uploadingAvatar ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
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

              {/* Info Text */}
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            style={{
              background: surface,
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              padding: "40px",
              border: "1px solid #f1f5f9",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  <i
                    className="bi bi-person me-2"
                    style={{ color: primary }}
                  ></i>
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Nhập họ và tên"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(37, 99, 235, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  <i
                    className="bi bi-envelope me-2"
                    style={{ color: primary }}
                  ></i>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="Nhập email"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(37, 99, 235, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  <i
                    className="bi bi-telephone me-2"
                    style={{ color: primary }}
                  ></i>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(37, 99, 235, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  <i
                    className="bi bi-geo-alt me-2"
                    style={{ color: primary }}
                  ></i>
                  Địa chỉ
                </label>
                <ModelMap onLocationChange={handleLocationChange} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleChange("address")}
                  placeholder="Nhập địa chỉ"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(37, 99, 235, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 32 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1f2937",
                    marginBottom: 8,
                  }}
                >
                  <i
                    className="bi bi-info-circle me-2"
                    style={{ color: primary }}
                  ></i>
                  Giới thiệu
                </label>
                <textarea
                  value={formData.bio}
                  onChange={handleChange("bio")}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    fontSize: 15,
                    outline: "none",
                    resize: "vertical",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(37, 99, 235, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 10,
                    color: "#dc2626",
                    marginBottom: 20,
                    fontSize: 14,
                  }}
                >
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 10,
                    color: "#16a34a",
                    marginBottom: 20,
                    fontSize: 14,
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${id}`)}
                    style={{
                      padding: "12px 24px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      background: surface,
                      color: "#6b7280",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = surface;
                    }}
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: 10,
                      background: submitting
                        ? "#9ca3af"
                        : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: surface,
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      boxShadow: submitting
                        ? "none"
                        : "0 4px 12px rgba(37, 99, 235, 0.3)",
                    }}
                    disabled={submitting}
                    onMouseEnter={(e) => {
                      if (!submitting) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(37, 99, 235, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(37, 99, 235, 0.3)";
                      }
                    }}
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
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #fecaca",
                    borderRadius: 10,
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fee2e2";
                    e.currentTarget.style.borderColor = "#fca5a5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fef2f2";
                    e.currentTarget.style.borderColor = "#fecaca";
                  }}
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
  );
};

export default EditProfile;
