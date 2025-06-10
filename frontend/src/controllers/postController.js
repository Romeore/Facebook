import $ from "jquery";

const API_URL = "http://localhost:5000/api/posts";

export const fetchPosts = async (filters = {}, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: API_URL,
      method: "GET",
      headers: { username },
      data: filters,
      success: resolve,
      error: reject
    });
  });
};

export const createPost = async (data, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: API_URL,
      method: "POST",
      headers: { username },
      data: JSON.stringify(data),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const getFeedPosts = async (username, filters = {}) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_URL}/feed`,
      method: "GET",
      headers: { username },
      data: filters, 
      success: resolve,
      error: reject
    });
  });
};

export const updatePost = async (postId, data, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_URL}/${postId}`,
      method: "PUT",
      headers: { username },
      data: JSON.stringify(data),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const deletePost = async (postId, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_URL}/${postId}`,
      method: "DELETE",
      headers: { username },
      success: resolve,
      error: reject
    });
  });
};

export const getPostStats = async (username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_URL}/stats`,
      method: "GET",
      headers: { username },
      success: resolve,
      error: reject
    });
  });
}
