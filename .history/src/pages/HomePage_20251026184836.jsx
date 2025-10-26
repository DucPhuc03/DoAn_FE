import React from "react";
import Header from "../components/Header";

const HomePage = () => {
  return (
    <div className="container-fluid py-4">
      <Header />
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Chào mừng đến với TraoDoiDo</h1>
          <p className="text-center text-muted">
            Nền tảng trao đổi đồ cũ uy tín và tiện lợi
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
