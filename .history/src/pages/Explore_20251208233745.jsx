import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getCategoryList } from "../service/CategoryService";
import { getAllPosts } from "../service/PostService";

const Explore = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [maxDistance, setMaxDistance] = useState(100);
  const [tempDistance, setTempDistance] = useState(100); // Giá trị tạm khi đang kéo
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategoryList();
        let data = [];
        if (response?.data) {
          data = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          data = response;
        }
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const categoryName = selectedCategory?.name || "";
        const title = searchTerm || "";
        const response = await getAllPosts(
          title,
          categoryName,
          maxDistance,
          currentPage
        );

        let postsData = [];
        let meta = null;
        if (response?.data) {
          postsData = Array.isArray(response.data) ? response.data : [];
          meta = response.metaData || null;
        } else if (Array.isArray(response)) {
          postsData = response;
        }

        setPosts(postsData);
        if (meta?.totalPages) {
          setTotalPages(meta.totalPages);
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [currentPage, selectedCategory, searchTerm, maxDistance]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleTopicClick = (categoryId) => {
    setSelectedCategoryId(
      categoryId === selectedCategoryId ? null : categoryId
    );
    setCurrentPage(1);
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
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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
            <div className="d-flex align-items-center justify-content-center gap-3 position-relative">
              <button
                className="btn btn-outline-secondary rounded-circle p-2"
                onClick={() => {
                  setShowDistanceFilter(!showDistanceFilter);
                  setTempDistance(maxDistance); // Đồng bộ giá trị khi mở modal
                }}
                style={{ position: "relative" }}
              >
                <i className="bi bi-funnel fs-5"></i>
              </button>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary rounded-pill px-3 py-2">
                  Địa điểm
                </button>
                <button
                  className="btn btn-outline-secondary rounded-pill px-3 py-2"
                  onClick={() => {
                    setShowDistanceFilter(!showDistanceFilter);
                    setTempDistance(maxDistance); // Đồng bộ giá trị khi mở modal
                  }}
                >
                  {maxDistance === 100 ? "Khoảng cách" : `${maxDistance} km`}
                </button>
              </div>

              {/* Distance Filter Modal */}
              {showDistanceFilter && (
                <div
                  className="position-absolute bg-white rounded-4 shadow-lg"
                  style={{
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: "12px",
                    minWidth: "320px",
                    zIndex: 1000,
                    border: "1px solid #e5e7eb",
                    padding: "16px 18px",
                  }}
                  onMouseLeave={() => {
                    setShowDistanceFilter(false);
                    setTempDistance(maxDistance); // Reset về giá trị hiện tại khi đóng
                  }}
                >
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,

                          letterSpacing: "0.04em",
                          color: "#6b7280",
                        }}
                      >
                        Chọn khoảng cách bạn muốn tìm kiếm
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        backgroundColor: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tempDistance} km
                    </span>
                  </div>

                  {/* Slider */}
                  <div className="mt-3 mb-3">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="100"
                      step="1"
                      value={tempDistance}
                      onChange={(e) => {
                        setTempDistance(Number(e.target.value));
                      }}
                      style={{
                        width: "100%",
                        height: "6px",
                        cursor: "pointer",
                        accentColor: "#2563eb", // màu primary cho thanh trượt
                      }}
                    />
                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">0 km</small>
                      <small className="text-muted">100 km</small>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{
                        fontSize: 13,
                        borderRadius: 999,
                        padding: "6px 14px",
                      }}
                      onClick={() => {
                        setMaxDistance(100);
                        setTempDistance(100);
                        setCurrentPage(1);
                        setShowDistanceFilter(false);
                      }}
                    >
                      Đặt lại
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{
                        fontSize: 13,
                        borderRadius: 999,
                        padding: "6px 16px",
                      }}
                      onClick={() => {
                        setMaxDistance(tempDistance);
                        setCurrentPage(1);
                        setShowDistanceFilter(false);
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="fw-bold mb-3 text-center">Chủ đề</h3>
            <div className="topic-scroll">
              <div className="d-flex gap-3">
                {loadingCategories ? (
                  <div className="text-center text-muted w-100 py-3">
                    Đang tải danh mục...
                  </div>
                ) : (
                  categories.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex-shrink-0 text-center cursor-pointer"
                      style={{ minWidth: "120px" }}
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div
                        className="bg-white rounded-3 mb-2 d-flex align-items-center justify-content-center shadow-sm hover-shadow transition-all overflow-hidden position-relative"
                        style={{ height: "80px", width: "120px" }}
                      >
                        {topic.image && topic.image.startsWith("https://") ? (
                          <img
                            src={topic.image}
                            alt={topic.name}
                            className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
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
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                      </div>
                      <small
                        className="fw-bold"
                        style={{
                          color:
                            selectedCategoryId === topic.id
                              ? "#2563eb"
                              : "#111827",
                        }}
                      >
                        {topic.name}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
            {selectedCategory && (
              <div className="text-center mt-2">
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: 600,
                    padding: "8px 16px",
                  }}
                >
                  Đang xem danh mục: {selectedCategory.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="content-grid">
              {loadingPosts ? (
                <div className="text-center text-muted w-100 py-4">
                  Đang tải bài đăng...
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center text-muted w-100 py-4">
                  Không có bài đăng nào
                </div>
              ) : (
                posts.map((card) => (
                  <div
                    key={card.id}
                    className="card border-0 mb-4 cursor-pointer transition-all shadow-sm hover-shadow bg-white"
                    onClick={() => handlePostClick(card.id)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="card-body p-0">
                      {/* Image */}
                      <div
                        className="overflow-hidden position-relative"
                        style={{
                          height: "150px",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fallback = e.target.nextElementSibling;
                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "#ffffff",
                            }}
                          >
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-2">
                        <h6
                          className="card-title fw-bold mb-1 text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {card.title}
                        </h6>
                        <p className="card-text text-muted mb-1 small d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-person me-1"></i>
                            {card.username}
                          </span>
                          <span className="d-flex align-items-center gap-1">
                            <i
                              className="bi bi-heart-fill"
                              style={{ color: "#ef4444", fontSize: "0.8rem" }}
                            ></i>
                            <span>{card.totalLikes || 0}</span>
                          </span>
                        </p>
                        {card.distance !== undefined &&
                          card.distance !== null && (
                            <p className="card-text text-muted mb-0 small d-flex align-items-center">
                              <i
                                className="bi bi-geo-alt me-1"
                                style={{ fontSize: "0.75rem" }}
                              ></i>
                              <span>{card.distance} km</span>
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (page) => (
                    <li className="page-item" key={page}>
                      <button
                        className={`page-link border-0 rounded-circle mx-1 ${
                          currentPage === page
                            ? "bg-primary text-white"
                            : "bg-white text-dark"
                        }`}
                        onClick={() => setCurrentPage(page)}
                        style={{ width: "40px", height: "40px" }}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
                <li className="page-item">
                  <button
                    className="page-link border-0 bg-transparent text-dark"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
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
