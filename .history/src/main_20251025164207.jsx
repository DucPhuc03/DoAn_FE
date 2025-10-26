import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    {/* 2. Bọc App bằng BrowserRouter */}
    <App />
  </BrowserRouter>
);
