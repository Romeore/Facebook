const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);