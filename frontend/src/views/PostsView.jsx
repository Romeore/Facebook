import React, { useState, useEffect } from "react";
import {
  fetchPosts,
  updatePost,
  deletePost
} from "../controllers/postController";
import "./PostsView.css";

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
    <div className="posts-container">
      <h2 className="posts-title">My Posts</h2>

      {posts.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div className="posts-list">
          {posts.map((p) => (
            <div key={p._id} className="post-card">
              {editingPostId === p._id ? (
                <div className="edit-form">
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
                  />
                  <div className="post-buttons">
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingPostId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{p.title}</h3>
                  <p>{p.content}</p>
                  <p className="post-meta">
                    Posted in{" "}
                    {p.group ? <strong>{p.group.name}</strong> : <em>Personal Post</em>}
                  </p>
                  <div className="post-buttons">
                    <button onClick={() => handleEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
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
