const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const auth = require("../middleware/auth");

// Create a group
router.post("/", auth, async (req, res) => {
  const { name, description, isPrivate } = req.body;
  const group = await Group.create({
    name,
    description,
    isPrivate,
    admin: req.username,
    members: [req.username]
  });
  res.status(201).json(group);
});

// Join a group
router.post("/:id/join", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.members.includes(req.username)) {
    return res.status(400).json({ message: "Already a member" });
  }

  group.members.push(req.username);
  await group.save();
  res.json({ message: "Joined group", group });
});

// List all groups
router.get("/", auth, async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

// List members
router.get("/:id/members", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  res.json({ members: group.members });
});

module.exports = router;
