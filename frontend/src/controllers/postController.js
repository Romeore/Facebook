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

export const getFeedPosts = async (username, filters = {}) => {
  const res = await axios.get("http://localhost:5000/api/posts/feed", {
    headers: { username },
    params: filters
  });
  return res.data;
};

export const updatePost = async (postId, data, username) => {
  const response = await axios.put(`${API_URL}/${postId}`, data, {
    headers: { username }
  });
  return response.data;
};

export const deletePost = async (postId, username) => {
  const response = await axios.delete(`${API_URL}/${postId}`, {
    headers: { username }
  });
  return response.data;
};
