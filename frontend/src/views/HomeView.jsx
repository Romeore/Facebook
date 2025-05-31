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
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Intro Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
