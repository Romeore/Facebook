const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;
  const group = await Group.create({
    name,
    description,
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
  group.pending = group.pending.filter(user => user !== userToRemove);

  await group.save();
  res.json({ message: "User removed", members: group.members });
});

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

  await User.updateOne({ username: group.admin }, { $inc: { coins: 1 } });

  res.json({ message: "Join request sent", pending: group.pending });
});

router.post("/:id/leave", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.admin === req.username) {
    return res.status(403).json({ message: "Admin cannot leave the group" });
  }

  group.members = group.members.filter(user => user !== req.username);
  await group.save();

  res.json({ message: "You left the group", members: group.members });
});

router.get("/", auth, async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

router.get("/:id/members", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  res.json({ members: group.members });
});

router.put("/:id/transfer-admin", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  const { newAdmin } = req.body;

  if (!group) return res.status(404).json({ message: "Group not found" });
  if (group.admin !== req.username) {
    return res.status(403).json({ message: "Only the current admin can transfer ownership" });
  }
  if (!group.members.includes(newAdmin)) {
    return res.status(400).json({ message: "New admin must be a member" });
  }

  group.admin = newAdmin;
  group.members = group.members.filter(user => user !== req.username); 
  await group.save();

  res.json({ message: "Ownership transferred", group });
});

router.delete("/:id", auth, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (group.admin !== req.username) {
    return res.status(403).json({ message: "Only the admin can delete the group" });
  }

  await Post.deleteMany({ group: group._id });

  await group.deleteOne();

  res.json({ message: "Group and related posts deleted" });
});


router.get("/my", auth, async (req, res) => {
  const groups = await Group.find({ members: req.username });
  res.json(groups);
});

router.get("/top-members", auth, async (req, res) => {
  const groups = await Group.aggregate([
    {
      $project: {
        name: 1,
        memberCount: { $size: "$members" }
      }
    },
    { $sort: { memberCount: -1 } },
    { $limit: 10 }
  ]);

  res.json(groups);
});


module.exports = router;
