import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { getProfile, followUser } from "../service/UserService";
import { createReportUser } from "../service/ReportService";
import { getReview } from "../service/ReviewService";
import { getTradeUser } from "../service/TradeService";
import ProfilePostsTab from "../components/profile/ProfilePostsTab";
import ProfileLikedTab from "../components/profile/ProfileLikedTab";
import ProfileReviewsTab from "../components/profile/ProfileReviewsTab";
import ProfileHistoryTab from "../components/profile/ProfileHistoryTab";
import {
  FaMapMarkerAlt,
  FaExchangeAlt,
  FaUserFriends,
  FaUserPlus,
  FaFlag,
  FaTrophy,
  FaHeart,
} from "react-icons/fa";
import MapViewModal from "../components/MapViewModal";
import "../css/Profile.css";

const allTabs = ["Bài đăng", "Đã thích", "Đánh giá", "Lịch sử"];

// Map tab names for URL (Vietnamese display name -> URL slug)
const tabUrlMap = {
  "Bài đăng": "posts",
  "Đã thích": "liked",
  "Đánh giá": "reviews",
  "Lịch sử": "history"
};

// Reverse map: URL slug -> tab index
const urlToTabIndex = {
  "posts": 0,
  "liked": 1,
  "reviews": 2,
  "history": 3
};

const primary = "#6366F1"; // Blue
const secondary = "#1f2937";
const muted = "#6b7280";
const surface = "#ffffff";
const bgProfile = "#f8fafc";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize tab from URL or default to 0
  const tabFromUrl = searchParams.get("tab") || "posts";
  const initialTab = urlToTabIndex[tabFromUrl] ?? 0;
  const [tab, setTab] = useState(initialTab);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [trades, setTrades] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [usersModalTitle, setUsersModalTitle] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);

  // Compute tabs based on displayHistory
  const userTabs = React.useMemo(() => {
    if (!profileData) return allTabs;
    if (profileData.displayHistory === false) {
      return allTabs.filter((t) => t !== "Lịch sử");
    }
    return allTabs;
  }, [profileData]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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

  // Keep URL in sync with selected tab
  useEffect(() => {
    const currentTabName = userTabs[tab];
    const tabSlug = tabUrlMap[currentTabName] || "posts";
    
    if (tabSlug !== "posts") {
      navigate(`/profile/${id}?tab=${tabSlug}`, { replace: true });
    } else {
      // Remove tab param if tab is "posts" (default)
      navigate(`/profile/${id}`, { replace: true });
    }
  }, [tab, id, navigate, userTabs]);

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
    if (!id || !profileData) return;

    // Optimistic update - change status immediately
    const currentStatus = profileData.followStatus;
    let newStatus;

    if (currentStatus === "FOLLOWING") {
      newStatus = "NOT_FOLLOWING";
    } else if (
      currentStatus === "NOT_FOLLOWING" ||
      currentStatus === "FOLLOW_BACK"
    ) {
      newStatus = "FOLLOWING";
    } else {
      return;
    }

    // Update UI immediately
    setProfileData({
      ...profileData,
      followStatus: newStatus,
    });

    // Call API in background
    try {
      const response = await followUser(id);
      if (response?.code === 200) {
        // Refresh profile to sync with backend
        const profileResponse = await getProfile(id);
        if (profileResponse.code === 1000) {
          setProfileData(profileResponse.data);
        }
      } else {
        // Revert on error
        setProfileData({
          ...profileData,
          followStatus: currentStatus,
        });
      }
    } catch (error) {
      console.error("Follow error:", error);
      // Revert on error
      setProfileData({
        ...profileData,
        followStatus: currentStatus,
      });
    }
  }, [id, profileData]);

  // Get follow button text and action based on followStatus
  const followButtonInfo = React.useMemo(() => {
    if (!profileData?.followStatus) return null;

    const status = profileData.followStatus;
    if (status === "SELF") return null;

    if (status === "FOLLOWING") {
      return {
        text: "Hủy Theo dõi",
        action: handleFollow,
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
          background: "#303a05ff",
          color: surface,
        },
      };
    }

    return null;
  }, [profileData?.followStatus, primary, surface, handleFollow]);

  // Handle report user
  const handleReport = React.useCallback(async () => {
    if (!id || !reportReason.trim()) return;

    setReporting(true);
    try {
      const response = await createReportUser(
        parseInt(id),
        reportReason.trim(),
        "user"
      );
      if (response?.code === 200 || response?.code === 1000) {
        setShowReportModal(false);
        setReportReason("");
        alert("Báo cáo đã được gửi thành công!");
      } else {
        alert(
          response?.message ||
            "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Report error:", error);
      alert(
        error?.response?.data?.message ||
          "Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại."
      );
    } finally {
      setReporting(false);
    }
  }, [id, reportReason]);

  // Get level badge color and text based on trustScore
  const getLevelInfo = React.useMemo(() => {
    const trustScore = profileData?.trustScore ?? 0;

    // Tính cấp độ dựa trên trustScore
    let level = 1;
    if (trustScore >= 90) {
      level = 5;
    } else if (trustScore >= 70) {
      level = 4;
    } else if (trustScore >= 50) {
      level = 3;
    } else if (trustScore >= 31) {
      level = 2;
    } else {
      level = 1;
    }

    let color = "#6b7280";
    let bgColor = "#f3f4f6";
    let text = `Cấp ${level}`;
    let icon = "⭐";

    if (level === 5) {
      color = "#f59e0b";
      bgColor = "#fef3c7";
      icon = "💎";
    } else if (level === 4) {
      color = "#8b5cf6";
      bgColor = "#ede9fe";
      icon = "🏆";
    } else if (level === 3) {
      color = "#f59e0b";
      bgColor = "#fef3c7";
      icon = "🎖️";
    } else if (level === 2) {
      color = "#6366f1";
      bgColor = "#e0e7ff";
      icon = "🏅";
    } else {
      color = "#10b981";
      bgColor = "#d1fae5";
      icon = "🔰";
    }

    return { color, bgColor, text, level, trustScore, icon };
  }, [profileData?.trustScore]);

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-loading">
          <div style={{ textAlign: "center", color: muted }}>
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="profile-loading-text">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-error">
          <div className="profile-error-text">
            <div className="profile-error-icon">⚠️</div>
            <div>{error || "Không thể tải thông tin profile"}</div>
          </div>
        </div>
      </div>
    );
  }

  const isPostOrLiked = tab === 0 || tab === 1;
  const gridTemplateColumns = isPostOrLiked
    ? "repeat(4, minmax(0, 1fr))"
    : "repeat(auto-fill, minmax(220px, 1fr))";

  return (
    <div className="profile-page">
      <Header />

      {/* Background with Mountains */}
      <div className="profile-background">
        {/* Clouds */}
        <div className="profile-cloud profile-cloud-1" />
        <div className="profile-cloud profile-cloud-2" />
        <div className="profile-cloud profile-cloud-3" />

        {/* Mountains */}
        <div className="profile-mountain profile-mountain-1" />
        <div className="profile-mountain profile-mountain-2" />
        <div className="profile-mountain profile-mountain-3" />
      </div>

      {/* Profile Container */}
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          {/* Top Right Actions - Settings/Report and Level Badge */}
          <div className="profile-top-actions">
            {/* Edit Profile Button (own profile) or Report Button (other's profile) */}
            {profileData.canSetting ? (
              <button
                onClick={() => navigate(`/edit-profile/${id}`)}
                className="profile-settings-btn"
                title="Chỉnh sửa hồ sơ"
              >
                <i className="bi bi-gear-fill" style={{ fontSize: "18px" }}></i>
              </button>
            ) : profileData.canReport ? (
              <button
                onClick={() => setShowReportModal(true)}
                className="profile-settings-btn profile-report-icon-btn"
                title="Báo cáo người dùng"
              >
                <FaFlag style={{ fontSize: "16px" }} />
              </button>
            ) : null}
            {/* Level Badge - Right */}
            {getLevelInfo && (
              <div
                className="profile-level-badge"
                title={`${getLevelInfo.text} (Điểm uy tín: ${getLevelInfo.trustScore})`}
              >
                <span className="profile-level-icon">{getLevelInfo.icon}</span>
                <span
                  className="profile-level-text"
                  style={{ color: getLevelInfo.color }}
                >
                  {getLevelInfo.text}
                </span>
              </div>
            )}
          </div>

          <div className="profile-card-header">
            {/* Avatar */}
            <div className="profile-avatar-wrapper">
              {profileData.avatarUrl ? (
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {(profileData.fullName || profileData.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              {/* Online status indicator */}
              <div className="profile-online-indicator" />
            </div>

            {/* Info */}
            <div className="profile-info">
              <div className="profile-fullname">{profileData.fullName}</div>
              <div className="profile-username">@{profileData.username}</div>
              {/* Follow Button and Report Button */}
              <div className="profile-actions">
                {followButtonInfo && (
                  <button
                    onClick={followButtonInfo.action}
                    className="profile-follow-btn"
                    style={followButtonInfo.style}
                  >
                    {followButtonInfo.text}
                  </button>
                )}
              </div>
              <div className="profile-address-wrapper">
                <button
                  className="profile-info-btn"
                  onClick={() => setShowMapModal(true)}
                  disabled={!profileData.address}
                  title={profileData.address || "Chưa có địa chỉ"}
                >
                  <FaMapMarkerAlt style={{ marginRight: 6, fontSize: 14 }} />
                  Địa chỉ
                </button>
                {profileData.interests && profileData.interests.length > 0 && (
                  <button
                    className="profile-info-btn profile-info-btn-secondary"
                    onClick={() => {
                      // Có thể navigate tới trang sở thích hoặc hiển thị modal
                      alert(
                        `Sở thích: ${profileData.interests
                          .map((i) => i.name || i)
                          .join(", ")}`
                      );
                    }}
                    title="Xem sở thích của tôi"
                  >
                    <FaHeart style={{ marginRight: 6, fontSize: 14 }} />
                    Sở thích của tôi
                  </button>
                )}
              </div>
              {/* Stats */}
              <div className="profile-stats">
                {/* --------- CARD 1 --------- */}
                <div className="profile-stat-card">
                  <div className="profile-stat-value">
                    {profileData.trades || 0}
                  </div>
                  <div className="profile-stat-label">
                    <FaExchangeAlt /> Đã trao đổi
                  </div>
                </div>

                {/* --------- CARD 2 --------- */}
                <div
                  className="profile-stat-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setUsersList(profileData.followers || []);
                    setUsersModalTitle("Người theo dõi");
                    setShowUsersModal(true);
                  }}
                >
                  <div className="profile-stat-value">
                    {profileData.followers?.length || 0}
                  </div>
                  <div className="profile-stat-label">
                    <FaUserFriends /> Người theo dõi
                  </div>
                </div>

                {/* --------- CARD 3 --------- */}
                <div
                  className="profile-stat-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setUsersList(profileData.following || []);
                    setUsersModalTitle("Đang theo dõi");
                    setShowUsersModal(true);
                  }}
                >
                  <div className="profile-stat-value">
                    {profileData.following?.length || 0}
                  </div>
                  <div className="profile-stat-label">
                    <FaUserPlus /> Đang theo dõi
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Intro */}
          {profileData.bio && (
            <div className="profile-bio-section">
              <div className="profile-bio-title">
                <i className="bi bi-info-circle"></i>
                Giới thiệu
              </div>
              <div className="profile-bio-content">
                {profileData.bio || "Chưa có thông tin giới thiệu"}
              </div>
            </div>
          )}
        </div>
        {/* Tabs + Cards */}
        <div className="profile-tabs-container">
          {/* Tabs */}
          <div className="profile-tabs-header">
            {userTabs.map((t, idx) => (
              <button
                key={t}
                className={`profile-tab-btn ${tab === idx ? "active" : ""}`}
                onClick={() => setTab(idx)}
              >
                {t}
              </button>
            ))}
            <div style={{ flex: 1 }} />
          </div>
          <div className="profile-tabs-content" style={{ gridTemplateColumns }}>
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
              <div className="profile-empty-state">
                <div className="profile-empty-icon">
                  {tab === 0 ? "📝" : tab === 1 ? "❤️" : "📋"}
                </div>
                <div className="profile-empty-text">
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

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="profile-report-modal-overlay"
          onClick={() => {
            if (!reporting) {
              setShowReportModal(false);
              setReportReason("");
            }
          }}
        >
          <div
            className="profile-report-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-report-modal-title">Báo cáo người dùng</div>
            <div className="profile-report-modal-subtitle">
              Vui lòng nhập lý do báo cáo cho @{profileData?.username}
            </div>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Nhập lý do báo cáo..."
              className="profile-report-textarea"
              disabled={reporting}
            />
            <div className="profile-report-modal-actions">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                disabled={reporting}
                className="profile-report-cancel-btn"
              >
                Hủy
              </button>
              <button
                onClick={handleReport}
                disabled={reporting || !reportReason.trim()}
                className="profile-report-submit-btn"
              >
                {reporting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List Modal */}
      {showUsersModal && (
        <div
          className="profile-report-modal-overlay"
          onClick={() => setShowUsersModal(false)}
        >
          <div
            className="profile-report-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", maxHeight: "80vh" }}
          >
            <div className="profile-report-modal-title">{usersModalTitle}</div>
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "10px 0",
              }}
            >
              {usersList.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: muted,
                  }}
                >
                  <div>Chưa có người dùng nào</div>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {usersList.map((user) => (
                    <div
                      key={user.id || user.userId}
                      onClick={() => {
                        const userId = user.id || user.userId;
                        if (userId) {
                          navigate(`/profile/${userId}`);
                          setShowUsersModal(false);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        background: "#f9fafb",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || user.username}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: primary,
                            color: surface,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          {(user.fullName || user.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "15px",
                            color: secondary,
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.fullName || user.username || "Người dùng"}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: muted,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{user.username || "user"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="profile-report-modal-actions">
              <button
                onClick={() => setShowUsersModal(false)}
                className="profile-report-cancel-btn"
                style={{ width: "100%" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapModal && (
        <MapViewModal
          address={profileData?.address}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
