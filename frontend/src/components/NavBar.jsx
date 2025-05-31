import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/fireBaseDB";
import "./Navbar.css";

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin"); 
  };

  return (
    <nav className="navbar">
      {currentUser && (
        <>
          <Link to="/">Home</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/posts">My Posts</Link>
          <Link to="/create">Create Post</Link>
          <Link to="/groups">Groups</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/stocks">Stocks</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <span className="navbar-user">
            {currentUser.displayName || currentUser.email} |{" "}
            <button onClick={handleLogout}>Logout</button>
          </span>
        </>
      )}
    </nav>
  );
}

export default Navbar;
