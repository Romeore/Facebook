import React from "react";
import "./HomeView.css";

function HomeView() {
  return (
    <div className="home-wrapper">
      <div className="home-left">
        <h1 className="home-title">Welcome to Adi and Alon Facebook</h1>
        <p className="home-subtitle">
          The best social media platform
        </p>
        <ul className="home-features">
          <li>Create posts</li>
          <li>Join and manage groups</li>
        </ul>
      </div>

      <div className="home-right">
        <div className="video-box">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/KJwYBJMSbPI?si=tIDN977JIHTBmQ3L&amp;start=398" title="Introduction to facebook" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>        </div>
      </div>
    </div>
  );
}

export default HomeView;
