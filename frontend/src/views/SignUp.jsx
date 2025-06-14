import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/fireBaseDB";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return alert("Password must be at least 6 characters long");
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username });

      await axios.post("http://localhost:5000/api/users/sync", {
        email,
        username
      });

      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("This email is already in use.");
      } else if (err.response?.data?.message === "Username already exists") {
        alert("This username is already taken.");
      } else {
        alert("Sign up failed: " + err.message);
    }
  }
};


  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        /><br />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
    </div>
  );
}

export default SignUp;
