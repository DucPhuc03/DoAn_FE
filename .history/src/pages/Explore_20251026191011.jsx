import React, { useState } from "react";
import Header from "../components/Header";

const Explore = () => {
  const [selectedCard, setSelectedCard] = useState(0);
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
      distance: "2.5 km",
      image: "📱",
    },
    {
      id: 2,
      title: "Áo khoác mùa đông",
      poster: "Trần Thị B",
      distance: "1.2 km",
      image: "🧥",
    },
    {
      id: 3,
      title: "Sách lập trình React",
      poster: "Lê Văn C",
      distance: "3.8 km",
      image: "📖",
    },
    {
      id: 4,
      title: "Bàn làm việc gỗ",
      poster: "Phạm Thị D",
      distance: "5.1 km",
      image: "🪑",
    },
    {
      id: 5,
      title: "Giày thể thao Nike",
      poster: "Hoàng Văn E",
      distance: "2.3 km",
      image: "👟",
    },
    {
      id: 6,
      title: "Xe đạp địa hình",
      poster: "Vũ Thị F",
      distance: "4.7 km",
      image: "🚴",
    },
  ];

  return (
    <div className="container-fluid py-4 explore-container">
      <Header></Header>
      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-12">
          {/* Search Bar */}
          <div className="position-relative mb-3 d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: "600px" }}>
              <input
                type="text"
                className="form-control form-control-lg bg-light border-0 rounded-pill px-4 py-3"
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
                  className="flex-shrink-0 text-center"
                  style={{ minWidth: "120px" }}
                >
                  <div
                    className="bg-light rounded-3 p-3 mb-2 d-flex align-items-center justify-content-center"
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
            {contentCards.map((card, index) => (
              <div
                key={card.id}
                className={`card border-2 cursor-pointer transition-all ${
                  selectedCard === index
                    ? "border-primary shadow-lg"
                    : "border-light hover-shadow"
                }`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "280px",
                  minHeight: "320px",
                }}
                onClick={() => setSelectedCard(index)}
              >
                <div className="card-body p-0">
                  {/* Image Placeholder */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="fs-1 text-muted">{card.image}</span>
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                    <h5 className="card-title fw-bold mb-2">{card.title}</h5>
                    <p className="card-text text-muted mb-1">
                      <i className="bi bi-person me-1"></i>
                      {card.poster}
                    </p>
                    <p className="card-text text-muted mb-0">
                      <i className="bi bi-geo-alt me-1"></i>
                      {card.distance}
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
                      : "bg-light text-dark"
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
                      : "bg-light text-dark"
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
                      : "bg-light text-dark"
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
  );
};

export default Explore;
