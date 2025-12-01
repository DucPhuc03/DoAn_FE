import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getProfile } from "../service/user/UserService";
import { getReview } from "../service/review/ReviewService";
import { getTradeUser } from "../service/trade/TradeService";
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

const allTabs = ["Bài đăng", "Đã thích", "Đánh giá", "Lịch sử"];

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
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  // Compute tabs based on displayHistory
  const userTabs = React.useMemo(() => {
    if (!profileData) return allTabs;
    if (profileData.displayHistory === false) {
      return allTabs.filter((t) => t !== "Lịch sử");
    }
    return allTabs;
  }, [profileData]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = id;
        const response = await getProfile(userId);
        if (response.code === 1000) {
          setProfileData(response.data);
          console.log("Profile data:", response.data);
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

  // Reset tab to 0 when tabs change (e.g., when displayHistory changes)
  useEffect(() => {
    if (profileData && tab >= userTabs.length) {
      setTab(0);
    }
  }, [userTabs.length, profileData]);

  // Fetch reviews when tab changes to reviews tab or when id changes
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsTabIndex = userTabs.indexOf("Đánh giá");
      if (tab === reviewsTabIndex && id) {
        try {
          setLoadingReviews(true);
          const response = await getReview(id);

          // Handle API response structure
          let reviewsData = [];
          if (response?.code === 1000 && response?.data) {
            reviewsData = Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            reviewsData = response;
          } else if (Array.isArray(response?.data)) {
            reviewsData = response.data;
          }

          setReviews(reviewsData);
        } catch (err) {
          console.error("Error fetching reviews:", err);
          setReviews([]);
        } finally {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [tab, id, userTabs]);

  // Fetch trades when tab changes to history tab or when id changes
  useEffect(() => {
    const fetchTrades = async () => {
      const historyTabIndex = userTabs.indexOf("Lịch sử");
      if (tab === historyTabIndex && id) {
        try {
          setLoadingTrades(true);
          const response = await getTradeUser();

          // Handle API response structure
          let tradesData = [];
          if (response?.code === 1000 && response?.data) {
            tradesData = Array.isArray(response.data) ? response.data : [];
          } else if (Array.isArray(response)) {
            tradesData = response;
          } else if (Array.isArray(response?.data)) {
            tradesData = response.data;
          }

          setTrades(tradesData);
        } catch (err) {
          console.error("Error fetching trades:", err);
          setTrades([]);
        } finally {
          setLoadingTrades(false);
        }
      }
    };

    fetchTrades();
  }, [tab, id, userTabs]);

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

  // Get trade status text
  const getTradeStatus = (status) => {
    if (!status) return "Chưa xác định";
    if (status === "COMPLETED") return "Đã hoàn thành";
    if (status === "COMPLETED_PENDING") return "Đang chờ xác nhận";
    if (status === "CANCELLED") return "Đã hủy";
    return "Đang trao đổi";
  };

  // Get trade status color
  const getTradeStatusColor = (status) => {
    if (!status) return muted;
    if (status === "COMPLETED") return "#22c55e";
    if (status === "COMPLETED_PENDING") return "#f59e0b";
    if (status === "CANCELLED") return "#ef4444";
    return primary;
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
    <div
      style={{
        background: bgProfile,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Header />

      {/* Background with Mountains */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "400px",
          background:
            "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 60%, #38bdf8 100%)",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {/* Clouds */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "10%",
            width: "120px",
            height: "40px",
            background: "rgba(255, 255, 255, 0.6)",
            borderRadius: "50px",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "15%",
            width: "100px",
            height: "35px",
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "50px",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "50%",
            width: "80px",
            height: "30px",
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50px",
            opacity: 0.6,
          }}
        />

        {/* Mountains */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(180deg, transparent 0%, #14b8a6 20%, #0d9488 50%, #0f766e 100%)",
            clipPath:
              "polygon(0% 100%, 10% 60%, 20% 80%, 30% 50%, 40% 70%, 50% 40%, 60% 60%, 70% 35%, 80% 55%, 90% 45%, 100% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background:
              "linear-gradient(180deg, transparent 0%, #2dd4bf 30%, #14b8a6 70%, #0d9488 100%)",
            clipPath:
              "polygon(0% 100%, 15% 70%, 25% 85%, 35% 65%, 45% 75%, 55% 55%, 65% 70%, 75% 50%, 85% 65%, 100% 100%)",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background:
              "linear-gradient(180deg, transparent 0%, #5eead4 40%, #2dd4bf 80%, #14b8a6 100%)",
            clipPath:
              "polygon(0% 100%, 20% 80%, 30% 90%, 40% 75%, 50% 85%, 60% 70%, 70% 80%, 80% 65%, 90% 75%, 100% 100%)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Profile Container */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "36px 12px 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: surface,
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            padding: "40px 40px 36px 40px",
            position: "relative",
            border: "1px solid #f1f5f9",
            marginTop: "200px",
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
                background: "#f8f9fa",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                padding: "10px",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e9ecef";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f8f9fa";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(0, 0, 0, 0.1)";
              }}
              title="Chỉnh sửa hồ sơ"
            >
              <i className="bi bi-gear-fill" style={{ fontSize: "18px" }}></i>
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
                    "linear-gradient(135deg, #070708ff 0%, #272525ff 100%)",
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
                @{profileData.username}
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

                      padding: "8px 16px",
                      fontWeight: 600,

                      fontSize: 18,
                    }}
                  >
                    <FaMapMarkerAlt style={{ marginRight: 8, fontSize: 14 }} />
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

                    borderRadius: 12,
                    border: "1px solid #d3dbdeff",
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

                    borderRadius: 12,
                    border: "1px solid #d3dbdeff",
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

                    borderRadius: 12,
                    border: "1px solid #d3dbdeff",
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
            {userTabs.map((t, idx) => {
              const tabIndex = allTabs.indexOf(t);
              return (
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
              );
            })}
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
                  {post.imageUrl ? (
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={post.imageUrl}
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
                  </div>
                </div>
              ))
            ) : tab === 1 &&
              profileData.likedPosts &&
              profileData.likedPosts.length > 0 ? (
              profileData.likedPosts.map((post) => (
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
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    {post.imageUrl ? (
                      <>
                        <img
                          src={post.imageUrl}
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
                          onError={(e) => {
                            e.target.style.display = "none";
                            const fallback = e.target.nextElementSibling;
                            if (fallback) {
                              fallback.style.display = "grid";
                            }
                          }}
                        />
                        <div
                          style={{
                            width: "100%",
                            height: 140,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "none",
                            placeItems: "center",
                            color: surface,
                            fontSize: 36,
                          }}
                        >
                          <i className="bi bi-image"></i>
                        </div>
                      </>
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
                  </div>

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
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11,
                          color: muted,
                        }}
                      >
                        <i
                          className="bi bi-heart-fill"
                          style={{ color: "#ec4899" }}
                        ></i>
                        <span style={{ fontWeight: 600 }}>
                          {post.totalLikes || 0}
                        </span>
                      </div>
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
                  </div>
                </div>
              ))
            ) : userTabs[tab] === "Đánh giá" ? (
              // Reviews Tab
              loadingReviews ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 20px",
                    color: muted,
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      gridColumn: "1 / -1",
                      background: surface,
                      borderRadius: 16,
                      padding: 20,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e2e8f0",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", gap: 16 }}>
                      {/* Reviewer Info */}
                      <div style={{ display: "flex", gap: 12, flex: 1 }}>
                        {/* Avatar */}
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: review.reviewerAvatar
                              ? "transparent"
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {review.reviewerAvatar ? (
                            <img
                              src={review.reviewerAvatar}
                              alt={review.reviewerName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                color: surface,
                                fontSize: 20,
                                fontWeight: 600,
                              }}
                            >
                              {review.reviewerName.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Review Content */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 16,
                                color: secondary,
                              }}
                            >
                              {review.reviewerName}
                            </div>
                            {/* Rating Stars */}
                            <div
                              style={{
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                              }}
                            >
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`bi ${
                                    index < review.rating
                                      ? "bi-star-fill"
                                      : "bi-star"
                                  }`}
                                  style={{
                                    color:
                                      index < review.rating
                                        ? "#fbbf24"
                                        : "#d1d5db",
                                    fontSize: "14px",
                                  }}
                                ></i>
                              ))}
                            </div>
                            <div
                              style={{
                                marginLeft: "auto",
                                fontSize: 12,
                                color: muted,
                              }}
                            >
                              {formatDate(review.reviewDate)}
                            </div>
                          </div>
                          <div
                            style={{
                              color: "#475569",
                              fontSize: 14,
                              lineHeight: 1.6,
                              marginBottom: 12,
                            }}
                          >
                            {review.content}
                          </div>

                          {/* Item Info */}
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              padding: 12,
                              background: "#f8fafc",
                              borderRadius: 10,
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            {review.itemImage ? (
                              <img
                                src={review.itemImage}
                                alt={review.itemTitle}
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 8,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 8,
                                  background: "#e5e7eb",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i
                                  className="bi bi-image text-muted"
                                  style={{ fontSize: "1.5rem" }}
                                ></i>
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: 14,
                                  color: secondary,
                                  marginBottom: 4,
                                }}
                              >
                                {review.itemTitle}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: muted,
                                }}
                              >
                                Sản phẩm đã trao đổi
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                    ⭐
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}
                  >
                    Chưa có đánh giá nào
                  </div>
                </div>
              )
            ) : userTabs[tab] === "Lịch sử" ? (
              // History Tab
              loadingTrades ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 20px",
                    color: muted,
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : trades.length > 0 ? (
                trades.map((trade) => (
                  <div
                    key={trade.tradeId}
                    style={{
                      gridColumn: "1 / -1",
                      background: surface,
                      borderRadius: 16,
                      padding: 24,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e2e8f0",
                      marginBottom: 16,
                    }}
                  >
                    {/* Header with user info and status */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                        paddingBottom: 16,
                        borderBottom: "2px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {/* User Avatar */}
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: trade.userAvatar
                              ? "transparent"
                              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {trade.userAvatar ? (
                            <img
                              src={trade.userAvatar}
                              alt={trade.userName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                color: surface,
                                fontSize: 20,
                                fontWeight: 600,
                              }}
                            >
                              {trade.userName?.charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 16,
                              color: secondary,
                              marginBottom: 4,
                            }}
                          >
                            {trade.userName || "Người dùng"}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: muted,
                            }}
                          >
                            Mã trao đổi: #{trade.tradeId}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trade Items */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        gap: 20,
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      {/* Requester Post */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: muted,
                            fontWeight: 600,
                            marginBottom: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          Sản phẩm yêu cầu
                        </div>
                        {trade.requesterPostImage ? (
                          <img
                            src={trade.requesterPostImage}
                            alt={trade.requesterPostTitle}
                            style={{
                              width: "70%",
                              height: 150,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 12,
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            width: "100%",
                            height: 120,
                            background: "#e5e7eb",
                            borderRadius: 8,
                            marginBottom: 12,
                            display: trade.requesterPostImage ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i
                            className="bi bi-image text-muted"
                            style={{ fontSize: "2rem" }}
                          ></i>
                        </div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: secondary,
                            lineHeight: 1.4,
                          }}
                        >
                          {trade.requesterPostTitle}
                        </div>
                      </div>

                      {/* Exchange Icon */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: surface,
                            fontSize: 20,
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          }}
                        >
                          <FaExchangeAlt />
                        </div>
                      </div>

                      {/* Owner Post */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: muted,
                            fontWeight: 600,
                            marginBottom: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          Sản phẩm của bạn
                        </div>
                        {trade.ownerPostImage ? (
                          <img
                            src={trade.ownerPostImage}
                            alt={trade.ownerPostTitle}
                            style={{
                              width: "70%",
                              height: 120,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 12,
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            width: "100%",
                            height: 120,
                            background: "#e5e7eb",
                            borderRadius: 8,
                            marginBottom: 12,
                            display: trade.ownerPostImage ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i
                            className="bi bi-image text-muted"
                            style={{ fontSize: "2rem" }}
                          ></i>
                        </div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: secondary,
                            lineHeight: 1.4,
                          }}
                        >
                          {trade.ownerPostTitle}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      {/* Nếu cả hai đều false -> hiển thị "Đang chờ xác nhận" */}
                      {trade.canComplete === false &&
                      trade.canRate === false ? (
                        <div
                          style={{
                            padding: "10px 20px",
                            borderRadius: 8,
                            background: "#fef3c7",
                            color: "#d97706",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          Đang chờ xác nhận
                        </div>
                      ) : (
                        <>
                          {/* Nếu canComplete === true -> hiển thị nút "Hoàn thành" */}
                          {trade.canComplete && (
                            <button
                              onClick={() => {
                                // TODO: Implement complete trade
                                alert(
                                  "Chức năng hoàn thành trao đổi đang được phát triển"
                                );
                              }}
                              style={{
                                padding: "10px 20px",
                                borderRadius: 8,
                                background: "#f59e0b",
                                color: surface,
                                border: "none",
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                transition: "all 0.3s",
                                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(37, 99, 235, 0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 2px 8px rgba(37, 99, 235, 0.3)";
                              }}
                            >
                              Hoàn thành
                            </button>
                          )}
                          {/* Nếu canRate === true -> hiển thị nút "Đánh giá" */}
                          {trade.canRate && (
                            <button
                              onClick={() => {
                                // Navigate to review page or open review modal
                                navigate(
                                  `/post/${trade.requesterPostTitle}?tradeId=${trade.tradeId}&review=true`
                                );
                              }}
                              style={{
                                padding: "10px 20px",
                                borderRadius: 8,
                                background: "transparent",
                                color: primary,
                                border: `2px solid ${primary}`,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: "pointer",
                                transition: "all 0.3s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${primary}10`;
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }}
                            >
                              Đánh giá
                            </button>
                          )}
                        </>
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
                    📋
                  </div>
                  <div
                    style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}
                  >
                    Chưa có lịch sử
                  </div>
                </div>
              )
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
                  {tab === 0 ? "📝" : tab === 1 ? "❤️" : "📋"}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                  {tab === 0
                    ? "Chưa có bài đăng nào"
                    : tab === 1
                    ? "Chưa có bài đăng nào đã thích"
                    : "Chưa có nội dung"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
