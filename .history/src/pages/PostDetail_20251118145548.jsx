import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getPostDetail } from "../service/post/PostService";
import {
  FaRegHeart,
  FaHeart,
  FaPaperPlane,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaShareAlt,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaClock,
} from "react-icons/fa";

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
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap align-items-start gap-3 gap-md-4 mb-4">
          <div className="flex-grow-1">
            <span className="badge text-bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2">
              <FaTag className="me-2" />
              {postData.category?.name || "Chưa phân loại"}
            </span>
            <h1 className="display-6 fw-bold mb-3">{postData.title}</h1>
            <div className="d-flex flex-wrap gap-3 text-muted">
              <span className="d-flex align-items-center gap-2">
                <FaCalendarAlt /> {formatDate(postData.postDate)}
              </span>
              <span className="d-flex align-items-center gap-2">
                <FaUser /> {postData.username || "Ẩn danh"}
              </span>
              <span className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt /> {postData.tradeLocation || "Chưa xác định"}
              </span>
            </div>
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2"
              title="Chia sẻ bài đăng"
            >
              <FaShareAlt /> Chia sẻ
            </button>
            <button
              className={`btn rounded-pill d-flex align-items-center gap-2 ${
                liked ? "btn-danger text-white" : "btn-outline-danger"
              }`}
              onClick={handleLike}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{totalLikes}</span>
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="ratio ratio-16x9 rounded-4 bg-light overflow-hidden">
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
                <div className="d-flex gap-3 overflow-auto mt-3">
                  {images.length ? (
                    images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`border-0 bg-transparent p-0 rounded-3 ${
                          idx === activeImage ? "shadow-lg" : "shadow-sm"
                        }`}
                        style={{
                          outline:
                            idx === activeImage
                              ? `3px solid ${accent}`
                              : "none",
                        }}
                        onClick={() => setActiveImage(idx)}
                      >
                        <img
                          src={img}
                          alt={`Ảnh ${idx + 1}`}
                          className="rounded-3"
                          style={{
                            width: "110px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))
                  ) : (
                    <span className="text-muted">Không có hình ảnh khác</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column gap-4">
                <div>
                  <p className="text-uppercase text-muted fw-semibold mb-2">
                    Tổng quan
                  </p>
                  <h4 className="fw-bold mb-0">{postData.title}</h4>
                  <small className="text-muted">
                    Được đăng bởi {postData.username || "Ẩn danh"}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <Avatar name={postData.username} />
                  <div>
                    <p className="mb-1 fw-semibold">
                      {postData.username || "Ẩn danh"}
                    </p>
                    <small className="d-flex align-items-center gap-2 text-muted">
                      <FaClock /> Đăng ngày {formatDate(postData.postDate)}
                    </small>
                  </div>
                </div>

                <div className="row g-3">
                  <SummaryItem
                    label="Tình trạng"
                    value={postData.itemCondition || "Chưa xác định"}
                    icon={<FaBoxOpen />}
                  />
                  <SummaryItem
                    label="Điểm trao đổi"
                    value={postData.tradeLocation || "Chưa cập nhật"}
                    icon={<FaMapMarkerAlt />}
                  />
                </div>

                <div>
                  <p className="text-uppercase text-muted fw-semibold mb-2">
                    Mô tả nhanh
                  </p>
                  <p className="mb-0 text-body">
                    {postData.description ||
                      "Người đăng chưa cập nhật mô tả chi tiết."}
                  </p>
                </div>

                <div className="mt-auto d-grid gap-2">
                  <button className="btn btn-primary btn-lg rounded-pill">
                    Bắt đầu trao đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1 mt-md-4">
          <div className="col-lg-8">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <SectionTitle title="Chi tiết sản phẩm" />
                <p className="mb-0 fs-5 text-body">
                  {postData.description ||
                    "Người đăng chưa cập nhật mô tả chi tiết."}
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <SectionTitle title="Bình luận" />
                <div className="d-flex gap-3 mb-3">
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

          <div className="col-lg-4">
            <section className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <SectionTitle title="Thông tin trao đổi" />
                <ul className="list-unstyled mb-0">
                  <InfoRow
                    label="Trạng thái"
                    value={postData.itemCondition || "Chưa xác định"}
                  />
                  <InfoRow
                    label="Địa điểm"
                    value={postData.tradeLocation || "Chưa cập nhật"}
                  />
                  <InfoRow
                    label="Ngày đăng"
                    value={formatDate(postData.postDate)}
                  />
                  <InfoRow
                    label="Danh mục"
                    value={postData.category?.name || "Chưa phân loại"}
                  />
                </ul>
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

const SummaryItem = ({ label, value, icon }) => (
  <div className="col-12">
    <div className="rounded-4 border bg-light px-3 py-3 d-flex align-items-start gap-3">
      <div className="text-primary fs-4">{icon}</div>
      <div>
        <small className="text-muted text-uppercase fw-semibold">{label}</small>
        <p className="mb-0 fw-semibold">{value}</p>
      </div>
    </div>
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

const InfoRow = ({ label, value }) => (
  <li className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold text-end">{value}</span>
  </li>
);

export default PostDetail;
