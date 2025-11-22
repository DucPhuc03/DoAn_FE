import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const PostCategory = () => {
  const { name } = useParams();
  const readableName = decodeURIComponent(name || "").replace(/-/g, " ");

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container py-5">
        <div className="mb-4">
          <span className="text-muted text-uppercase small fw-semibold">
            Danh mục
          </span>
          <h1 className="display-6 fw-bold mt-2">{readableName}</h1>
          <p className="text-muted mb-0">
            Đang phát triển nội dung cho danh mục này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCategory;
