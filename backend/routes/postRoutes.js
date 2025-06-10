const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const Group = require("../models/Group");
const User = require("../models/User");

router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author !== req.username)
      return res.status(403).json({ message: "Not authorized" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author !== req.username)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { title, content, group } = req.body;
  const post = await Post.create({ title, content, author: req.username, group });
  await User.updateOne({ username: req.username }, { $inc: { coins: 2 } });

  res.status(201).json(post);
});

router.get("/", auth, async (req, res) => {
  const posts = await Post.find({ author: req.headers.username }).populate("group", "name");
  res.json(posts);
});

router.get("/feed", auth, async (req, res) => {
  const { groupName, author, title } = req.query;

  const groups = await Group.find({ members: req.headers.username });
  const groupIds = groups.map(g => g._id);

  const filter = {
    $or: [
      { group: { $in: groupIds } },
      { author: req.username }
    ]
  };

  if (author) {
    filter.author = author;
  }

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  let posts = await Post.find(filter).populate("group", "name");

  if (groupName) {
    posts = posts.filter(p =>
      p.group?.name.toLowerCase().includes(groupName.toLowerCase())
    );
  }

  res.json(posts);
});

router.get("/stats", async (req, res) => {
  const stats = await Post.aggregate([
    {
      $group: {
        _id: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        day: "$_id.day",
        count: 1,
        _id: 0
      }
    },
    {
      $sort: { day: 1 }
    }
  ]);

  res.json(stats);
});

module.exports = router;
