import React, { useState, useEffect } from "react";
import {
  fetchPosts,
  updatePost,
  deletePost
} from "../controllers/postController";

function PostsView({ username }) {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchPosts({}, username).then(setPosts);
  }, [username]);

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async () => {
    await updatePost(editingPostId, { title: editTitle, content: editContent }, username);
    setEditingPostId(null);
    fetchPosts({}, username).then(setPosts);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post?")) {
      await deletePost(postId, username);
      fetchPosts({}, username).then(setPosts);
    }
  };

  return (
    <div>
      <h2>My Posts</h2>

      {posts.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div style={{ columnCount: 2, gap: "1rem", marginTop: "2rem" }}>
          {posts.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem"
              }}
            >
              {editingPostId === p._id ? (
                <div>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Content"
                    rows={4}
                    style={{ width: "100%" }}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <strong>{p.title}</strong>
                  <p>{p.content}</p>
                  <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                    Posted in{" "}
                    {p.group ? <strong>{p.group.name}</strong> : <em>Personal Post</em>}
                  </p>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsView;
