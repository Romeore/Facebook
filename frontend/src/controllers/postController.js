// src/controllers/postController.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

export const fetchPosts = async (filters = {}, username) => {
  const response = await axios.get(API_URL, {
    headers: { username },
    params: filters
  });
  return response.data;
};

export const createPost = async (data, username) => {
  const response = await axios.post(API_URL, data, {
    headers: { username }
  });
  return response.data;
};

export const getFeedPosts = async (username) => {
  const res = await axios.get("http://localhost:5000/api/posts/feed", {
    headers: { username }
  });
  return res.data;
};

