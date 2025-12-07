import React, { useEffect, useRef, useState } from "react";

const Map = ({
  center = [10.762622, 106.660172], // Default: Ho Chi Minh City
  zoom = 13,
  markers = [],
  height = "400px",
  width = "100%",
  onMapClick,
  onMarkerClick,
  style = {},
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

  useEffect(() => {
    // Check if Goong Maps is already loaded
    const checkGoongLoaded = () => {
      if (window.goongjs) {
        window.goongjs.accessToken = GOONG_API_KEY;
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkGoongLoaded()) {
      return;
    }

    // Wait for script to load (since it's in index.html)
    let checkInterval;
    const maxAttempts = 50; // 5 seconds max wait
    let attempts = 0;

    checkInterval = setInterval(() => {
      attempts++;
      if (checkGoongLoaded() || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (attempts >= maxAttempts && !window.goongjs) {
          console.error("Goong Maps failed to load after timeout");
        }
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      // Cleanup
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [GOONG_API_KEY]);

  useEffect(() => {
    if (!isLoaded || !window.goongjs || !mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      try {
        mapInstanceRef.current = new window.goongjs.Map({
          container: mapRef.current,
          style: "https://tiles.goong.io/assets/goong_map_web.json",
          center: center,
          zoom: zoom,
        });

        // Wait for map to load
        mapInstanceRef.current.on("load", () => {
          // Add click event listener
          if (onMapClick) {
            mapInstanceRef.current.on("click", (e) => {
              onMapClick({
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
                lngLat: e.lngLat,
              });
            });
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    } else {
      // Update center and zoom if changed
      try {
        mapInstanceRef.current.setCenter(center);
        mapInstanceRef.current.setZoom(zoom);
      } catch (error) {
        console.error("Error updating map:", error);
      }
    }
  }, [isLoaded, center, zoom, onMapClick]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      const {
        position,
        title,
        description,
        color = "#FF0000",
        icon,
        onClick,
      } = markerData;

      // Create marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = "16px";

      if (icon) {
        el.innerHTML = icon;
      } else {
        el.innerHTML = "📍";
      }

      // Create marker
      let marker;
      try {
        marker = new window.goongjs.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat(position)
          .addTo(mapInstanceRef.current);
      } catch (error) {
        console.error("Error creating marker:", error);
        return;
      }

      // Add click event
      if (onClick || onMarkerClick) {
        el.addEventListener("click", () => {
          if (onClick) onClick(markerData, index);
          if (onMarkerClick) onMarkerClick(markerData, index);
        });
      }

      // Add popup if title or description exists
      if (title || description) {
        const popup = new window.goongjs.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            ${title ? `<strong>${title}</strong>` : ""}
            ${description ? `<div style="margin-top: 4px; font-size: 12px;">${description}</div>` : ""}
          </div>`
        );
        marker.setPopup(popup);
      }

      markersRef.current.push(marker);
    });
  }, [isLoaded, markers, onMarkerClick]);

  return (
    <div
      style={{
        width: width,
        height: height,
        position: "relative",
        ...style,
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
      {!isLoaded && (
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
            borderRadius: "8px",
          }}
        >
          <div style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
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
            <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
              Nếu bản đồ không tải được, vui lòng kiểm tra kết nối mạng
            </div>
          </div>
        </div>
      )}
      {isLoaded && !window.goongjs && (
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
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          <div style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: "2rem" }}></i>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>
              Không thể tải bản đồ
            </div>
            <div style={{ marginTop: 8, fontSize: 12 }}>
              Vui lòng kiểm tra kết nối mạng hoặc thử lại sau
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;

