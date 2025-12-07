import { useEffect, useRef, useState } from "react";

export default function MapWithSearch() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  const MAPTILES_KEY = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy"; // Map tiles
  const API_KEY = "fs7bNKZ4N2c0iyuXllwJQKL7CelQGDDDCvtaExUd"; // Suggest API KEY

  useEffect(() => {
    if (!window.goongjs) return;

    window.goongjs.accessToken = MAPTILES_KEY;

    const map = new window.goongjs.Map({
      container: mapRef.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAPTILES_KEY}`,
      center: [105.83416, 21.02776], // Hà Nội
      zoom: 12,
    });

    map.on("click", (e) => {
      setMarker(map, e.lngLat.lat, e.lngLat.lng);
    });

    function setMarker(map, lat, lng) {
      if (!markerRef.current) {
        markerRef.current = new window.goongjs.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
      map.flyTo({ center: [lng, lat], zoom: 15 });
      console.log("Lat:", lat, "Lng:", lng);
    }
  }, []);

  // 👉 Gọi API Suggest khi user nhập
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${value}`
    );

    const data = await res.json();
    setSuggestions(data.predictions || []);
  };

  // 👉 Khi user chọn gợi ý
  const handleSelect = async (place_id, description) => {
    setQuery(description);
    setSuggestions([]);

    // Gọi API lấy lat,lng từ place_id
    const res = await fetch(
      `https://rsapi.goong.io/Place/Detail?place_id=${place_id}&api_key=${API_KEY}`
    );
    const data = await res.json();
    const { lat, lng } = data.result.geometry.location;

    // Set marker + move map
    const map = markerRef.current?._map || window.goongjs.Map.instances[0];
    if (map) {
      if (!markerRef.current) {
        markerRef.current = new window.goongjs.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
      map.flyTo({ center: [lng, lat], zoom: 15 });
    }

    console.log("Selected:", description);
    console.log("Lat:", lat, "Lng:", lng);
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {/* Ô tìm kiếm */}
      <div style={{ padding: 10, position: "absolute", zIndex: 999 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Nhập địa chỉ…"
          style={{
            width: 300,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        {/* Danh sách gợi ý */}
        {suggestions.length > 0 && (
          <div
            style={{
              marginTop: 4,
              width: 300,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 6,
              maxHeight: 200,
              overflowY: "auto",
              position: "absolute",
            }}
          >
            {suggestions.map((item) => (
              <div
                key={item.place_id}
                onClick={() => handleSelect(item.place_id, item.description)}
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

      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
