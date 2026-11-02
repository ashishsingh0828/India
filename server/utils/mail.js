/* Email helpers for India (IE Marbles).
   Priority:
   1) GMAIL_SCRIPT_URL — HTTPS Google Apps Script webhook (works on Render free; SMTP ports are blocked there)
   2) SMTP_HOST / SMTP_USER / SMTP_PASS
   3) Gmail SMTP via EMAIL_USER + EMAIL_PASS (16-letter App Password) — works locally / paid hosts
*/
const nodemailer = require("nodemailer");

const PLACEHOLDER = "abcdefghijklmnop";

function transport() {
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (EMAIL_USER && EMAIL_PASS && EMAIL_PASS !== PLACEHOLDER) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      connectionTimeout: 20_000,
      greetingTimeout: 20_000,
      socketTimeout: 30_000,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS.replace(/\s/g, "") },
    });
  }
  return null;
}

const from = () =>
  process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@localhost";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function buildContactPayload(site, m) {
  const to = process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER;
  const rows = [
    ["Website", site],
    ["Name", m.name],
    ["Email", m.email],
    ["Phone", m.phone],
    ["Company", m.company],
    ["Address", m.address],
    ["Subject", m.subject],
  ].filter(([, v]) => v);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${m.message}`;
  const html = `<table cellpadding="4">${rows
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-line">${esc(m.message)}</p>`;
  return {
    to,
    replyTo: m.email,
    fromName: "IE Marbles",
    subject: `New enquiry (${site}) from ${m.name}`,
    text,
    html,
  };
}

async function sendViaAppsScript(payload) {
  const url = process.env.GMAIL_SCRIPT_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}: ${body.slice(0, 200)}`);
  try {
    const parsed = JSON.parse(body);
    if (parsed && parsed.ok === false) throw new Error(parsed.error || "Apps Script rejected mail");
  } catch (e) {
    if (e instanceof SyntaxError) {
      /* plain-text OK responses are fine */
    } else {
      throw e;
    }
  }
  return true;
}

async function sendResetMail(to, link) {
  const payload = {
    to,
    subject: "Reset your admin password",
    text: `Reset your password: ${link}\n\nThis link expires in 30 minutes. If you didn't request it, ignore this email.`,
    html: `<p>Click to reset your admin password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 30 minutes.</p>`,
    fromName: "IE Marbles",
  };
  if (process.env.GMAIL_SCRIPT_URL) {
    await sendViaAppsScript(payload);
    console.log(`[mail] Password reset sent via Apps Script to ${to}`);
    return;
  }
  const t = transport();
  if (!t) return console.log(`\n[DEV] Password reset link for ${to}:\n${link}\n`);
  await t.sendMail({ from: from(), to, subject: payload.subject, text: payload.text, html: payload.html });
  console.log(`[mail] Password reset sent to ${to}`);
}

/* New contact-form message -> NOTIFICATION_EMAIL (India: iemarbletraders@gmail.com) */
async function sendContactNotice(site, m) {
  const payload = buildContactPayload(site, m);
  if (!payload.to) {
    console.warn(`[mail] Contact notice skipped (NOTIFICATION_EMAIL/EMAIL_USER missing). Site=${site}`);
    return false;
  }

  if (process.env.GMAIL_SCRIPT_URL) {
    await sendViaAppsScript(payload);
    console.log(`[mail] Contact notice sent via Apps Script to ${payload.to} (site=${site}, from=${m.email})`);
    return true;
  }

  const t = transport();
  if (!t) {
    console.warn(
      `[mail] Contact notice skipped (missing EMAIL_USER/EMAIL_PASS or GMAIL_SCRIPT_URL). Site=${site} from=${m.email}`
    );
    return false;
  }

  await t.sendMail({
    from: from(),
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
  console.log(`[mail] Contact notice sent to ${payload.to} (site=${site}, from=${m.email})`);
  return true;
}

module.exports = sendResetMail;
module.exports.sendContactNotice = sendContactNotice;
module.exports.transport = transport;
