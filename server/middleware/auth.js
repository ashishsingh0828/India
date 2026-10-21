const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    req.admin = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), process.env.JWT_SECRET || "dev-secret-change-me");
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
