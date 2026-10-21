/* tiny in-memory limiter: max requests per IP per window */
module.exports = (max, windowMs) => {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const list = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);
    if (list.length >= max) return res.status(429).json({ message: "Too many attempts. Please try again in a minute." });
    list.push(now);
    hits.set(req.ip, list);
    next();
  };
};
