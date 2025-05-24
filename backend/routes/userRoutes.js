const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: "Username already taken" });

  const user = await User.create({ username, password });
  res.json({ message: "User registered", user });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });

  req.app.get("loggedInUser").set(username);
  res.json({ message: "Logged in", username });
});

router.post("/logout", (req, res) => {
  req.app.get("loggedInUser").clear();
  res.json({ message: "Logged out" });
});

module.exports = router;
