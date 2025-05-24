import React, { useState, useEffect } from "react";
import { fetchPosts } from "../controllers/postController";

function PostsView({ username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts({}, username).then(setPosts);
  }, [username]);

  return (
    <div>
      <h2>My Posts</h2>

      {posts.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div style={{ columnCount: 2, gap: "1rem", marginTop: "2rem" }}>
          {posts.map(p => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem"
              }}
            >
              <strong>{p.title}</strong>
              <p>{p.content}</p>
              <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                Posted in{" "}
                {p.group ? <strong>{p.group.name}</strong> : <em>Personal Post</em>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsView;
