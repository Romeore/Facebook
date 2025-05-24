require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"));

let loggedInUser = "alice";

app.set("loggedInUser", {
  get: () => loggedInUser,
  set: (username) => { loggedInUser = username; },
  clear: () => { loggedInUser = null; }
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
