import { useEffect, useRef } from "react";

export default function Map({ onSelect }) {
  const mapContainer = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.goongjs) return;

    window.goongjs.accessToken = "YOUR_GOONG_MAP_KEY";

    const map = new window.goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_light.json",
      center: [105.83416, 21.02776], // Hà Nội
      zoom: 13,
    });

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
          onSelect({ lat, lng });
        });
      } else {
        // Nếu marker có rồi → update vị trí
        markerRef.current.setLngLat([lng, lat]);
      }

      // Trả lat/lng ra component cha
      onSelect({ lat, lng });
    });
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", borderRadius: "10px" }}
    />
  );
}
