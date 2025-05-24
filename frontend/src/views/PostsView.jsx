// src/views/PostsView.jsx
import React, { useState, useEffect } from "react";
import { fetchPosts, createPost } from "../controllers/postController";

function PostsView({ username }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPosts({}, username).then(setPosts);
  }, [username]);

  const handleSubmit = async () => {
    await createPost({ title, content }, username);
    const updated = await fetchPosts({}, username);
    setPosts(updated);
  };

  return (
    <div>
      <h2 style={{ textShadow: "1px 1px gray" }}>Posts</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSubmit}>Create Post</button>

      <div style={{ columnCount: 2, borderRadius: "12px", transition: "0.3s" }}>
        {posts.map(p => (
          <div key={p._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "12px", padding: "1rem" }}>
            <strong>{p.title}</strong>
            <p>{p.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsView;
