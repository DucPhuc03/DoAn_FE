import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getProfile } from "../service/user/UserService";
import {
  FaMapMarkerAlt,
  FaRegHeart,
  FaExchangeAlt,
  FaUserFriends,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaCog,
} from "react-icons/fa";

const userTabs = ["Bài đăng", "Đã thích", "Đánh giá", "Đề xuất", "Lịch sử"];

const primary = "#2563eb"; // Blue
const secondary = "#1f2937";
const muted = "#6b7280";
const surface = "#ffffff";
const bgProfile = "#f8fafc";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = id;
        const response = await getProfile(userId);
        if (response.code === 1000) {
          setProfileData(response.data);
        } else {
          setError(response.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error loading profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status text based on postStatus
  const getPostStatus = (postStatus) => {
    if (!postStatus) return "Chưa trao đổi";
    if (postStatus === "COMPLETED") return "Đã trao đổi";
    if (postStatus === "CANCELLED") return "Đã hủy";
    return "Đang trao đổi";
  };

  if (loading) {
    return (
      <div style={{ background: bgProfile, minHeight: "100vh" }}>
        <Header />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
          <div style={{ textAlign: "center", color: muted }}>
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 16 }}>Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div style={{ background: bgProfile, minHeight: "100vh" }}>
        <Header />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
          <div style={{ textAlign: "center", color: "#ef4444" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <div>{error || "Không thể tải thông tin profile"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bgProfile, minHeight: "100vh" }}>
      <Header />
      {/* Profile Container */}
      <div
        style={{ maxWidth: 980, margin: "0 auto", padding: "36px 12px 28px" }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: surface,
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            padding: "40px 40px 36px 40px",
            position: "relative",
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Edit Profile Button - Top Right */}
          {profileData.canSetting && (
            <button
              onClick={() => navigate(`/edit-profile/${id}`)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: surface,
                border: "none",
                padding: "10px 20px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(37, 99, 235, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(37, 99, 235, 0.3)";
              }}
            >
              <FaEdit style={{ fontSize: 14 }} />
              Chỉnh sửa hồ sơ
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {/* Avatar */}
            <div style={{ position: "relative" }}>
              {profileData.avatarUrl ? (
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
                    border: `5px solid ${primary}`,
                    flexShrink: 0,
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "grid",
                    placeItems: "center",
                    color: surface,
                    fontSize: 56,
                    fontWeight: 600,
                    border: `5px solid ${primary}`,
                    flexShrink: 0,
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {(profileData.fullName || profileData.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              {/* Online status indicator */}
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "3px solid white",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 32,
                  color: secondary,
                  marginBottom: 8,
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {profileData.fullName}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: muted,
                  marginBottom: 20,
                  fontWeight: 500,
                }}
              >
                @{profileData.fullName}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {profileData.address && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background:
                        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                      borderRadius: 10,
                      padding: "8px 16px",
                      fontWeight: 600,
                      color: "#0369a1",
                      fontSize: 14,
                      border: "1px solid #bae6fd",
                      boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    <FaMapMarkerAlt
                      style={{ marginRight: 8, color: primary, fontSize: 14 }}
                    />
                    {profileData.address}
                  </span>
                )}
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: 32 }}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 20px",
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    borderRadius: 12,
                    border: "1px solid #bae6fd",
                    minWidth: 100,
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(37, 99, 235, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 24,
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 6,
                    }}
                  >
                    {profileData.trades || 0}
                  </div>
                  <div
                    style={{
                      color: "#0369a1",
                      fontWeight: 600,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <FaExchangeAlt style={{ fontSize: 14 }} /> Đã trao đổi
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 20px",
                    background:
                      "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
                    borderRadius: 12,
                    border: "1px solid #fbcfe8",
                    minWidth: 100,
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(236, 72, 153, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 24,
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 6,
                    }}
                  >
                    {profileData.followers || 0}
                  </div>
                  <div
                    style={{
                      color: "#be185d",
                      fontWeight: 600,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <FaUserFriends style={{ fontSize: 14 }} /> Người theo dõi
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 20px",
                    background:
                      "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    borderRadius: 12,
                    border: "1px solid #bbf7d0",
                    minWidth: 100,
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(34, 197, 94, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 24,
                      background:
                        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 6,
                    }}
                  >
                    {profileData.following || 0}
                  </div>
                  <div
                    style={{
                      color: "#15803d",
                      fontWeight: 600,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <FaUserPlus style={{ fontSize: 14 }} /> Đang theo dõi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Intro */}
          {profileData.bio && (
            <div
              style={{
                margin: "32px 0 0 0",
                paddingTop: 24,
                borderTop: "2px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  color: secondary,
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <i className="bi bi-info-circle" style={{ color: primary }}></i>
                Giới thiệu
              </div>
              <div
                style={{
                  color: "#475569",
                  fontSize: 15,
                  lineHeight: 1.7,
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderRadius: 12,
                  padding: 16,
                  border: "1px solid #e2e8f0",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.02)",
                }}
              >
                {profileData.bio || "Chưa có thông tin giới thiệu"}
              </div>
            </div>
          )}
        </div>
        {/* Tabs + Cards */}
        <div
          style={{
            margin: "32px 0 0",
            background: surface,
            borderRadius: 20,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            minHeight: 340,
            padding: "0",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "24px 32px 0 32px",
              borderBottom: "2px solid #f1f5f9",
              alignItems: "center",
              background: "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
            }}
          >
            {userTabs.map((t, idx) => (
              <button
                key={t}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: 10,
                  background:
                    tab === idx
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "transparent",
                  color: tab === idx ? surface : muted,
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: -2,
                  boxShadow:
                    tab === idx
                      ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                      : undefined,
                  borderBottom:
                    tab === idx
                      ? `3px solid ${primary}`
                      : "3px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  position: "relative",
                }}
                onClick={() => setTab(idx)}
                onMouseEnter={(e) => {
                  if (tab !== idx) {
                    e.currentTarget.style.background = "#f1f5f9";
                    e.currentTarget.style.color = primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (tab !== idx) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = muted;
                  }
                }}
              >
                {t}
              </button>
            ))}
            <div style={{ flex: 1 }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              minHeight: 220,
              padding: 24,
            }}
          >
            {tab === 0 && profileData.posts && profileData.posts.length > 0 ? (
              profileData.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  style={{
                    background: surface,
                    borderRadius: 16,
                    padding: 0,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.borderColor = primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  {post.imageUrls && post.imageUrls.length > 0 ? (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={post.imageUrls[0]}
                        alt={post.title}
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          transition: "transform 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 140,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "grid",
                        placeItems: "center",
                        color: surface,
                        fontSize: 36,
                      }}
                    >
                      <i className="bi bi-image"></i>
                    </div>
                  )}
                  <div style={{ padding: 14, position: "relative", flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 15,
                        color: secondary,
                        marginBottom: 8,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          color:
                            getPostStatus(post.postStatus) === "Đã trao đổi"
                              ? "#10b981"
                              : getPostStatus(post.postStatus) ===
                                "Đang trao đổi"
                              ? "#f59e0b"
                              : muted,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            getPostStatus(post.postStatus) === "Đã trao đổi"
                              ? "#d1fae5"
                              : getPostStatus(post.postStatus) ===
                                "Đang trao đổi"
                              ? "#fef3c7"
                              : "#f1f5f9",
                          padding: "3px 8px",
                          borderRadius: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getPostStatus(post.postStatus)}
                      </span>
                      {post.category && (
                        <span
                          style={{
                            fontSize: 11,
                            color: primary,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    {/* Action icons - Top right */}
                    {(post.canEdit || post.canDelete) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 6,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-post/${post.id}`);
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: "none",
                              background: "rgba(255, 255, 255, 0.9)",
                              color: primary,
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = primary;
                              e.currentTarget.style.color = surface;
                              e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.9)";
                              e.currentTarget.style.color = primary;
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <FaEdit style={{ fontSize: 11 }} />
                          </button>
                        )}
                        {post.canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  "Bạn có chắc muốn xóa bài đăng này?"
                                )
                              ) {
                                // TODO: Implement delete
                              }
                            }}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: "none",
                              background: "rgba(255, 255, 255, 0.9)",
                              color: "#ef4444",
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              backdropFilter: "blur(10px)",
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#ef4444";
                              e.currentTarget.style.color = surface;
                              e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(255, 255, 255, 0.9)";
                              e.currentTarget.style.color = "#ef4444";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <FaTrash style={{ fontSize: 11 }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 20px",
                  color: muted,
                }}
              >
                <div
                  style={{
                    fontSize: 64,
                    marginBottom: 16,
                    opacity: 0.5,
                  }}
                >
                  {tab === 0 ? "📝" : "📋"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                  {tab === 0 ? "Chưa có bài đăng nào" : "Chưa có nội dung"}
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>
                  {tab === 0
                    ? "Hãy tạo bài đăng đầu tiên của bạn!"
                    : "Nội dung sẽ được hiển thị ở đây"}
                </div>
              </div>
            )}
          </div>
          {tab === 0 && profileData.posts && profileData.posts.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0 32px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                style={{
                  padding: "12px 32px",
                  borderRadius: 12,
                  fontWeight: 600,
                  border: "none",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: surface,
                  fontSize: 15,
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(37, 99, 235, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(37, 99, 235, 0.3)";
                }}
              >
                Xem thêm bài đăng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
