import React from "react";
import Header from "../components/Header";

const PostDetail = () => {
  return (
    <div>
      <Header />
      <div className="container py-5">
        <h1 className="display-6 fw-bold">Chi tiết bài viết</h1>
        <p className="text-muted">
          Nội dung chi tiết của bài viết sẽ được hiển thị ở đây.
        </p>
      </div>
    </div>
  );
};

export default PostDetail;
