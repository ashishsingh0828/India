const models = require("../models/content");

const SITES = (process.env.SITES || "india,australia").split(",").map((s) => s.trim()).filter(Boolean);

exports.SITES = SITES;
exports.site = (req, res, next) => {
  if (!SITES.includes(req.params.site)) return res.status(404).json({ message: "Unknown site" });
  req.site = req.params.site;
  next();
};
exports.resource = (req, res, next) => {
  const Model = Object.hasOwn(models, req.params.ep) ? models[req.params.ep] : null;
  if (!Model) return res.status(404).json({ message: "Unknown resource" });
  req.Model = Model;
  next();
};
