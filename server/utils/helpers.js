const mongoose = require("mongoose");
const { removeUpload } = require("./files");

const slugify = (s = "") =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item";

async function uniqueSlug(Model, site, title, ignoreId) {
  const base = slugify(title);
  let slug = base, n = 1;
  for (;;) {
    const q = { site, slug };
    if (ignoreId) q._id = { $ne: ignoreId };
    if (!(await Model.exists(q))) return slug;
    slug = `${base}-${++n}`;
  }
}

const BLOCKED = new Set(["id", "_id", "site", "slug", "createdAt", "updatedAt", "__v"]);
const badKey = (k) => BLOCKED.has(k) || k.startsWith("$") || k.startsWith("__") || k.includes(".");

/* Merge a form submission (text fields + uploaded files) into an item.
   - uploaded file  -> replaces that image, old file is deleted
   - field sent ""  -> image removed, old file is deleted
   - field unchanged-> kept                                                  */
function apply(item, body = {}, files = []) {
  const out = { ...item };
  for (const [k, v] of Object.entries(body)) {
    if (badKey(k)) continue;
    const val = k === "published" ? String(v) === "true" : typeof v === "string" ? v.replace(/\r\n/g, "\n") : v; // multipart turns \n into \r\n
    if (out[k] && out[k] !== val) removeUpload(out[k]);
    out[k] = val;
  }
  for (const f of files) {
    if (badKey(f.fieldname)) continue;
    removeUpload(out[f.fieldname]);
    out[f.fieldname] = `/uploads/${f.filename}`;
  }
  return out;
}

/* lean mongo doc -> API item (_id becomes id) */
const shape = (d) => {
  const { _id, __v, ...rest } = d;
  return { id: String(_id), ...rest };
};
const isId = (id) => mongoose.isValidObjectId(id);

module.exports = { slugify, uniqueSlug, apply, shape, isId };
