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

router.post("/:id/approve", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  const { userToApprove } = req.body;

  if (group.admin !== req.username) {
    return res.status(403).json({ message: "Only admin can approve members" });
  }

  // Move from pending to members
  group.pending = group.pending.filter(user => user !== userToApprove);
  if (!group.members.includes(userToApprove)) {
    group.members.push(userToApprove);
  }

  await group.save();
  res.json({ message: "User approved", members: group.members });
});

router.post("/:id/remove", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  const { userToRemove } = req.body;

  if (group.admin !== req.username) {
    return res.status(403).json({ message: "Only admin can remove members" });
  }

  group.members = group.members.filter(user => user !== userToRemove);
  group.pending = group.pending.filter(user => user !== userToRemove); // Just in case

  await group.save();
  res.json({ message: "User removed", members: group.members });
});

// Join a group
router.post("/:id/join", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.members.includes(req.username)) {
    return res.status(400).json({ message: "Already a member" });
  }

  if (group.pending.includes(req.username)) {
    return res.status(400).json({ message: "Request already pending" });
  }

  group.pending.push(req.username);
  await group.save();
  res.json({ message: "Join request sent", pending: group.pending });
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
