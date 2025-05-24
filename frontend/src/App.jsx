// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import HomeView from "./views/HomeView";
import PostsView from "./views/PostsView";
import GroupsView from "./views/GroupsView";
import FeedView from "./views/FeedView";
import CreatePostView from "./views/CreatePostView";

// Add login
// Add update group
function App() {
  const username = "alice"; // Simulate login

  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f0f0f0", marginBottom: "1rem" }}>
        <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
        <Link to="/posts" style={{ margin: "0 10px" }}>Posts</Link>
        <Link to="/create" style={{ margin: "0 10px" }}>Create Post</Link>
        <Link to="/groups" style={{ margin: "0 10px" }}>Groups</Link>
        <Link to="/feed" style={{ margin: "0 10px" }}>Feed</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/posts" element={<PostsView username={username} />} />
        <Route path="/create" element={<CreatePostView username={username} />} />
        <Route path="/groups" element={<GroupsView username={username} />} />
        <Route path="/feed" element={<FeedView username={username} />} />
      </Routes>
    </Router>
  );
}

export default App;
