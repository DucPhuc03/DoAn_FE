# Hướng dẫn sử dụng Component Map

## Cài đặt

1. Tạo file `.env` trong thư mục gốc của dự án với nội dung:
```
VITE_GOONG_API_KEY=32fs6qk5OYL3ZUo1nC3rHqXKPaq4LsU0HC9Wx8wy
```

2. Khởi động lại dev server để load biến môi trường mới.

## Sử dụng Component

```jsx
import Map from "../components/Map";

// Sử dụng cơ bản
<Map />

// Với tùy chọn
<Map
  center={[10.762622, 106.660172]} // [lat, lng]
  zoom={13}
  height="500px"
  width="100%"
  markers={[
    {
      position: [10.762622, 106.660172],
      title: "Địa điểm 1",
      description: "Mô tả địa điểm",
      color: "#FF0000",
      icon: "📍",
      onClick: (marker, index) => {
        console.log("Marker clicked:", marker);
      }
    }
  ]}
  onMapClick={(location) => {
    console.log("Map clicked:", location);
  }}
  onMarkerClick={(marker, index) => {
    console.log("Marker clicked:", marker, index);
  }}
/>
```

## Props

- `center` (array, optional): Tọa độ trung tâm [lat, lng]. Mặc định: [10.762622, 106.660172] (Hồ Chí Minh)
- `zoom` (number, optional): Mức độ zoom. Mặc định: 13
- `markers` (array, optional): Danh sách các marker
  - `position`: [lat, lng]
  - `title`: Tiêu đề hiển thị trong popup
  - `description`: Mô tả hiển thị trong popup
  - `color`: Màu của marker (mặc định: "#FF0000")
  - `icon`: Icon HTML hoặc emoji
  - `onClick`: Callback khi click vào marker
- `height` (string, optional): Chiều cao của map. Mặc định: "400px"
- `width` (string, optional): Chiều rộng của map. Mặc định: "100%"
- `onMapClick` (function, optional): Callback khi click vào map
- `onMarkerClick` (function, optional): Callback khi click vào marker
- `style` (object, optional): Style bổ sung cho container

























