import { useEffect, useRef, useState } from "react";

export default function SearchMap() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [query, setQuery] = useState("");

  const MAPTILES_KEY = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy";
  const API_KEY = "fs7bNKZ4N2c0iyuXllwJQKL7CelQGDDDCvtaExUd";

  useEffect(() => {
    if (!window.goongjs) {
      console.error("GoongJS not loaded!");
      return;
    }

    window.goongjs.accessToken = MAPTILES_KEY;

    const map = new window.goongjs.Map({
      container: mapRef.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAPTILES_KEY}`,
      center: [105.83416, 21.02776], // Hà Nội
      zoom: 12,
    });

    mapInstanceRef.current = map;
  }, []);

  // 👉 Khi nhấn Enter để tìm địa chỉ
  const handleEnter = async (e) => {
    if (e.key !== "Enter") return;

    const address = query.trim();
    if (!address) return;

    // Gọi Geocode API
    const res = await fetch(
      `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
        address
      )}&api_key=${API_KEY}`
    );
    const data = await res.json();

    if (!data || !data.results || data.results.length === 0) {
      alert("Không tìm thấy địa chỉ!");
      return;
    }

    const location = data.results[0].geometry.location;
    const lat = location.lat;
    const lng = location.lng;

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    const map = mapInstanceRef.current;

    // 👉 Đặt marker
    if (!markerRef.current) {
      markerRef.current = new window.goongjs.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }

    // 👉 Di chuyển bản đồ tới vị trí
    map.flyTo({ center: [lng, lat], zoom: 15 });
  };

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      {/* Ô nhập địa chỉ */}
      <input
        type="text"
        placeholder="Nhập địa chỉ rồi nhấn Enter..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleEnter}
        style={{
          position: "absolute",
          zIndex: 1000,
          width: "300px",
          padding: "10px",
          margin: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      {/* Map */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
