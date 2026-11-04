import { useCallback, useEffect, useState } from "react";
import { SITE } from "./config";

/* Empty in development (Vite proxy). Set VITE_API_URL in production. */
const normalizeApi = (u) => {
  if (!u) return "";
  let url = String(u).trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(url)) {
    if (!url.includes(".")) url = `${url}.onrender.com`;
    url = `https://${url}`;
  }
  return url;
};
export const API = normalizeApi(import.meta.env.VITE_API_URL ?? "");

/* "/uploads/x.jpg" -> API host; local /Images|/Image stay on the static site; absolute URLs left alone */
export const asset = (u) => {
  if (!u) return "";
  const s = String(u);
  if (/^(https?:|data:|blob:)/i.test(s)) return s;
  if (/^\/(Image|Images|images|img)\//i.test(s)) return s;
  return API + s;
};

export const siteImage = (u, fallback = "") => {
  if (!u || /unsplash\.com|picsum\.photos/i.test(u)) return fallback || "";
  return asset(u) || fallback || "";
};

/* ---------- text helpers (the admin stores multi-line text as plain strings) ---------- */
export const slugify = (s = "") => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
export const paras = (s) => String(s || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const ANS_RE = /^(?:ans(?:wer)?|a)\s*[-–—:]\s*(.+)$/i;
const NUM_Q_RE = /^\d+[.)]\s*(.+)$/;
/** Parse `Title | Text` or numbered `1. question` + `Ans - answer`. */
export const pairs = (s) => {
  const text = String(s || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];
  if (ANS_RE.test(text) || NUM_Q_RE.test((text.split("\n").find((l) => l.trim()) || ""))) {
    const out = [];
    let q = "";
    let a = "";
    const flush = () => { if (q.trim() && a.trim()) out.push([q.trim(), a.trim()]); q = ""; a = ""; };
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      const ans = t.match(ANS_RE);
      if (ans) { a = a ? `${a} ${ans[1].trim()}` : ans[1].trim(); continue; }
      const num = t.match(NUM_Q_RE);
      if (num) { flush(); q = num[1].trim(); continue; }
      if (a) a = `${a} ${t}`;
      else if (q) q = `${q} ${t}`;
      else {
        const i = t.indexOf("|");
        if (i >= 0) { flush(); out.push([t.slice(0, i).trim(), t.slice(i + 1).trim()]); }
        else q = t;
      }
    }
    flush();
    if (out.length) return out;
  }
  return lines(text).map((l) => {
    const i = l.indexOf("|");
    return i < 0 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }).filter(([a, b]) => a && b);
};
export const splitTags = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
export const youtubeId = (url = "") => (String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] || "";
export const fmtDate = (d) => {
  const t = new Date(d);
  return isNaN(t) ? String(d || "") : t.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

/* ---------- requests ---------- */
const sleep = (ms, signal) => new Promise((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => { clearTimeout(t); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
});

/* Render free web services sleep; the first request can fail (502/503/network) while the API wakes up.
   GETs retry a few times so the site shows live admin content instead of getting stuck on fallbacks. */
const RETRY_DELAYS = [1500, 3000, 5000, 8000, 12000];

async function request(path, options = {}) {
  const isGet = !options.method || options.method === "GET";
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(`${API}${path}`, {
        ...options,
        /* always read the latest admin content, never a cached copy */
        cache: isGet ? "no-store" : options.cache,
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        body: options.body && JSON.stringify(options.body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status });
      return data;
    } catch (error) {
      const retryable = isGet && error.name !== "AbortError" && (!error.status || error.status >= 502);
      if (!retryable || attempt >= RETRY_DELAYS.length) throw error;
      await sleep(RETRY_DELAYS[attempt], options.signal);
    }
  }
}

/* GET /api/<site>/<path> */
export const get = (path, signal) => request(`/api/${SITE}${path}`, { signal });

/* POST the contact form */
export const sendContact = (body) => request(`/api/${SITE}/contact`, { method: "POST", body });

/* const { data, loading, error, reload } = useApi("/services") */
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: !!path, error: null });
  const [n, setN] = useState(0);
  const reload = useCallback(() => setN((v) => v + 1), []);

  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    /* Clear previous item so detail pages don't keep old title/images while the new slug loads. */
    setState({ data: null, loading: true, error: null });
    get(path, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => error.name !== "AbortError" && setState({ data: null, loading: false, error }));
    return () => ctrl.abort();
  }, [path, n]);

  return { ...state, reload };
}
