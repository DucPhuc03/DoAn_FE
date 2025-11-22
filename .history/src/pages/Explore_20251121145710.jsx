import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Explore = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  const navigate = useNavigate();

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
      image: "📱",
      categoryId: 1,
      createdAt: "2025-11-01",
    },
    {
      id: 2,
      title: "Áo khoác mùa đông",
      poster: "Trần Thị B",
      image: "🧥",
      categoryId: 2,
      createdAt: "2025-10-15",
    },
    {
      id: 3,
      title: "Sách lập trình React",
      poster: "Lê Văn C",
      image: "📖",
      categoryId: 3,
      createdAt: "2025-09-20",
    },
    {
      id: 4,
      title: "Bàn làm việc gỗ",
      poster: "Phạm Thị D",
      image: "🪑",
      categoryId: 5,
      createdAt: "2025-08-10",
    },
    {
      id: 5,
      title: "Giày thể thao Nike",
      poster: "Hoàng Văn E",
      image: "👟",
      categoryId: 4,
      createdAt: "2025-11-10",
    },
    {
      id: 6,
      title: "Xe đạp địa hình",
      poster: "Vũ Thị F",
      image: "🚴",
      categoryId: 6,
      createdAt: "2025-07-05",
    },
  ];

  const filteredCards = useMemo(() => {
    const now = new Date();

    const isWithinRange = (createdAt) => {
      if (selectedDateRange === "all") return true;
      const createdDate = new Date(createdAt);
      const diffInMs = now - createdDate;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      switch (selectedDateRange) {
        case "1m":
          return diffInDays <= 30;
        case "6m":
          return diffInDays <= 180;
        case "1y":
          return diffInDays <= 365;
        default:
          return true;
      }
    };

    return contentCards.filter((card) => {
      const byCategory =
        selectedCategory === "all" ||
        String(card.categoryId) === String(selectedCategory);

      const byDate = isWithinRange(card.createdAt);

      return byCategory && byDate;
    });
  }, [contentCards, selectedCategory, selectedDateRange]);

  return (
    <div className="div">
      <Header />
      <div className="container-fluid py-4 explore-container">
        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-12">
            {/* Search Bar + Filter */}
            <div className="d-flex justify-content-center mb-3">
              <div
                className="d-flex align-items-center gap-3 w-100"
                style={{ maxWidth: "700px" }}
              >
                <div className="flex-grow-1 d-flex">
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light border-0 rounded-start-pill px-4 py-3"
                    placeholder="Tìm kiếm sản phẩm..."
                    style={{ fontSize: "1.05rem" }}
                  />
                  <button
                    className="btn btn-secondary rounded-end-pill px-4 d-flex align-items-center justify-content-center"
                    type="button"
                  >
                    <i className="bi bi-search fs-5"></i>
                  </button>
                </div>
                <button
                  className="btn btn-outline-secondary rounded-circle p-3 d-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => setShowFilters(true)}
                  aria-label="Bộ lọc"
                >
                  <i className="bi bi-funnel fs-5"></i>
                </button>
              </div>
            </div>

            {showFilters && (
              <FilterModal
                topics={topics}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={setSelectedDateRange}
                onClose={() => setShowFilters(false)}
                onClear={() => {
                  setSelectedCategory("all");
                  setSelectedDateRange("all");
                }}
              />
            )}
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
                    role="button"
                    onClick={() =>
                      navigate(
                        `/category/${encodeURIComponent(
                          topic.name.toLowerCase()
                        )}`
                      )
                    }
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
              {filteredCards.map((card, index) => (
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
                    minHeight: "260px",
                  }}
                  onClick={() => {
                    setSelectedCard(index);
                    navigate(`/post/${card.id}`);
                  }}
                >
                  <div className="card-body p-0">
                    {/* Image Placeholder */}
                    <div
                      className="bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "150px" }}
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
    </div>
  );
};

export default Explore;

const FilterModal = ({
  topics,
  selectedCategory,
  onCategoryChange,
  selectedDateRange,
  onDateRangeChange,
  onClose,
  onClear,
}) => {
  const dateOptions = [
    { id: "all", label: "Mọi thời gian" },
    { id: "1m", label: "1 tháng" },
    { id: "3m", label: "3 tháng" },
    { id: "6m", label: "6 tháng" },
    { id: "1y", label: "1 năm" },
  ];

  return (
    <div className="filter-backdrop" onClick={onClose}>
      <div
        className="filter-panel"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Bộ lọc</h5>
          <button
            type="button"
            className="btn btn-link text-decoration-none text-muted"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-muted text-uppercase small fw-semibold mb-2">
            Danh mục
          </p>
          <div className="list-group rounded-4 overflow-hidden">
            <button
              className={`list-group-item list-group-item-action py-3 ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => onCategoryChange("all")}
            >
              Tất cả
            </button>
            {topics.map((topic) => (
              <button
                key={topic.id}
                className={`list-group-item list-group-item-action py-3 ${
                  selectedCategory === String(topic.id) ? "active" : ""
                }`}
                onClick={() => onCategoryChange(String(topic.id))}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-muted text-uppercase small fw-semibold mb-2">
            Ngày đăng
          </p>
          <div className="d-flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option.id}
                className={`filter-pill ${
                  selectedDateRange === option.id ? "filter-pill-active" : ""
                }`}
                onClick={() => onDateRangeChange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-link" onClick={onClear}>
            Xóa hết
          </button>
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={onClose}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
