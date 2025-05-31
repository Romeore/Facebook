import React, { useState, useEffect } from "react";
import { createPost } from "../controllers/postController";
import { fetchUserGroups } from "../controllers/groupController";
import "./CreatePostView.css";

function CreatePostView({ username }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserGroups(username).then(setGroups);
  }, [username]);

  const submit = async () => {
    if (loading) return; 

    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        content,
        ...(selectedGroup && { group: selectedGroup })
      };

      await createPost(postData, username);
      alert("Post created!");
      setTitle("");
      setContent("");
      setSelectedGroup("");
    } catch (err) {
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2>Create New Post</h2>

      <input
        className="input-field"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      /><br />

      <textarea
        className="textarea-field"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={5}
      /><br />

      <label className="label">Select Group (optional):</label>
      <select
        className="select-field"
        value={selectedGroup}
        onChange={e => setSelectedGroup(e.target.value)}
      >
        <option value="">-- Personal Post --</option>
        {groups.map(group => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select><br /><br />

      <button
        className="main-button"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  );
}

export default CreatePostView;
