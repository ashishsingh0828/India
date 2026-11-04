/* Durable copy of every admin-uploaded image.
   Render free web services have an EPHEMERAL disk: files in /uploads vanish on every restart / redeploy,
   which left the website pointing at images that no longer existed. The bytes are therefore also kept in
   MongoDB and served from there whenever the file is missing on disk. (Max 5 MB each, see middleware/upload.js) */
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // the file name, e.g. "3f2a….jpg"
    mime: { type: String, default: "application/octet-stream" },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Upload || mongoose.model("Upload", schema);
