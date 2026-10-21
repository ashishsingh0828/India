const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const limiter = require("../middleware/rateLimit");
const sendResetMail = require("../utils/mail");

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const secret = () => process.env.JWT_SECRET || "dev-secret-change-me";

router.post("/login", limiter(10, 60_000), async (req, res) => {
  const { email = "", password = "" } = req.body || {};
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: jwt.sign({ id: String(admin._id), email: admin.email }, secret(), { expiresIn: "7d" }), email: admin.email });
});

router.post("/forgot-password", limiter(5, 60_000), async (req, res) => {
  const { email = "" } = req.body || {};
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
  if (admin) {
    const token = crypto.randomBytes(32).toString("hex");
    admin.resetHash = sha(token);
    admin.resetExpires = new Date(Date.now() + 30 * 60_000);
    await admin.save();
    try { await sendResetMail(admin.email, `${process.env.ADMIN_URL || "http://localhost:3002"}/reset-password/${token}`); }
    catch (e) { console.error("Could not send reset email:", e.message); }
  }
  res.json({ message: "If that email exists, a reset link has been sent." }); // same answer either way
});

router.post("/reset-password", limiter(10, 60_000), async (req, res) => {
  const { token = "", password = "" } = req.body || {};
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  const admin = await Admin.findOne({ resetHash: sha(token), resetExpires: { $gt: new Date() } });
  if (!admin) return res.status(400).json({ message: "This reset link is invalid or has expired." });
  admin.passwordHash = bcrypt.hashSync(password, 10);
  admin.resetHash = undefined;
  admin.resetExpires = undefined;
  await admin.save();
  res.json({ message: "Password updated." });
});

module.exports = router;
