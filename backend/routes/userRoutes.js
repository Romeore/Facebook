const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/sync", async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) return res.status(400).json({ message: "Missing email or username" });

  const existingUserByEmail = await User.findOne({ email });
  const existingUserByUsername = await User.findOne({ username });

  if (existingUserByEmail && existingUserByUsername) {
    return res.status(200).json(existingUserByEmail);
  }

  if (existingUserByUsername && !existingUserByEmail) {
    return res.status(400).json({ message: "Username already exists" });
  }

  let user = existingUserByEmail;
  if (!user) {
    user = await User.create({ email, username });
  }

  req.app.get("loggedInUser").set(user.username);

  res.json(user);
});

router.get("/by-email", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Missing email" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  req.app.get("loggedInUser").set(user.username);

  res.json(user);
});

router.get("/leaderboard", async (req, res) => {
  const topUsers = await User.find()
    .sort({ coins: -1 })
    .limit(10)
    .select("username coins -_id");

  res.json(topUsers);
});

module.exports = router;
