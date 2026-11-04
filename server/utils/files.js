const fs = require("fs");
const path = require("path");

const UPLOADS = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOADS, { recursive: true });

/* Deletes a file we saved earlier ("/uploads/abc.jpg"); ignores external URLs */
const removeUpload = (url) => {
  if (typeof url !== "string" || !url.startsWith("/uploads/")) return;
  const name = path.basename(url);
  fs.unlink(path.join(UPLOADS, name), () => {});
  require("../models/Upload").deleteOne({ _id: name }).catch(() => {});
};
const discard = (files = []) => files.forEach((f) => fs.unlink(f.path, () => {}));

/* Keeps a copy of freshly uploaded files in MongoDB so they survive disk resets. */
async function persistUploads(files = []) {
  const Upload = require("../models/Upload");
  for (const f of files) {
    const data = await fs.promises.readFile(f.path);
    await Upload.updateOne({ _id: f.filename }, { $set: { mime: f.mimetype, data } }, { upsert: true });
  }
}

/* Express handler for /uploads/:file when the file is no longer on the (ephemeral) disk */
async function serveStoredUpload(req, res, next) {
  try {
    const name = path.basename(req.path);
    if (!name || name !== decodeURIComponent(req.path.replace(/^\//, ""))) return next();
    const doc = await require("../models/Upload").findById(name).lean();
    if (!doc) return next();
    res.set({ "Content-Type": doc.mime, "Cache-Control": "public, max-age=604800, immutable" });
    /* lean() hands back a BSON Binary (bytes in .buffer) or a plain Buffer, depending on the driver */
    const bytes = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data.buffer);
    res.send(bytes);
  } catch (e) {
    next(e);
  }
}

module.exports = { UPLOADS, removeUpload, discard, persistUploads, serveStoredUpload };
