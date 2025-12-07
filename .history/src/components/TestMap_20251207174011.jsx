import { useEffect, useRef } from "react";

export default function TestMap() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.goongjs) {
      console.error("GoongJS not loaded!");
      return;
    }

    // 🔥 KEY PHẢI LÀ MAPTILES KEY (mtk_xxx)
    const MAPTILES_KEY = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy";
    window.goongjs.accessToken = MAPTILES_KEY;

    // Khởi tạo bản đồ
    const map = new window.goongjs.Map({
      container: mapRef.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${MAPTILES_KEY}`,
      center: [105.83416, 21.02776],
      zoom: 12,
    });

    // 👉 Khi click vào bản đồ
    map.on("click", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;

      console.log("Latitude:", lat);
      console.log("Longitude:", lng);

      // 👉 Đặt marker tại vị trí click
      if (!markerRef.current) {
        markerRef.current = new window.goongjs.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
    });
  }, []);

  return <div ref={mapRef} style={{ height: 400 }} />;
}
