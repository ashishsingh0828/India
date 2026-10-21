const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️  MONGO_URI is not set in server/.env.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✓ MongoDB connected  →  database "${mongoose.connection.name}"`);
    return true;
  } catch (e) {
    console.warn("\n⚠️  MongoDB Atlas Connection Warning:", e.message);
    console.warn("👉 Action needed in MongoDB Atlas (cloud.mongodb.com):");
    console.warn("   Go to 'Network Access' → click 'Add IP Address' → choose 'Allow Access From Anywhere (0.0.0.0/0)'");
    console.warn("   The API server will continue running and auto-reconnect when network access is granted.\n");
    return false;
  }
};
