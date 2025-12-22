import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getPostDetail,
  getPostComments,
  createComment,
  updatePostStatus,
  likePost,
  deletePost,
  createViewHistory,
  getPostSimilarity,
} from "../service/PostService";
import { createTrade } from "../service/TradeService";
import { createReportPost } from "../service/ReportService";
import MapInlineView from "../components/MapInlineView";
import "../css/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const viewHistoryTimeoutRef = useRef(null);
  const hasCreatedViewHistoryRef = useRef(false);
  const currentPostIdRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    fetchPostDetail();
    fetchSimilarPosts();
  }, [id]);

  const fetchSimilarPosts = async () => {
    try {
      setLoadingSimilar(true);
      const response = await getPostSimilarity(id);
      if (response.data) {
        setSimilarPosts(response.data);
      } else {
        setSimilarPosts(response);
      }
    } catch (error) {
      console.error("Error fetching similar posts:", error);
      setSimilarPosts([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Track view history after 10 seconds
  useEffect(() => {
    // Reset when post ID changes
    if (currentPostIdRef.current !== id) {
      hasCreatedViewHistoryRef.current = false;
      currentPostIdRef.current = id;
    }

    // Clear any existing timeout
    if (viewHistoryTimeoutRef.current) {
      clearTimeout(viewHistoryTimeoutRef.current);
      viewHistoryTimeoutRef.current = null;
    }

    // Only create view history if post is loaded, not loading, and user is not the owner
    if (
      !loading &&
      post &&
      !post.owner &&
      !hasCreatedViewHistoryRef.current &&
      id
    ) {
      viewHistoryTimeoutRef.current = setTimeout(async () => {
        try {
          await createViewHistory(id);
          hasCreatedViewHistoryRef.current = true;
        } catch (error) {
          console.error("Error creating view history:", error);
        }
      }, 10000); // 10 seconds
    }

    // Cleanup on unmount or when id/loading/post changes
    return () => {
      if (viewHistoryTimeoutRef.current) {
        clearTimeout(viewHistoryTimeoutRef.current);
        viewHistoryTimeoutRef.current = null;
      }
    };
  }, [id, loading, post]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await getPostDetail(id);
      // API trả về { code, message, data }
      if (response.data) {
        setPost(response.data);
      } else {
        setPost(response);
      }
    } catch (error) {
      console.error("Error fetching post detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      await createComment(id, commentText);
      setCommentText("");
      fetchPostDetail(); // Refresh to get updated comments
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleLike = async () => {
    // Không cho phép like nếu là chủ bài đăng
    if (post?.owner) return;

    // TODO: Implement like API call
    await likePost(id);
    if (post) {
      setPost({
        ...post,
        liked: !post.liked,
        totalLikes: post.liked ? post.totalLikes - 1 : post.totalLikes + 1,
      });
    }
  };

  const handleProposeExchange = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!post?.userId) {
      alert("Không tìm thấy thông tin người đăng bài để tạo trao đổi.");
      return;
    }

    const payload = {
      ownerPostId: Number(id),
      userOwnerId: post.userId,
    };

    createTrade(payload)
      .then((res) => {
        // Nếu backend trả về tradeId trong res.data, có thể điều hướng tới chat hoặc chi tiết trade
        alert("Tạo yêu cầu trao đổi thành công");
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Error creating trade:", error);
        alert("Không thể tạo yêu cầu trao đổi. Vui lòng thử lại.");
      });
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updatePostStatus(id, newStatus);
      setShowStatusModal(false);
      fetchPostDetail(); // Refresh to get updated status
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeletePost = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa bài đăng này? Hành động không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      await deletePost(id);
      alert("Đã xóa bài đăng thành công");
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Không thể xóa bài đăng. Vui lòng thử lại.");
    }
  };

  const handleReportPost = async () => {
    if (!user) {
      if (
        window.confirm(
          "Bạn cần đăng nhập để báo cáo bài đăng. Chuyển đến trang đăng nhập?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    const reason = window.prompt("Nhập lý do báo cáo bài đăng:");
    if (!reason || !reason.trim()) {
      return;
    }

    try {
      await createReportPost(post.userId, Number(id), reason.trim(), "post");
      alert("Gửi báo cáo thành công");
    } catch (error) {
      console.error("Error reporting post:", error);
      alert("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    }
  };

  const getAvailableStatuses = () => {
    const currentStatus = post.postStatus;
    const statuses = {
      AVAILABLE: "Có thể trao đổi",
      PENDING: "Đang trao đổi",
      COMPLETED: "Đã trao đổi",
    };

    // Return available statuses based on current status
    if (currentStatus === "AVAILABLE") {
      return [
        { value: "PENDING", label: "Đang trao đổi" },
        { value: "COMPLETED", label: "Đã trao đổi" },
      ];
    } else if (currentStatus === "PENDING") {
      return [
        { value: "AVAILABLE", label: "Có thể trao đổi" },
        { value: "COMPLETED", label: "Đã trao đổi" },
      ];
    } else {
      return [
        { value: "AVAILABLE", label: "Có thể trao đổi" },
        { value: "PENDING", label: "Đang trao đổi" },
      ];
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      COMPLETED: "Đã trao đổi",
      PENDING: "Đang trao đổi",
      AVAILABLE: "Có thể trao đổi",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      COMPLETED: "text-success",
      PENDING: "text-warning",
      AVAILABLE: "text-info",
    };
    return colorMap[status] || "text-secondary";
  };

  const nextImage = () => {
    if (post?.imageUrls?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (post?.imageUrls?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.imageUrls.length) % post.imageUrls.length
      );
    }
  };

  if (loading) {
    return (
      <div className="postdetail-page">
        <Header />
        <div className="container py-4">
          <div className="postdetail-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="postdetail-page">
        <Header />
        <div className="container py-4">
          <div className="postdetail-error">
            <p className="text-muted">Không tìm thấy bài đăng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="postdetail-page">
      <Header />
      <div className="container py-4">
        {/* Page Title */}
        <div className="mb-4">
          <h2 className="postdetail-title">Bài đăng</h2>
        </div>

        {/* Main Content - Two Columns */}
        <div className="row g-5 mb-4">
          {/* Left Column - Image Gallery and Poster Info */}
          <div className="col-lg-6 ms-5 ">
            {/* Image Gallery with Thumbnails on Left */}
            <div className="postdetail-gallery-container">
              {post.imageUrls && post.imageUrls.length > 0 ? (
                <>
                  {/* Thumbnails Column - Left Side */}
                  {post.imageUrls.length > 1 && (
                    <div className="postdetail-thumbnails">
                      {post.imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`postdetail-thumbnail ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={url} alt={`Thumbnail ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Image - Right Side */}
                  <div className="postdetail-gallery">
                    <img
                      src={post.imageUrls[currentImageIndex]}
                      alt={`${post.title} - ${currentImageIndex + 1}`}
                      className="postdetail-gallery-image"
                    />
                    {/* Navigation Arrows */}
                    {post.imageUrls.length > 1 && (
                      <>
                        <button
                          className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-sm postdetail-gallery-nav"
                          onClick={prevImage}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                          className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-sm postdetail-gallery-nav"
                          onClick={nextImage}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="postdetail-gallery">
                  <div className="postdetail-no-image">
                    <div className="text-center">
                      <i className="bi bi-image text-muted"></i>
                      <p className="text-muted mt-2">Không có hình ảnh</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Poster Information */}
            <div className="d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center gap-3">
                {/* Avatar */}
                <div
                  className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onClick={() =>
                    post.userId && navigate(`/profile/${post.userId}`)
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {post.avatarUrl ? (
                    <img
                      src={post.avatarUrl}
                      alt={post.username}
                      className="rounded-circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-fill text-white fs-5"></i>
                  )}
                </div>
                <div>
                  <p
                    className="mb-0 fw-semibold text-dark"
                    style={{
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onClick={() =>
                      post.userId && navigate(`/profile/${post.userId}`)
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#2563eb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#1f2937";
                    }}
                  >
                    {post.username || "Người đăng"}
                  </p>
                  <small className="text-muted">
                    {formatDate(post.postDate) || "Ngày đăng"}
                  </small>
                </div>
              </div>
              {/* Like Button */}
              <button
                className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                onClick={handleLike}
                disabled={post.owner}
                style={{
                  fontSize: "1.2rem",
                  opacity: post.owner ? 0.5 : 1,
                  cursor: post.owner ? "not-allowed" : "pointer",
                }}
              >
                <i
                  className={`bi ${
                    post.liked
                      ? "bi-heart-fill text-danger"
                      : "bi-heart text-dark"
                  }`}
                ></i>
                {post.totalLikes > 0 && (
                  <span className="text-dark small">{post.totalLikes}</span>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Post Details */}
          <div className="col-lg-5 ms-4">
            <div className="h-100">
              {/* Title */}
              <h3 className="fw-bold text-dark mb-4">{post.title}</h3>

              {/* Item Details */}
              <div className="mb-3">
                <label className=" fw-bold  d-block mb-1 fw-semibold">
                  Mô tả
                </label>
                <p
                  className="mb-0 text-dark"
                  style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}
                >
                  {post.description || "Chưa có mô tả"}
                </p>
              </div>
              <div className="mb-4">
                <div className="mb-3">
                  <label className="  fw-bold text-dark d-block mb-1 fw-semibold">
                    Danh mục
                  </label>
                  <p className="mb-0  ">{post.category?.name || "Chưa có"}</p>
                </div>
                <div className="mb-3">
                  <label className=" fw-bold  d-block mb-1 fw-semibold">
                    Tình trạng
                  </label>
                  <p className="mb-0  text-dark">
                    {post.itemCondition || "Chưa có"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className=" fw-bold  d-block mb-1 fw-semibold">
                    Yêu cầu trao đổi
                  </label>
                  <p
                    className="mb-0 text-dark"
                    style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}
                  >
                    {post.tag || "Chưa có yêu cầu"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className=" fw-bold  d-block mb-1 fw-semibold">
                    Trạng thái
                  </label>
                  <p className={`mb-0  ${getStatusColor(post.postStatus)}`}>
                    {getStatusLabel(post.postStatus)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 flex-wrap">
                {!post.owner && (
                  <button
                    className={`btn flex-grow-1 py-3 rounded-3 fw-semibold ${
                      post.postStatus === "PENDING" ||
                      post.postStatus === "COMPLETED"
                        ? "btn-secondary"
                        : "btn-warning"
                    }`}
                    onClick={handleProposeExchange}
                    style={{ fontSize: "1rem" }}
                    disabled={
                      post.postStatus === "PENDING" ||
                      post.postStatus === "COMPLETED"
                    }
                  >
                    {post.postStatus === "COMPLETED" ? (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Đã trao đổi
                      </>
                    ) : post.postStatus === "PENDING" ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Đang trao đổi
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-left-right me-2"></i>
                        Bắt đầu trao đổi
                      </>
                    )}
                  </button>
                )}
                {post.canReport && !post.owner && (
                  <button
                    className="btn btn-outline-danger py-3 rounded-3"
                    type="button"
                    onClick={handleReportPost}
                    style={{ minWidth: "120px" }}
                  >
                    <i className="bi bi-flag me-2" />
                    Báo cáo
                  </button>
                )}
                {post.canUpdateStatus && (
                  <button
                    className="btn btn-outline-secondary py-3 rounded-3"
                    onClick={() => setShowStatusModal(true)}
                    style={{ minWidth: "120px" }}
                  >
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Cập nhật trạng thái
                  </button>
                )}
                {post.canEdit && (
                  <button
                    className="btn btn-outline-secondary py-3 rounded-3"
                    onClick={() => navigate(`/edit-post/${id}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                )}
                {post.canDelete && (
                  <button
                    className="btn btn-outline-danger py-3 rounded-3"
                    onClick={handleDeletePost}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              {/* Trade Location Map - Below Action Buttons */}
              {post.tradeLocation && (
                <div className="mt-4">
                  <MapInlineView address={post.tradeLocation} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="row  g-4" style={{ marginTop: "-200px" }}>
          {/* Comments Section */}
          <div className="col-12">
            <h4 className="fw-bold text-dark mb-4">
              <i className="bi bi-chat-dots me-2"></i>
              Bình luận {post.totalComments > 0 && `(${post.totalComments})`}
            </h4>

            <div className="comments-container">
              {/* Comment Input */}
              {user && (
                <form onSubmit={handleSubmitComment} className="mb-4">
                  <div className="d-flex align-items-start gap-3">
                    {/* User Avatar */}
                    <div
                      className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: "40px", height: "40px" }}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || user.name}
                          className="rounded-circle"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i className="bi bi-person-fill text-white"></i>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          placeholder="Tên"
                          value={user.fullName || user.name || ""}
                          disabled
                          style={{ fontSize: "0.9rem" }}
                        />
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Bình luận..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          style={{ fontSize: "0.9rem" }}
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-end gap-2 mt-2">
                        <button
                          type="submit"
                          className="comment-submit-btn"
                          title="Gửi bình luận"
                          disabled={!commentText.trim()}
                        >
                          <i className="bi bi-send-fill me-2"></i>
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="comments-list">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div
                        className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => {
                          const commentUserId =
                            comment.userId ||
                            comment.userID ||
                            comment.user?.id ||
                            comment.user_id;
                          if (commentUserId) {
                            navigate(`/profile/${commentUserId}`);
                          }
                        }}
                        role="button"
                      >
                        {comment.avatarUrl ? (
                          <img
                            src={comment.avatarUrl}
                            alt={comment.fullName}
                            className="rounded-circle"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i className="bi bi-person-fill text-white"></i>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong
                            className="text-dark small"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              const commentUserId =
                                comment.userId ||
                                comment.userID ||
                                comment.user?.id ||
                                comment.user_id;
                              if (commentUserId) {
                                navigate(`/profile/${commentUserId}`);
                              }
                            }}
                          >
                            {comment.fullName || "Người dùng"}
                          </strong>
                          <small className="text-muted">
                            {formatDate(comment.commentDate)}
                          </small>
                        </div>
                        <p
                          className="mb-0 text-dark"
                          style={{ fontSize: "0.9rem", lineHeight: "1.6" }}
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-chat-dots fs-3 d-block mb-2"></i>
                    <p className="mb-0">Chưa có bình luận nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-5 mb-4">
          <h4 className="fw-bold text-dark mb-4">
            <i className="bi bi-grid me-2"></i>
            Sản phẩm tương tự
          </h4>
          {loadingSimilar ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="text-muted mt-3 mb-0">
                Đang tải bài đăng tương tự...
              </p>
            </div>
          ) : similarPosts && similarPosts.length > 0 ? (
            <div className="similar-products-grid">
              {similarPosts.map((item) => (
                <div
                  key={item.id}
                  className="similar-product-card"
                  onClick={() => navigate(`/post/${item.id}`)}
                >
                  <div className="similar-product-image-wrapper">
                    <img
                      src={
                        item.imageUrls?.[0] ||
                        item.imageUrl ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={item.title}
                      className="similar-product-image"
                    />
                  </div>
                  <div className="similar-product-content">
                    <h6 className="similar-product-title">{item.title}</h6>
                    <p className="similar-product-meta">
                      <span>
                        <i className="bi bi-person me-1"></i>
                        {item.username}
                      </span>
                      <span className="similar-product-likes">
                        <i className="bi bi-heart-fill"></i>
                        <span>{item.totalLikes || 0}</span>
                      </span>
                    </p>
                    {item.distance !== undefined && (
                      <p className="similar-product-distance">
                        <i className="bi bi-geo-alt"></i>
                        <span>{item.distance} km</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="bi bi-grid fs-3 d-block mb-2"></i>
              <p className="mb-0">Không có sản phẩm tương tự</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div
          className="modal fade show postdetail-modal-overlay"
          onClick={() => setShowStatusModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content shadow-lg postdetail-modal-content">
              <div className="modal-header postdetail-modal-header">
                <div>
                  <h5 className="modal-title postdetail-modal-title">
                    Cập nhật trạng thái
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>

              <div className="modal-body postdetail-modal-body">
                <p className="mb-3 text-muted">
                  Trạng thái hiện tại:{" "}
                  <strong className={getStatusColor(post.postStatus)}>
                    {getStatusLabel(post.postStatus)}
                  </strong>
                </p>

                <div className="mb-3">
                  <label className="form-label fw-semibold mb-2">
                    Thay đổi trạng thái
                  </label>
                  <div className="d-flex flex-column gap-2">
                    {getAvailableStatuses().map((status) => (
                      <button
                        key={status.value}
                        className="btn w-100 text-start status-btn"
                        onClick={() => handleUpdateStatus(status.value)}
                        disabled={updatingStatus}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span>{status.label}</span>
                          <i className="bi bi-chevron-right"></i>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer postdetail-modal-footer">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
