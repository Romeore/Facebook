import React, { useState, useEffect } from "react";
import { createPost } from "../controllers/postController";
import { fetchUserGroups } from "../controllers/groupController";

function CreatePostView({ username }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    fetchUserGroups(username).then(setGroups);
  }, [username]);

  const submit = async () => {
    const postData = {
      title,
      content,
      ...(selectedGroup && { group: selectedGroup }) // only add group if selected
    };
    await createPost(postData, username);
    alert("Post created!");
    setTitle("");
    setContent("");
    setSelectedGroup("");
  };

  return (
    <div>
      <h2>Create New Post</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      /><br />

      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      /><br />

      <label>Select Group (optional):</label>
      <select
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

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default CreatePostView;
