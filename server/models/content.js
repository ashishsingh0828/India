/* Projects, Services and Blogs share one flexible schema.
   Only title / slug / site / published are fixed; every other field the admin form sends
   (images, headings, paragraphs …) is stored automatically (strict:false) —
   so adding a field in admin/src/config.js needs NO change here. */
const mongoose = require("mongoose");

function make(name) {
  const schema = new mongoose.Schema(
    {
      site: { type: String, required: true },
      title: { type: String, required: true, trim: true },
      slug: { type: String, required: true },
      published: { type: Boolean, default: true },
    },
    { strict: false, timestamps: true }
  );
  schema.index({ site: 1, slug: 1 }, { unique: true });
  schema.index({ site: 1, published: 1, createdAt: -1 });
  return mongoose.model(name, schema);
}

module.exports = { projects: make("Project"), services: make("Service"), blogs: make("Blog") };
