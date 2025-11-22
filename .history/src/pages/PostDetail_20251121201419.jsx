import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPostDetail } from "../service/post/PostService";
import {
  FaRegHeart,
  FaHeart,
  FaPaperPlane,
  FaTag,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaClock,
  FaEllipsisH,
  FaShareAlt,
} from "react-icons/fa";
import "../css/post-detail.css";

const accent = "#2563eb";

const PostDetail = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await getPostDetail(id);

        if (response.code === 1000) {
          setPostData(response.data);
          setComments(response.data.comments || []);
          setLiked(response.data.liked || false);
          setTotalLikes(response.data.totalLikes || 0);
          setActiveImage(0);
        } else {
          setError(response.message || "Không thể tải bài đăng");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching post detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      userId: 0,
      fullName: "Bạn",
      avatarUrl: null,
      content: comment,
      commentDate: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setComment("");
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    setTotalLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderLoading = () => (
    <div className="bg-white min-vh-100">
      <Header />
      <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5">
        <div className="fs-1 mb-3">⏳</div>
        <p className="fw-medium mb-0">Đang tải thông tin bài đăng...</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="bg-white min-vh-100">
      <Header />
      <div className="d-flex flex-column align-items-center justify-content-center text-danger py-5">
        <div className="fs-1 mb-3">⚠️</div>
        <p className="fw-medium mb-0">{error}</p>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (error || !postData) return renderError();

  const images = Array.isArray(postData.imageUrls) ? postData.imageUrls : [];

  return (
    <div className="post-detail-page bg-light min-vh-100">
      <Header />
      <div className="container py-4 py-md-5 post-detail-wrapper">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="detail-media  border-0 shadow-sm p-3">
              <div className="media-layout">
                <div className="thumbnail-stack">
                  {images.length ? (
                    images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`thumb-tile ${
                          idx === activeImage ? "thumb-selected" : ""
                        }`}
                        onClick={() => setActiveImage(idx)}
                      >
                        <img src={img} alt={`Ảnh ${idx + 1}`} />
                      </button>
                    ))
                  ) : (
                    <div className="thumb-empty text-muted">Không có ảnh</div>
                  )}
                </div>
                <div className="main-media ratio ratio-4x3 rounded-4 bg-light overflow-hidden">
                  {images.length ? (
                    <img
                      src={images[activeImage] || images[0]}
                      alt={postData.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                      <FaBoxOpen className="fs-1 mb-2" />
                      <p className="mb-0">Chưa có hình ảnh</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=" border-0 shadow-sm media-meta mt-3">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
                  <div className="text-muted fw-medium d-flex align-items-center gap-2">
                    <FaCalendarAlt /> Đăng ngày {formatDate(postData.postDate)}
                  </div>
                  <button
                    className={`like-button ${
                      liked ? "like-button-active" : ""
                    }`}
                    onClick={handleLike}
                  >
                    {liked ? <FaHeart /> : <FaRegHeart />}
                    <span>{totalLikes}</span>
                  </button>
                </div>

                <div className="author-card">
                  <Avatar name={postData.username} />
                  <div>
                    <p className="mb-1 fw-semibold">
                      {postData.username || "Ẩn danh"}
                    </p>
                    <small className="text-muted d-flex align-items-center gap-2">
                      <FaMapMarkerAlt />
                      {postData.tradeLocation || "Chưa cập nhật"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className=" border-0 shadow-sm detail-card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="category-label text-uppercase mb-1">
                      {postData.category?.name || "Chưa phân loại"}
                    </p>
                    <h1 className="detail-title">{postData.title}</h1>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button className="trade-button">Bắt đầu trao đổi</button>
                    <button className="icon-button">
                      <FaShareAlt />
                    </button>
                    <div className="position-relative" ref={actionsRef}>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => setShowActions((prev) => !prev)}
                        aria-label="Tùy chọn bài đăng"
                      >
                        <FaEllipsisH />
                      </button>
                      {showActions && (
                        <div className="action-menu shadow-sm rounded-4">
                          <button className="action-item">
                            Đánh dấu đang trao đổi
                          </button>
                          <button className="action-item text-danger">
                            Xóa bài đăng
                          </button>
                          <button className="action-item">
                            Chỉnh sửa bài đăng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h6>Mô tả</h6>
                  <p>
                    {postData.description ||
                      "Người đăng chưa cập nhật mô tả chi tiết."}
                  </p>
                </div>

                <div className="detail-grid">
                  <div>
                    <h6>Danh mục</h6>
                    <p>{postData.category?.name || "Chưa phân loại"}</p>
                  </div>
                  <div>
                    <h6>Tình trạng</h6>
                    <p>{postData.itemCondition || "Chưa xác định"}</p>
                  </div>
                  <div>
                    <h6>Điểm gặp mặt</h6>
                    <p>{postData.tradeLocation || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>
            </div>

            <section className="card border-0 shadow-sm comments-card">
              <div className="card-body">
                <h5 className="mb-4">Bình luận</h5>
                <div className="d-flex gap-3 mb-3 flex-wrap">
                  <div className="flex-shrink-0">
                    <Avatar name="Bạn" minified />
                  </div>
                  <div className="flex-grow-1">
                    <textarea
                      className="form-control rounded-4 border-0 bg-light p-3"
                      rows={3}
                      placeholder="Hãy để lại câu hỏi hoặc lời nhắn..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-primary rounded-pill d-inline-flex align-items-center gap-2 px-4"
                        onClick={handleComment}
                      >
                        <FaPaperPlane /> Gửi bình luận
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {comments.length ? (
                    comments.map((c) => <CommentCard key={c.id} comment={c} />)
                  ) : (
                    <div className="text-center text-muted py-4">
                      Chưa có bình luận nào
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Avatar = ({ name, minified = false }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "U";
  const size = minified ? 46 : 56;

  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      }}
    >
      {initial}
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="d-flex align-items-center gap-2 mb-3">
    <div
      className="rounded-pill bg-primary-subtle"
      style={{ width: 10, height: 10 }}
    />
    <h5 className="mb-0 text-uppercase text-muted fw-semibold">{title}</h5>
  </div>
);

const CommentCard = ({ comment }) => (
  <div className="card border-0 shadow-sm rounded-4">
    <div className="card-body d-flex gap-3">
      <Avatar name={comment.fullName} minified />
      <div>
        <div className="d-flex align-items-center gap-2">
          <p className="fw-semibold mb-0">{comment.fullName}</p>
          <small className="text-muted">
            {new Date(comment.commentDate).toLocaleDateString("vi-VN")}
          </small>
        </div>
        <p className="mb-0 text-body">{comment.content}</p>
      </div>
    </div>
  </div>
);

export default PostDetail;
