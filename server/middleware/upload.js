const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const { UPLOADS } = require("../utils/files");

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (req, f, cb) => cb(null, crypto.randomUUID() + path.extname(f.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, f, cb) =>
    /^image\/(jpe?g|png|webp|gif|avif)$/.test(f.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed")),
}).any();

/* friendly JSON errors instead of an HTML error page */
module.exports = (req, res, next) =>
  upload(req, res, (err) => (err ? res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Image is larger than 5MB" : err.message }) : next()));
