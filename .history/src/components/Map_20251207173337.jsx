import { useEffect, useRef, useState } from "react";

export default function Map({ onSelect, center, zoom = 13 }) {
  const mapContainer = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep onSelectRef updated
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    // Load Goong Maps script dynamically if not already loaded
    const loadGoongScript = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.goongjs) {
          resolve();
          return;
        }

        // Check if script tag already exists
        const existingScript = document.querySelector('script[src*="goong"]');
        if (existingScript) {
          existingScript.onload = () => resolve();
          existingScript.onerror = () =>
            reject(new Error("Failed to load Goong Maps script"));
          return;
        }

        // Load CSS first
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://maps.goong.io/css/goong-js.css";
        document.head.appendChild(link);

        // Load JS script
        const script = document.createElement("script");
        script.src = `https://maps.goong.io/js/goong-js.js`;
        script.async = true;
        script.onload = () => {
          console.log("Goong Maps script loaded");
          resolve();
        };
        script.onerror = () => {
          console.error("Failed to load Goong Maps script");
          reject(new Error("Failed to load Goong Maps script"));
        };
        document.head.appendChild(script);
      });
    };

    // Initialize map
    const initMap = () => {
      if (!window.goongjs || !mapContainer.current) {
        return false;
      }

      // Nếu map đã được khởi tạo rồi thì không tạo lại
      if (mapInstanceRef.current) {
        setIsLoading(false);
        return true;
      }

      // Key để hiển thị bản đồ
      const GOONG_MAP_KEY = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy";
      window.goongjs.accessToken = GOONG_MAP_KEY;

      // Default center: Hà Nội
      const defaultCenter = center || [105.83416, 21.02776];

      try {
        const map = new window.goongjs.Map({
          container: mapContainer.current,
          style: "https://tiles.goong.io/assets/goong_map_light.json",
          center: defaultCenter,
          zoom: zoom,
        });

        mapInstanceRef.current = map;

        // Khi click vào map
        map.on("click", (e) => {
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;

          // Nếu marker chưa tạo → tạo mới
          if (!markerRef.current) {
            markerRef.current = new window.goongjs.Marker({ draggable: true })
              .setLngLat([lng, lat])
              .addTo(map);

            // Khi kéo marker
            markerRef.current.on("dragend", () => {
              const { lng, lat } = markerRef.current.getLngLat();
              if (onSelectRef.current) {
                onSelectRef.current({ lat, lng });
              }
            });
          } else {
            // Nếu marker có rồi → update vị trí
            markerRef.current.setLngLat([lng, lat]);
          }

          // Trả lat/lng ra component cha
          if (onSelectRef.current) {
            onSelectRef.current({ lat, lng });
          }
        });

        console.log("Map initialized successfully");
        setIsLoading(false);
        setError(null);
        return true;
      } catch (error) {
        console.error("Error initializing map:", error);
        setError(error.message || "Lỗi khởi tạo bản đồ");
        setIsLoading(false);
        return false;
      }
    };

    // Reset loading state
    setIsLoading(true);
    setError(null);

    // Load script and initialize map
    loadGoongScript()
      .then(() => {
        // Wait a bit for script to fully initialize
        setTimeout(() => {
          if (!initMap()) {
            // Retry a few times
            let attempts = 0;
            const maxAttempts = 20;
            const retryInterval = setInterval(() => {
              attempts++;
              if (initMap() || attempts >= maxAttempts) {
                clearInterval(retryInterval);
                if (attempts >= maxAttempts && !mapInstanceRef.current) {
                  setError("Không thể khởi tạo bản đồ. Vui lòng thử lại.");
                  setIsLoading(false);
                }
              }
            }, 200);
          }
        }, 100);
      })
      .catch((error) => {
        console.error("Error loading Goong Maps:", error);
        setError("Không thể tải Goong Maps. Vui lòng kiểm tra kết nối mạng.");
        setIsLoading(false);
      });

    return () => {
      // Cleanup map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, [center, zoom]); // Re-run if center or zoom changes

  // Update center if changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  return (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", borderRadius: "10px" }}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f3f4f6",
            borderRadius: "10px",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 14 }}>
              Đang tải bản đồ...
            </div>
          </div>
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fef2f2",
            borderRadius: "10px",
            border: "1px solid #fecaca",
            zIndex: 1,
          }}
        >
          <div
            style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}
          >
            <i
              className="bi bi-exclamation-triangle"
              style={{ fontSize: "2rem" }}
            ></i>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>
              Không thể tải bản đồ
            </div>
            <div style={{ marginTop: 8, fontSize: 12 }}>{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
