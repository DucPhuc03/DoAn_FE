import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryList } from "../service/CategoryService";
import "../css/SelectInterests.css";

const SelectInterests = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fake data fallback
  const fakeCategories = [
    { id: 1, name: "Điện tử", image: "https://picsum.photos/200?random=1" },
    { id: 2, name: "Thời trang", image: "https://picsum.photos/200?random=2" },
    { id: 3, name: "Đồ gia dụng", image: "https://picsum.photos/200?random=3" },
    { id: 4, name: "Sách vở", image: "https://picsum.photos/200?random=4" },
    { id: 5, name: "Thể thao", image: "https://picsum.photos/200?random=5" },
    { id: 6, name: "Đồ chơi", image: "https://picsum.photos/200?random=6" },
    { id: 7, name: "Nội thất", image: "https://picsum.photos/200?random=7" },
    { id: 8, name: "Xe cộ", image: "https://picsum.photos/200?random=8" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategoryList();
        let data = [];
        if (response?.data) {
          data = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          data = response;
        }
        // Use fake data if API returns empty
        setCategories(data.length > 0 ? data : fakeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Use fake data on error
        setCategories(fakeCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleToggleInterest = (categoryId) => {
    setSelectedInterests((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      // TODO: Call API to save user interests
      // await saveUserInterests(selectedInterests);
      
      // Mark that user has selected interests
      localStorage.setItem("hasSelectedInterests", "true");
      
      // Navigate to explore page
      navigate("/explore");
    } catch (error) {
      console.error("Error saving interests:", error);
      alert("Không thể lưu sở thích. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSelectedInterests", "true");
    navigate("/explore");
  };

  return (
    <div className="select-interests-page">
      <div className="select-interests-container">
        {/* Header */}
        <div className="select-interests-header">
          <div className="select-interests-icon">
            <i className="bi bi-heart-fill"></i>
          </div>
          <h1 className="select-interests-title">Chọn sở thích của bạn</h1>
          <p className="select-interests-subtitle">
            Chọn các danh mục bạn quan tâm để chúng tôi gợi ý sản phẩm phù hợp với bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div className="select-interests-content">
          {loading ? (
            <div className="select-interests-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Đang tải danh mục...</p>
            </div>
          ) : (
            <div className="interests-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`interest-card ${
                    selectedInterests.includes(category.id) ? "selected" : ""
                  }`}
                  onClick={() => handleToggleInterest(category.id)}
                >
                  <div className="interest-card-image">
                    {category.image && category.image.startsWith("https://") ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="interest-card-placeholder">
                        <i className="bi bi-box"></i>
                      </div>
                    )}
                  </div>
                  <div className="interest-card-content">
                    <span className="interest-card-name">{category.name}</span>
                    {selectedInterests.includes(category.id) && (
                      <div className="interest-card-check">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Count */}
        {selectedInterests.length > 0 && (
          <div className="select-interests-count">
            Đã chọn <strong>{selectedInterests.length}</strong> sở thích
          </div>
        )}

        {/* Action Buttons */}
        <div className="select-interests-actions">
          <button
            className="btn-skip"
            onClick={handleSkip}
            disabled={submitting}
          >
            Bỏ qua
          </button>
          <button
            className="btn-continue"
            onClick={handleSubmit}
            disabled={selectedInterests.length === 0 || submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang lưu...
              </>
            ) : (
              <>
                Tiếp tục
                <i className="bi bi-arrow-right ms-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectInterests;
