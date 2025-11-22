import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  getPostDetail,
  getPostComments,
  createComment,
} from "../service/post/PostService";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    fetchPostDetail();
  }, [id]);

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
    // TODO: Implement like API call
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
    // Navigate to exchange proposal page or open modal
    console.log("Propose exchange for post:", id);
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
      PENDING: "Chờ trao đổi",
      AVAILABLE: "Chưa trao đổi",
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
      <div className="bg-light min-vh-100">
        <Header />
        <div className="container py-4">
          <div className="text-center py-5">
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
      <div className="bg-light min-vh-100">
        <Header />
        <div className="container py-4">
          <div className="text-center py-5">
            <p className="text-muted">Không tìm thấy bài đăng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container py-4">
        {/* Page Title */}
        <div className="mb-4">
          <h2 className="text-dark fw-bold mb-0">Bài đăng</h2>
        </div>

        {/* Main Content - Two Columns */}
        <div className="row g-4 mb-4">
          {/* Left Column - Image Gallery and Poster Info */}
          <div className="col-lg-6">
            {/* Image Gallery */}
            <div
              className="mb-4 position-relative"
              style={{
                height: "500px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e9ecef",
              }}
            >
              {post.imageUrls && post.imageUrls.length > 0 ? (
                <>
                  <img
                    src={post.imageUrls[currentImageIndex]}
                    alt={`${post.title} - ${currentImageIndex + 1}`}
                    className="w-100 h-100"
                    style={{ objectFit: "contain" }}
                  />
                  {/* Navigation Arrows */}
                  {post.imageUrls.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle shadow-sm"
                        onClick={prevImage}
                        style={{
                          width: "45px",
                          height: "45px",
                          zIndex: 10,
                        }}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle shadow-sm"
                        onClick={nextImage}
                        style={{
                          width: "45px",
                          height: "45px",
                          zIndex: 10,
                        }}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                      {/* Image Indicators */}
                      <div
                        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2"
                        style={{ zIndex: 10 }}
                      >
                        {post.imageUrls.map((_, index) => (
                          <button
                            key={index}
                            className={`btn rounded-circle p-0 ${
                              index === currentImageIndex
                                ? "bg-primary"
                                : "bg-white opacity-75"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                            style={{
                              width: "10px",
                              height: "10px",
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <i
                      className="bi bi-image text-muted"
                      style={{ fontSize: "4rem" }}
                    ></i>
                    <p className="text-muted mt-2">Không có hình ảnh</p>
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
                  style={{ width: "50px", height: "50px" }}
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
                  <p className="mb-0 fw-semibold text-dark">
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
                style={{ fontSize: "1.2rem" }}
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
          <div className="col-lg-6">
            <div className="h-100">
              {/* Title */}
              <h3 className="fw-bold text-dark mb-4">{post.title}</h3>

              {/* Item Details */}
              <div className="mb-4">
                <div className="mb-3">
                  <label className="  fw-bold text-dark d-block mb-1 fw-semibold">
                    Danh mục
                  </label>
                  <p className="mb-0  ">{post.category?.name || "Chưa có"}</p>
                </div>
                <div className="mb-3">
                  <label className=" small d-block mb-1 fw-semibold">
                    Tình trạng
                  </label>
                  <p className="mb-0 fw-medium text-dark">
                    {post.itemCondition || "Chưa có"}
                  </p>
                </div>
                <div className="mb-3">
                  <label className=" small d-block mb-1 fw-semibold">
                    Trạng thái
                  </label>
                  <p
                    className={`mb-0 fw-medium ${getStatusColor(
                      post.postStatus
                    )}`}
                  >
                    {getStatusLabel(post.postStatus)}
                  </p>
                </div>
                {post.tradeLocation && (
                  <div className="mb-3">
                    <label className=" small d-block mb-1 fw-semibold">
                      Địa điểm trao đổi
                    </label>
                    <p className="mb-0 fw-medium text-dark">
                      <i className="bi bi-geo-alt me-1"></i>
                      {post.tradeLocation}
                    </p>
                  </div>
                )}
                <div className="mb-3">
                  <label className=" small d-block mb-1 fw-semibold">
                    Mô tả
                  </label>
                  <p
                    className="mb-0 text-dark"
                    style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}
                  >
                    {post.description || "Chưa có mô tả"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning flex-grow-1 py-3 rounded-3 fw-semibold"
                  onClick={handleProposeExchange}
                  style={{ fontSize: "1rem" }}
                  disabled={post.postStatus === "COMPLETED"}
                >
                  Đề xuất trao đổi
                </button>
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
                    onClick={() => {
                      if (
                        window.confirm("Bạn có chắc muốn xóa bài đăng này?")
                      ) {
                        // TODO: Implement delete
                      }
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-5">
          <h4 className="fw-bold text-dark mb-4">
            Bình luận {post.totalComments > 0 && `(${post.totalComments})`}
          </h4>

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
                  <div className="d-flex align-items-center justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-muted"
                      style={{ fontSize: "1.2rem" }}
                      title="Emoji"
                    >
                      <i className="bi bi-emoji-smile"></i>
                    </button>
                    <button
                      type="submit"
                      className="btn btn-link p-0 text-primary"
                      style={{ fontSize: "1.2rem" }}
                      title="Gửi bình luận"
                      disabled={!commentText.trim()}
                    >
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="mt-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="d-flex gap-3 mb-4 pb-3 border-bottom"
                >
                  <div
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "40px", height: "40px" }}
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
                      <strong className="text-dark small">
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
  );
};

export default PostDetail;
