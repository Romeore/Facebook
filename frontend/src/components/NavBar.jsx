import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/fireBaseDB";

function Navbar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#eee" }}>
      {currentUser && (
        <>
          <Link to="/">Home</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/posts">My Posts</Link>
          <Link to="/create">Create Post</Link>
          <Link to="/groups">Groups</Link>
          <span style={{ marginLeft: "auto" }}>
            {currentUser.displayName || currentUser.email} | <button onClick={handleLogout}>Logout</button>
          </span>
        </>
      )}
    </nav>
  );
}

export default Navbar;
