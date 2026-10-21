/* Email helpers.
   Uses SMTP_HOST/SMTP_USER/SMTP_PASS if set, otherwise Gmail via EMAIL_USER + EMAIL_PASS (16-letter App Password).
   Without valid settings nothing is sent and the content is printed in the terminal. */
const nodemailer = require("nodemailer");

const PLACEHOLDER = "abcdefghijklmnop";

function transport() {
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_USER && EMAIL_PASS && EMAIL_PASS !== PLACEHOLDER)
    return nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS.replace(/\s/g, "") } });
  return null;
}

const from = () => process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function sendResetMail(to, link) {
  const t = transport();
  if (!t) return console.log(`\n[DEV] Password reset link for ${to}:\n${link}\n`);
  await t.sendMail({
    from: from(),
    to,
    subject: "Reset your admin password",
    text: `Reset your password: ${link}\n\nThis link expires in 30 minutes. If you didn't request it, ignore this email.`,
    html: `<p>Click to reset your admin password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 30 minutes.</p>`,
  });
}

/* New contact-form message -> NOTIFICATION_EMAIL */
async function sendContactNotice(site, m) {
  const to = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  const t = transport();
  if (!t || !to) return;
  const rows = [["Website", site], ["Name", m.name], ["Email", m.email], ["Phone", m.phone], ["Company", m.company], ["Address", m.address], ["Subject", m.subject]]
    .filter(([, v]) => v);
  await t.sendMail({
    from: from(),
    to,
    replyTo: m.email,
    subject: `New enquiry (${site}) from ${m.name}`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${m.message}`,
    html: `<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("")}</table><p style="white-space:pre-line">${esc(m.message)}</p>`,
  });
}

module.exports = sendResetMail;
module.exports.sendContactNotice = sendContactNotice;
