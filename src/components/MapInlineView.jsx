import { useEffect, useRef, useState } from "react";

export default function MapInlineView({ address }) {
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

    if (!address) {
      setError("Chưa có địa điểm");
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

        const map = new window.goongjs.Map({
          container: mapRef.current,
          style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAPTILES_KEY}`,
          center: center,
          zoom: zoom,
          interactive: true,
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

  if (!address) {
    return null;
  }

  return (
    <div className="map-inline-container">
      <div className="map-inline-header">
        <i className="bi bi-geo-alt-fill me-2"></i>
        <span className="map-inline-title">Địa điểm trao đổi</span>
      </div>
      <div className="map-inline-address">
        <i className="bi bi-pin-map me-2"></i>
        {address}
      </div>
      <div className="map-inline-wrapper">
        {loading && (
          <div className="map-inline-loading">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <span className="ms-2">Đang tải bản đồ...</span>
          </div>
        )}
        {error && (
          <div className="map-inline-error">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
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
  );
}
