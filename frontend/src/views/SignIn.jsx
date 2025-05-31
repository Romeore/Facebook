import React, { useState } from "react";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/fireBaseDB";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return alert("Password must be at least 6 characters long");
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const res = await axios.get("http://localhost:5000/api/users/by-email", {
        params: { email }
      });

      const mongoUser = res.data;

      await updateProfile(result.user, {
        displayName: mongoUser.username
      });

      navigate("/");
    } catch (err) {
      alert("Sign in failed: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Sign In</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default SignIn;
