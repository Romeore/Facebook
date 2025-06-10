import $ from "jquery";

const API_URL = "http://localhost:5000/api/users";

export const getLeaderboard = async (username, filters = {}) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${API_URL}/leaderboard`,
      method: "GET",
      success: resolve,
      error: reject
    });
  });
};