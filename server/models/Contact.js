const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    site: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, default: "", maxlength: 40 },
    company: { type: String, default: "", maxlength: 160 },
    address: { type: String, default: "", maxlength: 240 },
    subject: { type: String, default: "", maxlength: 160 },
    message: { type: String, required: true, maxlength: 4000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", schema);
