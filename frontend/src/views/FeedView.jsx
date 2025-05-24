import React, { useEffect, useState } from "react";
import { getFeedPosts } from "../controllers/postController";

function FeedView({ username }) {
  const [feed, setFeed] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    groupName: ""
  });

  useEffect(() => {
    fetchFeed();
  }, [username]);

  const fetchFeed = async () => {
    const results = await getFeedPosts(username, filters);
    setFeed(results);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchFeed();
  };

  return (
    <div>
      <h2>Your Feed</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Filter by title"
          name="title"
          value={filters.title}
          onChange={handleChange}
        />
        <input
          placeholder="Filter by author"
          name="author"
          value={filters.author}
          onChange={handleChange}
        />
        <input
          placeholder="Filter by group name"
          name="groupName"
          value={filters.groupName}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {feed.length === 0 ? (
        <p>No posts match your search.</p>
      ) : (
        <div style={{ columnCount: 2, gap: "1rem" }}>
          {feed.map(post => (
            <div
              key={post._id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "1rem"
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                Posted by <strong>{post.author}</strong>
                {post.group ? <> in <strong>{post.group.name}</strong></> : <> (Personal Post)</>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedView;
