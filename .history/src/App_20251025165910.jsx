import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <div>
        <Routes>
          {/* Đây là route cho trang chủ */}
          <Route path="/tranf" element={HomePage} />
        </Routes>
      </div>
    </>
  );
}

export default App;
