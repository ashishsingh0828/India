/* Public API used by the websites — mounted at /api/:site
   GET  /api/:site/projects | services | blogs        published items, newest first
   GET  /api/:site/<resource>/:slug                   one item + prev / next / related
   POST /api/:site/contact                            contact form                       */
const router = require("express").Router({ mergeParams: true });
const Contact = require("../models/Contact");
const limiter = require("../middleware/rateLimit");
const { resource } = require("../middleware/guards");
const { shape } = require("../utils/helpers");
const { sendContactNotice } = require("../utils/mail");

router.post("/contact", limiter(5, 60_000), async (req, res) => {
  const { name = "", email = "", phone = "", company = "", address = "", subject = "", message = "", website = "" } = req.body || {};
  if (website) return res.json({ ok: true }); // honeypot: bots fill the hidden field
  if (!String(name).trim() || !String(message).trim() || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Please enter your name, a valid email and a message." });
  const msg = await Contact.create({
    site: req.site,
    name: String(name).trim().slice(0, 120),
    email: String(email).trim().slice(0, 160),
    phone: String(phone).trim().slice(0, 40),
    company: String(company).trim().slice(0, 160),
    address: String(address).trim().slice(0, 240),
    subject: String(subject).trim().slice(0, 160),
    message: String(message).trim().slice(0, 4000),
  });
  sendContactNotice(req.site, msg).catch((e) => console.error("Could not send contact notification:", e.message));
  res.status(201).json({ ok: true, message: "Thanks! We'll get back to you soon." });
});

router.get("/:ep", resource, async (req, res) => {
  const rows = await req.Model.find({ site: req.site, published: true }).sort({ createdAt: -1 }).lean();
  res.json(rows.map(shape));
});

router.get("/:ep/:slug", resource, async (req, res) => {
  const rows = await req.Model.find({ site: req.site, published: true }).sort({ createdAt: -1 }).lean();
  const i = rows.findIndex((r) => r.slug === req.params.slug);
  if (i === -1) return res.status(404).json({ message: "Not found" });
  const n = rows.length;
  const brief = (r) => ({ title: r.title, slug: r.slug, image: r.image || r.imageA, imageA: r.imageA, imageB: r.imageB, category: r.category });
  res.json({
    ...shape(rows[i]),
    prev: n > 1 ? brief(rows[(i - 1 + n) % n]) : null,
    next: n > 1 ? brief(rows[(i + 1) % n]) : null,
    related: rows.filter((_, j) => j !== i).slice(0, 2).map(brief),
  });
});

module.exports = router;
