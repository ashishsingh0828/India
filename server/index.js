/* =====================================================================
   marble-websites API  —  Express + MongoDB (Mongoose)
   Public (websites):  /api/:site/projects | services | blogs | contact
   Admin  (JWT)     :  /api/admin/:site/...
   Auth             :  /api/auth/login | forgot-password | reset-password
   IE Marbles production API (Render free — wakes on HTTPS request)
   ===================================================================== */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const requireAuth = require("./middleware/auth");
const { site, SITES } = require("./middleware/guards");
const { UPLOADS, serveStoredUpload } = require("./utils/files");

const app = express();
app.set("trust proxy", 1);

/* CORS: comma-separated origins in CORS_ORIGINS, or "*" / empty = reflect any origin */
const rawCors = (process.env.CORS_ORIGINS || "").trim();
const corsOrigins =
  !rawCors || rawCors === "*"
    ? true
    : rawCors.split(",").map((s) => s.trim()).filter(Boolean);
const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
/* API responses are live admin content: never let a browser/CDN serve a stale copy. */
app.use("/api", (req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
app.use("/uploads", express.static(UPLOADS, { maxAge: "7d", dotfiles: "ignore", index: false }));
/* disk is ephemeral on Render: fall back to the copy stored in MongoDB */
app.use("/uploads", serveStoredUpload);

const mongoose = require("mongoose");
app.get("/api/health", async (req, res) => {
  const db = mongoose.connection.readyState === 1 ? "up" : "down";
  let counts = null;
  if (db === "up") {
    try {
      const models = require("./models/content");
      counts = {};
      for (const site of SITES) {
        counts[site] = {
          projects: await models.projects.countDocuments({ site }),
          services: await models.services.countDocuments({ site }),
          blogs: await models.blogs.countDocuments({ site }),
        };
      }
    } catch { /* ignore */ }
  }
  res.status(db === "up" ? 200 : 503).json({
    status: "ok",
    db,
    ok: db === "up",
    sites: SITES,
    counts,
    seedForce: String(process.env.SEED_FORCE || "").toLowerCase() === "true",
  });
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
    /* Fill empty collections with the same India/Australia content the frontends use as fallbacks. */
    try {
      const { runSeed } = require("./scripts/seed");
      /* SEED_FORCE wipes admin-managed content and re-creates the sample data, so it is ignored in production
         (it used to run on every Render restart and erase admin edits). Use `npm run seed:force` on purpose.
         Throw-away local/in-memory Mongo (MONGO_LOCAL=true) is always re-seeded. */
      const isProd = process.env.NODE_ENV === "production";
      const wantsForce = String(process.env.SEED_FORCE || "").toLowerCase() === "true";
      const force =
        String(process.env.MONGO_LOCAL || "").toLowerCase() === "true" ||
        (wantsForce && (!isProd || String(process.env.ALLOW_DESTRUCTIVE_SEED || "").toLowerCase() === "true"));
      if (wantsForce && !force) console.warn("SEED_FORCE ignored in production (set ALLOW_DESTRUCTIVE_SEED=true to override).");
      console.log(`Seed on boot (force=${force})…`);
      await runSeed({ force, disconnect: false });
    } catch (e) {
      console.error("Seed on boot failed:", e);
    }
  }
  const PORT = Number(process.env.PORT) || 4001;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API ready → http://0.0.0.0:${PORT}  (sites: ${SITES.join(", ")})`);
  });
})();
