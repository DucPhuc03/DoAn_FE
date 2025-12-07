import { useEffect, useRef } from "react";

export default function TestMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.goongjs) {
      console.error("GoongJS not loaded!");
      return;
    }

    // 🔥 BẮT BUỘC dùng Maptiles Key dạng mtk_xxx
    const MAPTILES_KEY = "mtk_your_key_here";
    window.goongjs.accessToken = MAPTILES_KEY;

    const map = new window.goongjs.Map({
      container: mapRef.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy}`,
      center: [105.83416, 21.02776],
      zoom: 12,
    });

    // ✔ Lắng nghe sự kiện click để lấy lat/lng
    map.on("click", (e) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      console.log("Lat:", lat);
      console.log("Lng:", lng);
    });
  }, []);

  return <div ref={mapRef} style={{ height: 400 }} />;
}
