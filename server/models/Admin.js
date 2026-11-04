const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetHash: String,
    resetExpires: Date,
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", schema);

/* Creates or updates admin accounts from .env */
Admin.ensure = async () => {
  const pairs = [
    [process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD],
    [process.env.ADMIN_EMAIL_2, process.env.ADMIN_PASSWORD_2],
  ].filter(([email, password]) => email && password);
  /* No credentials in the environment: fall back to each site's documented login (never lock the admin out). */
  if (!pairs.length) {
    const sites = (process.env.SITES || "india,australia").split(",").map((s) => s.trim());
    if (sites.includes("australia")) pairs.push(["admin", "ksd@123"]);
    if (sites.includes("india")) pairs.push(["ie", "iemarbles@123"]);
  }
  for (const [rawEmail, password] of pairs) {
    const email = String(rawEmail).trim().toLowerCase();
    const passwordHash = bcrypt.hashSync(password, 10);
    const existing = await Admin.findOne({ email });
    if (!existing) {
      await Admin.create({ email, passwordHash });
      console.log(`Admin account created  →  ${email}`);
    } else {
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log(`Admin account ready  →  ${email}`);
    }
  }
};

module.exports = Admin;
