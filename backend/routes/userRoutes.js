const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/sync", async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) return res.status(400).json({ message: "Missing email or username" });

  let user = await User.findOne({ email });
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


module.exports = router;
