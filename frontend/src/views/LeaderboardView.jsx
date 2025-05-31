import React, { useEffect, useState } from "react";
import $ from "jquery";
import "./LeaderboardView.css";

function LeaderboardView() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    $.ajax({
      url: "http://localhost:5000/api/users/leaderboard",
      method: "GET",
      success: data => setLeaders(data),
      error: err => console.error("Failed to load leaderboard:", err)
    });
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <ol>
        {leaders.map((user, i) => (
          <li key={i}>
            <span>{user.username}</span>
            <span>{user.coins} coins</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default LeaderboardView;
