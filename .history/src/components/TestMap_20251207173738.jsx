import { useEffect, useRef } from "react";

export default function TestMap() {
  const mapRef = useRef();

  useEffect(() => {
    if (!window.goongjs) {
      console.error("GoongJS not loaded!");
      return;
    }

    window.goongjs.accessToken = "32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy";

    new window.goongjs.Map({
      container: mapRef.current,
      style: `https://tiles.goong.io/assets/goong_map_web.json`,
      center: [105.83416, 21.02776],
      zoom: 12,
    });
  }, []);

  return <div ref={mapRef} style={{ height: 400 }} />;
}
