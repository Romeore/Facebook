module.exports = (req, res, next) => {
  const current = req.app.get("loggedInUser").get();
  const user = req.headers.username;

  if (!user || user !== current) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.username = user;
  next();
};
