import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getCategoryList } from "../service/CategoryService";
import { getAllPosts } from "../service/PostService";
import "../css/Explore.css";

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
  const [tempDistance, setTempDistance] = useState(100);
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
              <div className="explore-search-wrapper">
                <input
                  type="text"
                  className="form-control form-control-lg bg-white border-0 rounded-pill px-4 py-3 shadow-sm explore-search-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <button
                  className="btn btn-link explore-search-btn"
                  type="button"
                >
                  <i className="bi bi-search fs-4 text-muted"></i>
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div
              className="d-flex align-items-center  gap-3 position-relative"
              style={{ marginLeft: "200px" }}
            >
              <button
                className="btn btn-outline-secondary rounded-circle p-2 explore-filter-btn"
                onClick={() => {
                  setShowDistanceFilter(!showDistanceFilter);
                  setTempDistance(maxDistance);
                }}
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
                    setTempDistance(maxDistance);
                  }}
                >
                  {maxDistance === 100 ? "Khoảng cách" : `${maxDistance} km`}
                </button>
              </div>

              {/* Distance Filter Modal */}
              {showDistanceFilter && (
                <div
                  className="explore-distance-modal"
                  onMouseLeave={() => {
                    setShowDistanceFilter(false);
                    setTempDistance(maxDistance);
                  }}
                >
                  {/* Header */}
                  <div className="explore-distance-header">
                    <div className="explore-distance-label">
                      Chọn khoảng cách bạn muốn
                    </div>
                    <span className="explore-distance-badge">
                      {tempDistance} km
                    </span>
                  </div>

                  {/* Slider */}
                  <div className="mt-3 mb-3">
                    <input
                      type="range"
                      className="form-range explore-distance-slider"
                      min="0"
                      max="100"
                      step="1"
                      value={tempDistance}
                      onChange={(e) => {
                        setTempDistance(Number(e.target.value));
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
                      className="btn btn-sm btn-outline-secondary explore-distance-btn-reset"
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
                      className="btn btn-sm btn-secondary explore-distance-btn-apply"
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
            <h3 className="explore-topics-title">Chủ đề</h3>
            <div className="topic-scroll">
              <div className="d-flex gap-3">
                {loadingCategories ? (
                  <div className="explore-loading">Đang tải danh mục...</div>
                ) : (
                  categories.map((topic) => (
                    <div
                      key={topic.id}
                      className="explore-topic-item"
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="explore-topic-image-wrapper">
                        {topic.image && topic.image.startsWith("https://") ? (
                          <img
                            src={topic.image}
                            alt={topic.name}
                            className="explore-topic-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}
                      </div>
                      <small
                        className={`explore-topic-name ${
                          selectedCategoryId === topic.id ? "active" : ""
                        }`}
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
                <span className="badge rounded-pill explore-category-badge">
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
                <div className="explore-loading">Đang tải bài đăng...</div>
              ) : posts.length === 0 ? (
                <div className="explore-empty">Không có bài đăng nào</div>
              ) : (
                posts.map((card) => (
                  <div
                    key={card.id}
                    className="explore-card"
                    onClick={() => handlePostClick(card.id)}
                  >
                    <div className="card-body p-0">
                      {/* Image */}
                      <div className="explore-card-image-wrapper">
                        {card.imageUrl ? (
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="explore-card-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                              const fallback = e.target.nextElementSibling;
                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : (
                          <div className="explore-card-image-placeholder">
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="explore-card-content">
                        <h6 className="explore-card-title">{card.title}</h6>
                        <p className="explore-card-meta">
                          <span>
                            <i className="bi bi-person me-1"></i>
                            {card.username}
                          </span>
                          <span className="explore-card-likes">
                            <i className="bi bi-heart-fill"></i>
                            <span>{card.totalLikes || 0}</span>
                          </span>
                        </p>
                        {card.distance !== undefined &&
                          card.distance !== null && (
                            <p className="explore-card-distance">
                              <i className="bi bi-geo-alt"></i>
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
                    className="explore-page-btn"
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
                        className={`explore-page-number ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
                <li className="page-item">
                  <button
                    className="explore-page-btn"
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
