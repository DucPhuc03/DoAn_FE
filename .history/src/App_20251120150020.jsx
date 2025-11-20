import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Explore from "./pages/Explore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Chat from "./pages/Chat";
import NewPost from "./pages/NewPost";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/new-post" element={<NewPost />} />
      </Routes>
    </>
  );
}

export default App;
