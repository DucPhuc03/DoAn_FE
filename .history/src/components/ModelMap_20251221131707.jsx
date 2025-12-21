import { useEffect, useRef, useState } from "react";

export default function MapSearchAutocomplete({ onLocationChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
      center: [105.83416, 21.02776],
      zoom: 12,
    });

    mapInstanceRef.current = map;

    // Click để chọn vị trí thủ công
    map.on("click", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      console.log(lat, lng);
      setMarker(map, lat, lng);
      onLocationChange?.({ lat, lng });
    });
  }, []);

  // 👉 Hàm đặt hoặc cập nhật marker
  const setMarker = (map, lat, lng) => {
    if (!markerRef.current) {
      markerRef.current = new window.goongjs.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
    map.flyTo({ center: [lng, lat], zoom: 15 });
  };

  // 👉 Khi nhập vào ô tìm kiếm → gọi Suggest API
  const handleChange = async (value) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${encodeURIComponent(
        value
      )}`
    );
    const data = await res.json();

    setSuggestions(data.predictions || []);
  };

  // 👉 Khi chọn 1 gợi ý
  const handleSelect = async (item) => {
    setQuery(item.description);
    setSuggestions([]);

    // Gọi Place Detail API để lấy lat/lng
    const detailRes = await fetch(
      `https://rsapi.goong.io/Place/Detail?place_id=${item.place_id}&api_key=${API_KEY}`
    );
    const detail = await detailRes.json();

    const lat = detail.result.geometry.location.lat;
    const lng = detail.result.geometry.location.lng;

    const map = mapInstanceRef.current;
    setMarker(map, lat, lng);
    onLocationChange?.({ lat, lng });
  };

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      {/* Ô tìm kiếm */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}>
        <input
          type="text"
          placeholder="Nhập địa chỉ..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          style={{
            width: 300,
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        {/* Danh sách gợi ý */}
        {suggestions.length > 0 && (
          <div
            style={{
              width: 300,
              maxHeight: 250,
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #ddd",
              borderTop: "none",
              borderRadius: "0 0 6px 6px",
              position: "absolute",
              zIndex: 999,
            }}
          >
            {suggestions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => handleSelect(item)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
              >
                {item.description}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
