const fs = require("fs");
const path = require("path");

const UPLOADS = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOADS, { recursive: true });

/* Deletes a file we saved earlier ("/uploads/abc.jpg"); ignores external URLs */
const removeUpload = (url) => {
  if (typeof url === "string" && url.startsWith("/uploads/")) fs.unlink(path.join(UPLOADS, path.basename(url)), () => {});
};
const discard = (files = []) => files.forEach((f) => fs.unlink(f.path, () => {}));

module.exports = { UPLOADS, removeUpload, discard };
