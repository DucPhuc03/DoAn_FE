import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Explore from "./pages/Explore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import PostCategory from "./pages/PostCategory";
import Chat from "./pages/Chat";
import NewPost from "./pages/NewPost";
// import PostManagement from "./pages/admin/PostManagement";
import AccountManagement from "./pages/admin/AccountManagement";
import ReportManagement from "./pages/admin/ReportManagement";
import PendingManagement from "./pages/admin/PendingManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import EditPost from "./pages/EditPost";
import EditProfile from "./pages/EditProfile";
import GoogleCallBack from "./pages/GoogleCallBack";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/category/:name" element={<PostCategory />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/auth/google/callback" element={<GoogleCallBack />} />

        {/* <Route path="/admin/post_management" element={<PostManagement />} /> */}
        <Route
          path="/admin/account_management"
          element={<AccountManagement />}
        />
        <Route path="/admin/report_management" element={<ReportManagement />} />
        <Route
          path="/admin/pending_management"
          element={<PendingManagement />}
        />
        <Route
          path="/admin/category_management"
          element={<CategoryManagement />}
        />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </>
  );
}

export default App;
