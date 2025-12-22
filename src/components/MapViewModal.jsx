import { useEffect, useRef, useState } from "react";
import "../css/MapViewModal.css";

export default function MapViewModal({ address, onClose }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAPTILES_KEY = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy";
  const API_KEY = "fs7bNKZ4N2c0iyuXllwJQKL7CelQGDDDCvtaExUd";

  useEffect(() => {
    if (!window.goongjs) {
      setError("Không thể tải bản đồ");
      setLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        window.goongjs.accessToken = MAPTILES_KEY;

        // Default center (Hanoi)
        let center = [105.83416, 21.02776];
        let zoom = 12;

        // Try to geocode the address
        if (address) {
          try {
            const res = await fetch(
              `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
                address
              )}&api_key=${API_KEY}`
            );
            const data = await res.json();

            if (data.results && data.results.length > 0) {
              const location = data.results[0].geometry.location;
              center = [location.lng, location.lat];
              zoom = 15;
            }
          } catch (geoErr) {
            console.error("Geocoding error:", geoErr);
          }
        }

        const map = new window.goongjs.Map({
          container: mapRef.current,
          style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAPTILES_KEY}`,
          center: center,
          zoom: zoom,
        });

        mapInstanceRef.current = map;

        // Add marker at the location
        markerRef.current = new window.goongjs.Marker()
          .setLngLat(center)
          .addTo(map);

        map.on("load", () => {
          setLoading(false);
          // Force resize after a short delay to ensure proper rendering
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.resize();
            }
          }, 100);
        });
      } catch (err) {
        console.error("Map init error:", err);
        setError("Có lỗi xảy ra khi tải bản đồ");
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [address]);

  return (
    <div className="map-view-modal-overlay" onClick={onClose}>
      <div
        className="map-view-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="map-view-modal-header">
          <h5 className="map-view-modal-title">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Địa chỉ
          </h5>
          <button className="map-view-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="map-view-modal-address">
          <i className="bi bi-pin-map me-2"></i>
          {address || "Chưa có địa chỉ"}
        </div>

        <div className="map-view-modal-map-container">
          {loading && (
            <div className="map-view-modal-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p>Đang tải bản đồ...</p>
            </div>
          )}
          {error && (
            <div className="map-view-modal-error">
              <i className="bi bi-exclamation-triangle"></i>
              <p>{error}</p>
            </div>
          )}
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
              display: loading || error ? "none" : "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
