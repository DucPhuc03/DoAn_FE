import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getProfile,
  followUser,
  unfollowUser,
} from "../service/user/UserService";
import { getReview } from "../service/review/ReviewService";
import { getTradeUser } from "../service/trade/TradeService";
import ProfilePostsTab from "../components/profile/ProfilePostsTab";
import ProfileLikedTab from "../components/profile/ProfileLikedTab";
import ProfileReviewsTab from "../components/profile/ProfileReviewsTab";
import ProfileHistoryTab from "../components/profile/ProfileHistoryTab";
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
  const [isFollowing, setIsFollowing] = useState(false);

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
          // Set follow status based on followStatus from API
          if (response.data.followStatus) {
            setIsFollowing(response.data.followStatus);
          }
        }
      } catch (err) {
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
          reviewsData = response.data;

          setReviews(reviewsData);
        } catch (err) {
        } finally {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [tab, id, userTabs]);

  // Fetch trades function
  const fetchTrades = React.useCallback(async () => {
    const historyTabIndex = userTabs.indexOf("Lịch sử");
    if (tab === historyTabIndex && id) {
      try {
        setLoadingTrades(true);
        const response = await getTradeUser();

        // Handle API response structure
        let tradesData = [];
        tradesData = response.data;

        setTrades(tradesData);
      } catch (err) {
      } finally {
        setLoadingTrades(false);
      }
    }
  }, [tab, id, userTabs]);

  // Fetch trades when tab changes to history tab or when id changes
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

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

  // Handle follow/unfollow
  const handleFollow = React.useCallback(async () => {
    if (!id) return;
    try {
      const response = await followUser(id);
      if (response?.code === 1000) {
        setIsFollowing(true);
        // Refresh profile to update followStatus
        const profileResponse = await getProfile(id);
        if (profileResponse.code === 1000) {
          setProfileData(profileResponse.data);
        }
      } else {
        alert(response?.message || "Có lỗi xảy ra khi theo dõi");
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert("Có lỗi xảy ra khi theo dõi");
    }
  }, [id]);

  const handleUnfollow = React.useCallback(async () => {
    if (!id) return;
    try {
      const response = await unfollowUser(id);
      if (response?.code === 1000) {
        setIsFollowing(false);
        // Refresh profile to update followStatus
        const profileResponse = await getProfile(id);
        if (profileResponse.code === 1000) {
          setProfileData(profileResponse.data);
        }
      } else {
        alert(response?.message || "Có lỗi xảy ra khi hủy theo dõi");
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      alert("Có lỗi xảy ra khi hủy theo dõi");
    }
  }, [id]);

  // Get follow button text and action based on followStatus
  const followButtonInfo = React.useMemo(() => {
    if (!profileData?.followStatus) return null;

    const status = profileData.followStatus;
    if (status === "SELF") return null;

    if (status === "FOLLOWING") {
      return {
        text: "Hủy Theo dõi",
        action: handleUnfollow,
        style: {
          background: "#ef4444",
          color: surface,
        },
      };
    }

    if (status === "FOLLOW_BACK") {
      return {
        text: "Theo dõi lại",
        action: handleFollow,
        style: {
          background: "#caf310ff",
          color: surface,
        },
      };
    }

    if (status === "NOT_FOLLOWING") {
      return {
        text: "Theo dõi",
        action: handleFollow,
        style: {
          background: "#caf310ff",
          color: surface,
        },
      };
    }

    return null;
  }, [
    profileData?.followStatus,
    primary,
    surface,
    handleFollow,
    handleUnfollow,
  ]);

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
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                @{profileData.username}
              </div>
              {/* Follow Button */}
              {followButtonInfo && (
                <div style={{ marginBottom: 20 }}>
                  <button
                    onClick={followButtonInfo.action}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 8,
                      border: "none",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      ...followButtonInfo.style,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {followButtonInfo.text}
                  </button>
                </div>
              )}
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
                    {profileData.followers.length || 0}
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
                    {profileData.following.length || 0}
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
            {tab === 0 ? (
              <ProfilePostsTab
                posts={profileData.posts}
                navigate={navigate}
                primary={primary}
                secondary={secondary}
                surface={surface}
              />
            ) : tab === 1 ? (
              <ProfileLikedTab
                likedPosts={profileData.likedPosts}
                navigate={navigate}
                primary={primary}
                secondary={secondary}
                surface={surface}
                muted={muted}
              />
            ) : userTabs[tab] === "Đánh giá" ? (
              <ProfileReviewsTab
                reviews={reviews}
                loadingReviews={loadingReviews}
                formatDate={formatDate}
                muted={muted}
                secondary={secondary}
                surface={surface}
              />
            ) : userTabs[tab] === "Lịch sử" ? (
              <ProfileHistoryTab
                trades={trades}
                loadingTrades={loadingTrades}
                onRefreshTrades={fetchTrades}
                navigate={navigate}
                primary={primary}
                secondary={secondary}
                surface={surface}
                muted={muted}
              />
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
