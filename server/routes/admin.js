/* Admin API (JWT required) — mounted at /api/admin/:site */
const router = require("express").Router({ mergeParams: true });
const Contact = require("../models/Contact");
const withUpload = require("../middleware/upload");
const { resource } = require("../middleware/guards");
const { discard, removeUpload } = require("../utils/files");
const { uniqueSlug, apply, shape, isId } = require("../utils/helpers");

const notFound = (res, what = "Item") => res.status(404).json({ message: `${what} not found` });

/* ---------- contact messages ---------- */
router.get("/contacts", async (req, res) => {
  res.json((await Contact.find({ site: req.site }).sort({ createdAt: -1 }).lean()).map(shape));
});
router.put("/contacts/:id", async (req, res) => {
  if (!isId(req.params.id)) return notFound(res, "Message");
  const m = await Contact.findOneAndUpdate({ _id: req.params.id, site: req.site }, { read: !!req.body.read });
  m ? res.json({ ok: true }) : notFound(res, "Message");
});
router.delete("/contacts/:id", async (req, res) => {
  if (!isId(req.params.id)) return notFound(res, "Message");
  await Contact.deleteOne({ _id: req.params.id, site: req.site });
  res.json({ ok: true });
});

/* ---------- projects | services | blogs ---------- */
router.get("/:ep", resource, async (req, res) => {
  res.json((await req.Model.find({ site: req.site }).sort({ updatedAt: -1 }).lean()).map(shape));
});

router.get("/:ep/:id", resource, async (req, res) => {
  if (!isId(req.params.id)) return notFound(res);
  const item = await req.Model.findOne({ _id: req.params.id, site: req.site }).lean();
  item ? res.json(shape(item)) : notFound(res);
});

router.post("/:ep", resource, withUpload, async (req, res) => {
  const data = apply({}, req.body, req.files);
  if (!String(data.title || "").trim()) {
    discard(req.files);
    return res.status(400).json({ message: "Title is required" });
  }
  data.slug = await uniqueSlug(req.Model, req.site, data.title);
  const doc = await req.Model.create({ ...data, site: req.site });
  res.status(201).json(shape(doc.toObject()));
});

router.put("/:ep/:id", resource, withUpload, async (req, res) => {
  if (!isId(req.params.id)) { discard(req.files); return notFound(res); }
  const old = await req.Model.findOne({ _id: req.params.id, site: req.site }).lean();
  if (!old) { discard(req.files); return notFound(res); }

  const next = apply(old, req.body, req.files);
  if (next.title !== old.title) next.slug = await uniqueSlug(req.Model, req.site, next.title, old._id);
  const { _id, site, createdAt, updatedAt, __v, ...set } = next;

  const doc = await req.Model.findOneAndUpdate({ _id: old._id }, { $set: set }, { new: true }).lean();
  res.json(shape(doc));
});

router.delete("/:ep/:id", resource, async (req, res) => {
  if (!isId(req.params.id)) return notFound(res);
  const old = await req.Model.findOneAndDelete({ _id: req.params.id, site: req.site }).lean();
  if (!old) return notFound(res);
  Object.values(old).forEach(removeUpload);
  res.json({ ok: true });
});

module.exports = router;
