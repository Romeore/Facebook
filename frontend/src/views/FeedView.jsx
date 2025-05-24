import React, { useEffect, useState } from "react";
import { getFeedPosts } from "../controllers/postController";

function FeedView({ username }) {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    getFeedPosts(username).then(setFeed);
  }, [username]);

  return (
    <div>
      <h2>Your Feed</h2>
      {feed.length === 0 ? (
        <p>No posts to show. Join some groups!</p>
      ) : (
        <div style={{ columnCount: 2, gap: "1rem" }}>
          {feed.map(post => (
            <div key={post._id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "10px", marginBottom: "1rem" }}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p style={{ fontStyle: "italic", fontSize: "0.8rem" }}>by {post.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedView;
