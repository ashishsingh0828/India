const mongoose = require("mongoose");

let connecting = null;
let memoryServer = null;

async function startLocalMongo() {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: "marbleDB" },
  });
  const uri = memoryServer.getUri("marbleDB");
  console.log("✓ Using local embedded MongoDB (ephemeral — fine for local login/uploads)");
  return uri;
}

async function tryConnect(uri) {
  if (!uri) {
    console.warn("⚠️  MONGO_URI is not set.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`✓ MongoDB connected  →  database "${mongoose.connection.name}"`);
    return true;
  } catch (e) {
    console.warn("\n⚠️  MongoDB connection failed:", e.message);
    return false;
  }
}

module.exports = async function connectDB() {
  if (mongoose.connection.readyState === 1) return true;
  if (connecting) return connecting;

  connecting = (async () => {
    const preferLocal = String(process.env.MONGO_LOCAL || "").toLowerCase() === "true";
    const isProd = process.env.NODE_ENV === "production";
    let uri = process.env.MONGO_URI;

    if (!preferLocal) {
      const ok = await tryConnect(uri);
      if (ok) return true;
      /* Never fall back to ephemeral Mongo on Render/production — data would vanish on restart */
      if (isProd) {
        console.error("❌ Production requires a working MONGO_URI (MongoDB Atlas). Local fallback disabled.");
        return false;
      }
      console.warn("👉 Falling back to local embedded MongoDB so login and uploads still work.");
      console.warn("   Set MONGO_LOCAL=true to skip Atlas, or fix MONGO_URI for Atlas.\n");
    }

    if (isProd && !preferLocal) return false;

    try {
      if (mongoose.connection.readyState !== 0) {
        try { await mongoose.disconnect(); } catch { /* ignore */ }
      }
      uri = await startLocalMongo();
      return await tryConnect(uri);
    } catch (e) {
      console.error("Could not start local MongoDB:", e.message);
      return false;
    }
  })().finally(() => { connecting = null; });

  return connecting;
};

module.exports.isReady = () => mongoose.connection.readyState === 1;
