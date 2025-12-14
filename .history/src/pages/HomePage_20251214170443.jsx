import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getAllPosts } from "../service/PostService";
import {
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaHeart,
  FaSearch,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const response = await getAllPosts("", "", 100, 1);
        let postsData = [];
        if (response?.data) {
          postsData = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          postsData = response;
        }
        // Lấy 6 bài đăng đầu tiên làm featured
        setFeaturedPosts(postsData.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured posts:", error);
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const features = [
    {
      icon: <FaExchangeAlt size={40} />,
      title: "Trao đổi dễ dàng",
      description: "Tìm kiếm và trao đổi đồ cũ một cách nhanh chóng, tiện lợi",
      color: "#6366F1",
    },
    {
      icon: <FaMapMarkerAlt size={40} />,
      title: "Gần bạn",
      description: "Tìm kiếm theo khoảng cách để gặp mặt trao đổi thuận tiện",
      color: "#10B981",
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "An toàn & Uy tín",
      description: "Hệ thống xác minh và đánh giá đảm bảo giao dịch an toàn",
      color: "#F59E0B",
    },
    {
      icon: <FaHeart size={40} />,
      title: "Cộng đồng thân thiện",
      description: "Tham gia cộng đồng người dùng tích cực, hỗ trợ lẫn nhau",
      color: "#EF4444",
    },
  ];

  const stats = [
    { number: "10K+", label: "Người dùng" },
    { number: "5K+", label: "Bài đăng" },
    { number: "2K+", label: "Trao đổi thành công" },
    { number: "4.8/5", label: "Đánh giá" },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "80px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              marginBottom: "24px",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Trao đổi đồ cũ - Tái sử dụng thông minh
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              marginBottom: "40px",
              opacity: 0.95,
              maxWidth: "700px",
              margin: "0 auto 40px",
            }}
          >
            Nền tảng trao đổi đồ cũ uy tín, giúp bạn tìm được món đồ phù hợp và
            gặp gỡ người dùng gần bạn
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/explore")}
              style={{
                background: "white",
                color: "#667eea",
                border: "none",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              Khám phá ngay <FaArrowRight />
            </button>
            <button
              onClick={() => navigate("/new-post")}
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Đăng bài mới
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          background: "white",
          padding: "60px 20px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "#667eea",
                      marginBottom: "8px",
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#6b7280",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 20px", background: "white" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "16px",
              }}
            >
              Tại sao chọn TraoDoiDo?
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#6b7280",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Nền tảng trao đổi đồ cũ hiện đại với đầy đủ tính năng bạn cần
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3">
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "32px 24px",
                    borderRadius: "16px",
                    textAlign: "center",
                    height: "100%",
                    transition: "all 0.3s",
                    border: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = feature.color;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      color: feature.color,
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#1f2937",
                      marginBottom: "12px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#6b7280",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section
        style={{
          padding: "80px 20px",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Bài đăng nổi bật
              </h2>
              <p style={{ fontSize: "1rem", color: "#6b7280", margin: 0 }}>
                Khám phá những món đồ đang được quan tâm
              </p>
            </div>
            <button
              onClick={() => navigate("/explore")}
              style={{
                background: "#6366F1",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "50px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4F46E5";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#6366F1";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              Xem tất cả <LuArrowRight />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="row g-4">
              {featuredPosts.map((post) => (
                <div key={post.id} className="col-6 col-md-4 col-lg-2">
                  <div
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                      height: "100%",
                    }}
                    onClick={() => navigate(`/post/${post.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "1",
                        overflow: "hidden",
                        background: "#f3f4f6",
                      }}
                    >
                      {post.imageUrls && post.imageUrls.length > 0 ? (
                        <img
                          src={post.imageUrl[0]}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
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
                            color: "#9ca3af",
                          }}
                        >
                          <FaExchangeAlt size={40} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "12px" }}>
                      <h4
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1f2937",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {post.title}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "0.8rem",
                          color: "#6b7280",
                        }}
                      >
                        {post.distance && (
                          <span>
                            <FaMapMarkerAlt size={10} /> {post.distance} km
                          </span>
                        )}
                        {post.totalLikes > 0 && (
                          <span>
                            <FaHeart size={10} /> {post.totalLikes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
              }}
            >
              <FaExchangeAlt
                size={48}
                style={{ marginBottom: "16px", opacity: 0.5 }}
              />
              <p>Chưa có bài đăng nào</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 20px",
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "700px" }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            Sẵn sàng bắt đầu trao đổi?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "40px",
              opacity: 0.95,
            }}
          >
            Tham gia cộng đồng TraoDoiDo ngay hôm nay và tìm kiếm món đồ bạn cần
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/explore")}
              style={{
                background: "white",
                color: "#6366F1",
                border: "none",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              <FaSearch /> Tìm kiếm ngay
            </button>
            <button
              onClick={() => navigate("/new-post")}
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "14px 32px",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Đăng bài mới
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
