import React from "react";
// import "./HomeView.css";

function HomeView() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Social Network</h1>
      <p className="home-subtitle">Here's a quick video to get you started:</p>

      <div className="home-video">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Intro Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default HomeView;
