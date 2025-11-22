import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Explore = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data for topics
  const topics = [
    { id: 1, name: "Điện tử", image: "📱" },
    { id: 2, name: "Thời trang", image: "👕" },
    { id: 3, name: "Sách", image: "📚" },
    { id: 4, name: "Thể thao", image: "⚽" },
    { id: 5, name: "Nội thất", image: "🪑" },
    { id: 6, name: "Xe cộ", image: "🚗" },
  ];

  // Sample data for content cards
  const contentCards = [
    {
      id: 1,
      title: "iPhone 13 Pro Max",
      poster: "Nguyễn Văn A",
      image: "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/sach.webp",
    },
    {
      id: 2,
      title: "Áo khoác mùa đông",
      poster: "Trần Thị B",
      image:
        "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/daychuyen.webp",
    },
    {
      id: 3,
      title: "Sách lập trình React",
      poster: "Lê Văn C",
      image: "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/ao.webp",
    },
    {
      id: 4,
      title: "Bàn làm việc gỗ",
      poster: "Phạm Thị D",
      image:
        "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/dovat.webp",
    },
    {
      id: 5,
      title: "Giày thể thao Nike",
      poster: "Hoàng Văn E",
      image: "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/giay.webp",
    },
    {
      id: 6,
      title: "Xe đạp địa hình",
      poster: "Vũ Thị F",
      image: "https://traodoido.s3.ap-southeast-1.amazonaws.com/post/coc.webp",
    },
    {
      id: 7,
      title: "Laptop Dell XPS",
      poster: "Nguyễn Thị G",
      image: "💻",
    },
    {
      id: 8,
      title: "Tai nghe AirPods",
      poster: "Trần Văn H",
      image: "🎧",
    },
    {
      id: 9,
      title: "Đồng hồ thông minh",
      poster: "Lê Thị I",
      image: "⌚",
    },
    {
      id: 10,
      title: "Máy ảnh Canon",
      poster: "Phạm Văn J",
      image: "📷",
    },
    {
      id: 11,
      title: "Balo du lịch",
      poster: "Hoàng Thị K",
      image: "🎒",
    },
    {
      id: 12,
      title: "Bàn phím cơ",
      poster: "Vũ Văn L",
      image: "⌨️",
    },
  ];

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleTopicClick = (topicName) => {
    const encodedName = encodeURIComponent(
      topicName.toLowerCase().replace(/\s+/g, "-")
    );
    navigate(`/category/${encodedName}`);
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container-fluid py-4 explore-container">
        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-12">
            {/* Search Bar */}
            <div className="position-relative mb-3 d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: "600px" }}>
                <input
                  type="text"
                  className="form-control form-control-lg bg-white border-0 rounded-pill px-4 py-3 shadow-sm"
                  placeholder="Tìm kiếm sản phẩm..."
                  style={{ fontSize: "1.1rem" }}
                />
                <button
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-3 p-0"
                  type="button"
                >
                  <i className="bi bi-search fs-4 text-muted"></i>
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="d-flex align-items-center justify-content-center gap-3">
              <button className="btn btn-outline-secondary rounded-circle p-2">
                <i className="bi bi-funnel fs-5"></i>
              </button>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary rounded-pill px-3 py-2">
                  Địa điểm
                </button>
                <button className="btn btn-outline-secondary rounded-pill px-3 py-2">
                  Khoảng cách
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="fw-bold mb-3 text-center">Chủ đề</h3>
            <div className="topic-scroll">
              <div className="d-flex gap-3">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex-shrink-0 text-center cursor-pointer"
                    style={{ minWidth: "120px" }}
                    onClick={() => handleTopicClick(topic.name)}
                  >
                    <div
                      className="bg-white rounded-3 p-3 mb-2 d-flex align-items-center justify-content-center shadow-sm hover-shadow transition-all"
                      style={{ height: "80px", width: "120px" }}
                    >
                      <span className="fs-1">{topic.image}</span>
                    </div>
                    <small className="text-muted fw-medium">{topic.name}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="content-grid">
              {contentCards.map((card) => (
                <div
                  key={card.id}
                  className="card border-0 mb-4 cursor-pointer transition-all shadow-sm hover-shadow bg-white"
                  onClick={() => handlePostClick(card.id)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div className="card-body p-0">
                    {/* Image Placeholder */}
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "150px" }}
                    >
                      <span className="fs-2 text-muted">{card.image}</span>
                    </div>

                    {/* Card Content */}
                    <div className="p-2">
                      <h6
                        className="card-title fw-bold mb-1 text-truncate"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {card.title}
                      </h6>
                      <p className="card-text text-muted mb-0 small">
                        <i className="bi bi-person me-1"></i>
                        {card.poster}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="row">
          <div className="col-12">
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <button
                    className="page-link border-0 bg-transparent text-dark"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link border-0 rounded-circle mx-1 ${
                      currentPage === 1
                        ? "bg-primary text-white"
                        : "bg-white text-dark"
                    }`}
                    onClick={() => setCurrentPage(1)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    1
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link border-0 rounded-circle mx-1 ${
                      currentPage === 2
                        ? "bg-primary text-white"
                        : "bg-white text-dark"
                    }`}
                    onClick={() => setCurrentPage(2)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    2
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className={`page-link border-0 rounded-circle mx-1 ${
                      currentPage === 3
                        ? "bg-primary text-white"
                        : "bg-white text-dark"
                    }`}
                    onClick={() => setCurrentPage(3)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    3
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link border-0 bg-transparent text-dark"
                    onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                    disabled={currentPage === 3}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
