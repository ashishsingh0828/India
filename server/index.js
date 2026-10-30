/* =====================================================================
   marble-websites API  —  Express + MongoDB (Mongoose)
   Public (websites):  /api/:site/projects | services | blogs | contact
   Admin  (JWT)     :  /api/admin/:site/...
   Auth             :  /api/auth/login | forgot-password | reset-password
   ===================================================================== */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const requireAuth = require("./middleware/auth");
const { site, SITES } = require("./middleware/guards");
const { UPLOADS } = require("./utils/files");

const app = express();
app.set("trust proxy", 1);
const corsOrigin = process.env.CORS_ORIGINS === "*" || !process.env.CORS_ORIGINS
  ? true
  : process.env.CORS_ORIGINS.split(",").map((s) => s.trim());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(UPLOADS, { maxAge: "7d" }));

const mongoose = require("mongoose");
app.get("/api/health", (req, res) => {
  const db = mongoose.connection.readyState === 1 ? "up" : "down";
  res.status(db === "up" ? 200 : 503).json({ ok: db === "up", db, sites: SITES });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin/:site", site, requireAuth, require("./routes/admin"));
app.use("/api/:site", site, require("./routes/public"));

app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: "That value already exists." });
  if (err.name === "ValidationError" || err.name === "CastError" || err.type === "entity.parse.failed") {
    return res.status(400).json({ message: err.type === "entity.parse.failed" ? "Invalid JSON body" : err.message });
  }
  if (err.name === "MongoServerSelectionError" || err.name === "MongooseError") {
    return res.status(503).json({ message: "Database is temporarily unavailable. Please try again in a moment." });
  }
  if (err.status || err.statusCode) return res.status(err.status || err.statusCode).json({ message: err.message || "Request failed" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

(async () => {
  const connected = await connectDB();
  if (connected) {
    try {
      await Admin.ensure();
    } catch (e) {
      console.warn("Admin ensure warning:", e.message);
    }
  }
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => console.log(`API ready  →  http://localhost:${PORT}   (sites: ${SITES.join(", ")})`));
})();
