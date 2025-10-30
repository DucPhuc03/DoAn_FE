import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Explore from "./pages/Explore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </>
  );
}

export default App;
