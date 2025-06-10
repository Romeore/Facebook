import React, { useEffect, useState } from "react";
import "./LeaderboardView.css";
import { getLeaderboard } from "../controllers/userController";

function LeaderboardView() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    getLeaderboard().then(setLeaders)
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
