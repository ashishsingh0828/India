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

/* "/uploads/x.jpg" -> full image address; local /Images and absolute URLs stay as-is */
export const asset = (u) => {
  if (!u) return "";
  const s = String(u);
  if (/^(https?:|data:|blob:)/i.test(s)) return s;
  if (s.startsWith("/Images/") || s.startsWith("/images/")) return s;
  return API + s;
};

/* ---------- text helpers (the admin stores multi-line text as plain strings) ---------- */
export const slugify = (s = "") => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
export const paras = (s) => String(s || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
export const pairs = (s) => lines(s).map((l) => { const i = l.indexOf("|"); return i < 0 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; });
export const splitTags = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
export const youtubeId = (url = "") => (String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] || "";
export const fmtDate = (d) => {
  const t = new Date(d);
  return isNaN(t) ? String(d || "") : t.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

/* ---------- requests ---------- */
async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body && JSON.stringify(options.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status });
  return data;
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
    setState((s) => ({ ...s, loading: true, error: null }));
    get(path, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => error.name !== "AbortError" && setState({ data: null, loading: false, error }));
    return () => ctrl.abort();
  }, [path, n]);

  return { ...state, reload };
}
