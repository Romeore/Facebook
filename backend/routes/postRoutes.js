const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const Group = require("../models/Group");

router.post("/", auth, async (req, res) => {
  const { title, content, group } = req.body;
  console.log(req.body);
  const post = await Post.create({ title, content, author: req.username, group });
  console.log("Post:\r\n");
  console.log(post);
  res.status(201).json(post);
});

// api/posts
router.get("/", auth, async (req, res) => {
  const posts = await Post.find({ author: req.username });
  res.json(posts);
});

// Feed -> posts from all groups  
// api/posts/feed
router.get("/feed", auth, async (req, res) => {
  const groups = await Group.find({ members: req.username });
  const groupIds = groups.map(g => g._id);

  const posts = await Post.find({
    $or: [
      { group: { $in: groupIds } },
      { author: req.username }
    ]
  });

  res.json(posts);
});

module.exports = router;
