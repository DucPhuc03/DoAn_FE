import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
const secondary = "#333";
const muted = "#6b7280";
const surface = "#ffffff";
const bgProfile = "#f6f8fa";

const Profile = () => {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = id || 1; // Default to 1 if no id in URL
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div>Đang tải...</div>
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
            borderRadius: 18,
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
            padding: "32px 36px 30px 36px",
            position: "relative",
          }}
        >
          {/* Edit Profile Button - Top Right */}
          {profileData.canSetting && (
            <button
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "#f8f9fa",
                color: secondary,
                border: "1px solid #e9ecef",
                padding: "8px 16px",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e9ecef";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8f9fa";
              }}
            >
              Chỉnh sửa hồ sơ
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {/* Avatar */}
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt="Avatar"
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.15)",
                  border: `4px solid ${primary}`,
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  background: "#e9ecef",
                  display: "grid",
                  placeItems: "center",
                  color: muted,
                  fontSize: 48,
                  fontWeight: 300,
                  border: `4px solid ${primary}`,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: 64, color: "#dee2e6" }}>×</span>
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 26,
                  color: secondary,
                  marginBottom: 16,
                }}
              >
                {profileData.fullName || profileData.username}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {profileData.address && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f1f3f5",
                      borderRadius: 6,
                      padding: "6px 13px",
                      fontWeight: 500,
                      color: secondary,
                      fontSize: 14,
                    }}
                  >
                    <FaMapMarkerAlt
                      style={{ marginRight: 7, color: primary }}
                    />{" "}
                    {profileData.address}
                  </span>
                )}
                {/* Interests could be added if available in API */}
              </div>
              {/* Stats */}
              <div style={{ display: "flex", gap: 38 }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: primary,
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    {profileData.trades || 0}
                  </div>
                  <div
                    style={{
                      color: secondary,
                      fontWeight: 500,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <FaExchangeAlt /> Đã trao đổi
                  </div>
                </div>
                {/* Followers and Following - would need separate API call */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: primary,
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    0
                  </div>
                  <div
                    style={{
                      color: secondary,
                      fontWeight: 500,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <FaUserFriends /> Người theo dõi
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: primary,
                      marginBottom: 4,
                      letterSpacing: 1,
                    }}
                  >
                    0
                  </div>
                  <div
                    style={{
                      color: secondary,
                      fontWeight: 500,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <FaUserPlus /> Đang theo dõi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Intro */}
          <div
            style={{
              margin: "30px 2px 0 2px",
              paddingTop: 14,
              borderTop: "1px solid #edf0fb",
            }}
          >
            <div
              style={{
                color: secondary,
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Giới thiệu
            </div>
            <div
              style={{
                color: "#495057",
                fontSize: 15,
                minHeight: 40,
                background: "#f8f9fa",
                borderRadius: 8,
                padding: 12,
                border: "1px solid #e9ecef",
              }}
            >
              {profileData.bio || ""}
            </div>
          </div>
        </div>
        {/* Tabs + Cards */}
        <div
          style={{
            margin: "28px 0 0",
            background: surface,
            borderRadius: 18,
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)",
            minHeight: 340,
            padding: "0 3px 7px 3px",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 7,
              padding: "22px 34px 0 34px",
              borderBottom: "1px solid #f2f2f2",
              alignItems: "center",
            }}
          >
            {userTabs.map((t, idx) => (
              <button
                key={t}
                style={{
                  padding: "10px 30px",
                  border: "none",
                  borderRadius: 9,
                  background: tab === idx ? primary : "#f2f6fb",
                  color: tab === idx ? surface : primary,
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: -1,
                  boxShadow:
                    tab === idx
                      ? "0 2px 12px rgba(37, 99, 235, 0.2)"
                      : undefined,
                  borderBottom:
                    tab === idx
                      ? `4px solid ${primary}`
                      : "4px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => setTab(idx)}
              >
                {t}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {/* <button
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: primary,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f2f6fb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <FaCog />
            </button> */}
          </div>
          <div
            style={{
              display: "flex",
              gap: 30,
              minHeight: 220,
              flexWrap: "wrap",
              justifyContent: "flex-start",
              padding: 37,
            }}
          >
            {tab === 0 && profileData.posts && profileData.posts.length > 0 ? (
              profileData.posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    width: 260,
                    background: surface,
                    borderRadius: 12,
                    padding: 0,
                    marginBottom: 24,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e9ecef",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  {post.imageUrls && post.imageUrls.length > 0 ? (
                    <img
                      src={post.imageUrls[0]}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: 148,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 148,
                        background: "#f8f9fa",
                        display: "grid",
                        placeItems: "center",
                        color: "#dee2e6",
                        fontSize: 48,
                        fontWeight: 300,
                      }}
                    >
                      <span>×</span>
                    </div>
                  )}
                  <div style={{ padding: 16, position: "relative" }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: secondary,
                        marginBottom: 8,
                      }}
                    >
                      {post.title}
                    </div>
                    <div
                      style={{
                        color:
                          getPostStatus(post.postStatus) === "Đã trao đổi"
                            ? "#10b981"
                            : muted,
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {getPostStatus(post.postStatus)}
                    </div>
                    {/* Action icons - Bottom right */}
                    {(post.canEdit || post.canDelete) && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        {post.canEdit && (
                          <button
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: "none",
                              background: "#f8f9fa",
                              color: primary,
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = primary;
                              e.currentTarget.style.color = surface;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#f8f9fa";
                              e.currentTarget.style.color = primary;
                            }}
                          >
                            <FaEdit style={{ fontSize: 12 }} />
                          </button>
                        )}
                        {post.canDelete && (
                          <button
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: "none",
                              background: "#f8f9fa",
                              color: "#ef4444",
                              display: "grid",
                              placeItems: "center",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#ef4444";
                              e.currentTarget.style.color = surface;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#f8f9fa";
                              e.currentTarget.style.color = "#ef4444";
                            }}
                          >
                            <FaTrash style={{ fontSize: 12 }} />
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
                  width: "100%",
                  textAlign: "center",
                  padding: "40px 20px",
                  color: muted,
                }}
              >
                {tab === 0 ? "Chưa có bài đăng nào" : "Chưa có nội dung"}
              </div>
            )}
          </div>
          {tab === 0 && profileData.posts && profileData.posts.length > 0 && (
            <div
              style={{ textAlign: "center", marginTop: 5, marginBottom: 20 }}
            >
              <button
                style={{
                  padding: "13px 44px",
                  borderRadius: 10,
                  fontWeight: 600,
                  border: "none",
                  background: primary,
                  color: surface,
                  fontSize: 16,
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#1d4ed8")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = primary)}
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
