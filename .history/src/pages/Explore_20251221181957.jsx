import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getCategoryList } from "../service/CategoryService";
import { getAllPosts, getPostRecommend } from "../service/PostService";
import "../css/Explore.css";

const Explore = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [maxDistance, setMaxDistance] = useState(100);
  const [tempDistance, setTempDistance] = useState(100);
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState(null); // null, 'week', 'month', 'year'
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

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

        // Filter posts by date if dateFilter is set
        let filteredPosts = postsData;
        if (dateFilter) {
          const now = new Date();
          now.setHours(0, 0, 0, 0); // Set to start of today
          let cutoffDate = new Date();

          switch (dateFilter) {
            case "week":
              cutoffDate = new Date(now);
              cutoffDate.setDate(now.getDate() - 7);
              break;
            case "month":
              cutoffDate = new Date(now);
              cutoffDate.setMonth(now.getMonth() - 1);
              break;
            case "year":
              cutoffDate = new Date(now);
              cutoffDate.setFullYear(now.getFullYear() - 1);
              break;
            default:
              cutoffDate = null;
          }

          if (cutoffDate) {
            cutoffDate.setHours(0, 0, 0, 0); // Set to start of cutoff date
            filteredPosts = postsData.filter((post) => {
              if (!post.postDate) return false;
              // Parse postDate (format: 2025-11-30)
              const postDate = new Date(post.postDate);
              postDate.setHours(0, 0, 0, 0); // Set to start of post date
              return postDate >= cutoffDate;
            });
          }
        }

        setPosts(filteredPosts);
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
  }, [currentPage, selectedCategory, searchTerm, maxDistance, dateFilter]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleTopicClick = (categoryId) => {
    setSelectedCategoryId(
      categoryId === selectedCategoryId ? null : categoryId
    );
    setCurrentPage(1);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDateFilter &&
        !event.target.closest(".explore-filter-dropdown-btn") &&
        !event.target.closest(".explore-date-dropdown")
      ) {
        setShowDateFilter(false);
      }
      if (
        showDistanceFilter &&
        !event.target.closest(".explore-distance-modal") &&
        !event.target.closest(".btn-outline-secondary")
      ) {
        setShowDistanceFilter(false);
      }
    };

    if (showDateFilter || showDistanceFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateFilter, showDistanceFilter]);

  const handleLoadRecommended = async () => {
    // Nếu đã có data và đang hiển thị, chỉ toggle ẩn
    if (suggestedPosts.length > 0 && showSuggested) {
      setShowSuggested(false);
      return;
    }

    // Hiển thị grid ngay (có thể đang loading hoặc đã có data)
    setShowSuggested(true);

    // Nếu chưa có data, gọi API
    if (suggestedPosts.length === 0) {
      try {
        setLoadingRecommended(true);
        const response = await getPostRecommend();

        let postsData = [];
        if (response?.data) {
          postsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          postsData = response;
        }

        setSuggestedPosts(postsData);
      } catch (error) {
        console.error("Error fetching recommended posts:", error);
        setSuggestedPosts([]);
        alert("Không thể tải bài đăng gợi ý. Vui lòng thử lại.");
      } finally {
        setLoadingRecommended(false);
      }
    }
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
            <div className="d-flex align-items-center justify-content-center gap-3">
              <div className="position-relative">
                <button
                  className="btn btn-outline-secondary rounded-pill px-3 py-2 explore-filter-dropdown-btn"
                  onClick={() => {
                    setShowDateFilter(!showDateFilter);
                    setShowDistanceFilter(false);
                  }}
                >
                  <i className="bi bi-calendar-range me-2"></i>
                  {dateFilter ? (
                    <>
                      {dateFilter === "week" && "1 tuần"}
                      {dateFilter === "month" && "1 tháng"}
                      {dateFilter === "year" && "1 năm"}
                    </>
                  ) : (
                    "Thời gian"
                  )}
                  <i
                    className={`bi bi-chevron-${
                      showDateFilter ? "up" : "down"
                    } ms-2`}
                  ></i>
                </button>

                {/* Date Filter Dropdown */}
                {showDateFilter && (
                  <div className="explore-date-dropdown">
                    <button
                      className={`explore-date-dropdown-item ${
                        dateFilter === "week" ? "active" : ""
                      }`}
                      onClick={() => {
                        setDateFilter("week");
                        setCurrentPage(1);
                        setShowDateFilter(false);
                      }}
                    >
                      <i className="bi bi-calendar-week me-2"></i>
                      <span>1 tuần qua</span>
                      {dateFilter === "week" && (
                        <i className="bi bi-check-lg ms-auto"></i>
                      )}
                    </button>
                    <button
                      className={`explore-date-dropdown-item ${
                        dateFilter === "month" ? "active" : ""
                      }`}
                      onClick={() => {
                        setDateFilter("month");
                        setCurrentPage(1);
                        setShowDateFilter(false);
                      }}
                    >
                      <i className="bi bi-calendar-month me-2"></i>
                      <span>1 tháng qua</span>
                      {dateFilter === "month" && (
                        <i className="bi bi-check-lg ms-auto"></i>
                      )}
                    </button>
                    <button
                      className={`explore-date-dropdown-item ${
                        dateFilter === "year" ? "active" : ""
                      }`}
                      onClick={() => {
                        setDateFilter("year");
                        setCurrentPage(1);
                        setShowDateFilter(false);
                      }}
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      <span>1 năm qua</span>
                      {dateFilter === "year" && (
                        <i className="bi bi-check-lg ms-auto"></i>
                      )}
                    </button>
                    {dateFilter && (
                      <div className="explore-date-dropdown-divider"></div>
                    )}
                    {dateFilter && (
                      <button
                        className="explore-date-dropdown-item explore-date-dropdown-reset"
                        onClick={() => {
                          setDateFilter(null);
                          setCurrentPage(1);
                          setShowDateFilter(false);
                        }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        <span>Xóa bộ lọc</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex gap-2">
                <div className="position-relative">
                  <button
                    className="btn btn-outline-secondary rounded-pill px-3 py-2"
                    onClick={() => {
                      setShowDistanceFilter(!showDistanceFilter);
                      setShowDateFilter(false);
                      setTempDistance(maxDistance);
                    }}
                  >
                    <i className="bi bi-signpost-2 me-2"></i>
                    {maxDistance === 100 ? "100 km" : `${maxDistance} km`}
                  </button>

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
                <div
                  className=" rounded-pill px-3 py-2"
                  style={{ fontSize: "18px" }}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  Hà Nội
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="explore-topics-title">Danh mục</h3>
            <div
              className={`topic-scroll ${
                categories.length > 7 ? "topic-scroll-enabled" : ""
              }`}
              style={categories.length > 7 ? { overflowX: "auto" } : {}}
            >
              <div className="d-flex gap-3 topic-scroll-content">
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

        {/* Suggested Posts Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="explore-suggested-header">
              <h4 className="explore-suggested-title">
                <i className="bi bi-lightbulb me-2"></i>
                Gợi ý cho bạn
              </h4>
              <button
                className="explore-suggested-toggle"
                onClick={handleLoadRecommended}
                disabled={loadingRecommended}
              >
                {loadingRecommended ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                      style={{
                        width: "14px",
                        height: "14px",
                        borderWidth: "2px",
                      }}
                    ></span>
                    <span>Đang tải...</span>
                  </>
                ) : showSuggested ? (
                  <>
                    <span>Ẩn bớt</span>
                    <i className="bi bi-chevron-up ms-1"></i>
                  </>
                ) : (
                  <>
                    <span>Xem gợi ý</span>
                    <i className="bi bi-chevron-down ms-1"></i>
                  </>
                )}
              </button>
            </div>
            {showSuggested && (
              <div className="explore-suggested-grid">
                {loadingRecommended ? (
                  <div
                    className="explore-loading"
                    style={{ width: "100%", gridColumn: "1 / -1" }}
                  >
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-3">Đang tải bài đăng gợi ý...</div>
                  </div>
                ) : suggestedPosts.length === 0 ? (
                  <div
                    className="explore-empty"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    Không có bài đăng gợi ý nào
                  </div>
                ) : (
                  suggestedPosts.map((card) => (
                    <div
                      key={card.id}
                      className="explore-card"
                      onClick={() => handlePostClick(card.id)}
                    >
                      <div className="card-body p-0">
                        <div className="explore-card-image-wrapper">
                          {card.imageUrl ? (
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="explore-card-image"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="explore-card-image-placeholder">
                              <i className="bi bi-image"></i>
                            </div>
                          )}
                        </div>
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
            )}
          </div>
        </div>

        {/* All Posts Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="explore-section-title">Tất cả bài đăng</h4>
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
