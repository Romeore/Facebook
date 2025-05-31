const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  admin: String,
  members: [String],
  pending: [String]
});

module.exports = mongoose.model("Group", groupSchema);