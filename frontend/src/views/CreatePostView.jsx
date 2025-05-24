import React, { useState } from "react";
import { createPost } from "../controllers/postController";

function CreatePostView({ username }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async () => {
    await createPost({ title, content }, username);
    alert("Post created!");
  };

  return (
    <div>
      <h2>Create New Post</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <br />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default CreatePostView;
