/* =====================================================================
   API LAYER — the ONLY file that talks to data.
   VITE_USE_MOCK=true  -> demo data saved in the browser (no backend)
   VITE_USE_MOCK=false -> real REST API (contract below)

   AUTH
     POST /api/auth/login            { email, password }      -> { token, email }
     POST /api/auth/forgot-password  { email }                -> { message }
     POST /api/auth/reset-password   { token, password }      -> { message }

   CONTENT  (send "Authorization: Bearer <token>"; site = india | australia; ep = projects | services | blogs)
     GET    /api/admin/:site/:ep            -> [ item ]
     GET    /api/admin/:site/:ep/:id        -> item
     POST   /api/admin/:site/:ep            (multipart/form-data) -> item
     PUT    /api/admin/:site/:ep/:id        (multipart/form-data) -> item
     DELETE /api/admin/:site/:ep/:id        -> { ok: true }
   MESSAGES (contact form submissions)
     GET    /api/admin/:site/contacts       -> [ message ]
     PUT    /api/admin/:site/contacts/:id   { read: true|false }
     DELETE /api/admin/:site/contacts/:id
   item = { id | _id, title, slug, published, createdAt, updatedAt, ...fields, image urls }
   Image fields arrive as a File (new upload), a URL string (unchanged) or "" (removed).
   ===================================================================== */

// Empty = same origin (Vite proxies /api and /uploads to port 5050). Set VITE_API_URL in production.
const normalizeUrl = (u) => {
  if (!u) return "";
  let url = String(u).trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(url)) {
    if (!url.includes(".")) url = `${url}.onrender.com`;
    url = `https://${url}`;
  }
  return url;
};

export const BASE = normalizeUrl(import.meta.env.VITE_API_URL ?? "");
export const MOCK = import.meta.env.VITE_USE_MOCK === "true";

/* Which website's content is being edited. Every item is stored with its site key, so the two websites never share data. */
const LOCKED_SITE = import.meta.env.VITE_SITE || "";
export const SITES = LOCKED_SITE
  ? [{ key: LOCKED_SITE, label: LOCKED_SITE === "australia" ? "KSD Homes" : "IE Marbles", url: LOCKED_SITE === "australia" ? (normalizeUrl(import.meta.env.VITE_AUSTRALIA_URL) || "http://localhost:3001") : (normalizeUrl(import.meta.env.VITE_INDIA_URL) || "http://localhost:3000") }]
  : [
    { key: "india", label: "India", url: normalizeUrl(import.meta.env.VITE_INDIA_URL) || "http://localhost:3000" },
    { key: "australia", label: "Australia", url: normalizeUrl(import.meta.env.VITE_AUSTRALIA_URL) || "http://localhost:3001" },
  ];
export const getSite = () => LOCKED_SITE || (SITES.some((s) => s.key === localStorage.getItem("admin_site")) ? localStorage.getItem("admin_site") : SITES[0].key);
export const setSite = (s) => localStorage.setItem("admin_site", s);
const S = getSite;

export const asset = (u) => (!u ? "" : /^(https?:|data:|blob:)/.test(u) ? u : BASE + u);
export const idOf = (item) => item.id || item._id;

const sleep = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const slugify = (s = "") => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const LS = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch { throw new Error("Browser storage is full. Use smaller images, or connect the backend."); }
  },
};

/* ---------------- real HTTP ---------------- */
async function http(path, { method = "GET", body } = {}) {
  const isForm = body instanceof FormData;
  const t = localStorage.getItem("admin_token");
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { ...(t && { Authorization: `Bearer ${t}` }), ...(body && !isForm && { "Content-Type": "application/json" }) },
    body: body && (isForm ? body : JSON.stringify(body)),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && t && !path.startsWith("/auth")) { auth.logout(); window.location.href = "/login"; }
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

const SKIP = ["id", "_id", "slug", "createdAt", "updatedAt", "__v"];
function toFormData(values) {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (SKIP.includes(k)) return;
    fd.append(k, v instanceof File ? v : v == null ? "" : v);
  });
  return fd;
}

/* ---------------- mock data ---------------- */
const pic = (s) => `https://picsum.photos/seed/${s}/800/600`;
const SEEDS = {
  projects: [
    ["Statuario Grand Villa Living & Entryway", "Natural Marble"],
    ["Calacatta Gold Bookmatched Bath Suite", "Luxury Stone"],
    ["Emperador Dark & Crema Foyer", "Marble Flooring"],
    ["Nero Marquina Monolithic Waterfall Island", "Kitchen Stone"],
  ],
  services: [
    ["Marble Flooring & Dry-Lay"],
    ["Architectural Wall Cladding"],
    ["Countertops & Vanities"],
    ["Custom Staircases & Medallions"],
  ],
  blogs: [
    ["Statuario vs Calacatta Marble: The Selection Guide", "Marble Guides"],
    ["Honed vs Polished: Selecting the Ideal Stone Finish", "Architecture"],
    ["The Art of Bookmatching: Turning Marble into Art", "Stone Craft"],
    ["Maintaining & Sealing Natural Marble Surfaces", "Stone Care"],
  ],
};
const seed = (ep) =>
  SEEDS[ep].map(([title, category], i) => {
    const when = new Date(Date.now() - i * 86400000 * 3).toISOString();
    return {
      id: `${ep}-${i + 1}`, title, slug: slugify(title), category: category || "", author: "admin",
      image: pic(`${S()}-${ep}-${i}-a`), imageA: pic(`${S()}-${ep}-${i}-a`), imageB: pic(`${S()}-${ep}-${i}-b`), heroImage: pic(`${S()}-${ep}-${i}-h`),
      published: i !== 3, createdAt: when, updatedAt: when,
    };
  });
const fileToUrl = (f) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });
const key = (ep) => `adm_mock_${S()}_${ep}`;
const readAll = (ep) => { let d = LS.get(key(ep), null); if (!d) { d = seed(ep); LS.set(key(ep), d); } return d; };

async function prepare(values) {
  const out = {};
  for (const [k, v] of Object.entries(values)) out[k] = v instanceof File ? await fileToUrl(v) : v;
  return out;
}

/* ---------------- content ---------------- */
export const resource = (ep) => ({
  async list() {
    if (!MOCK) return http(`/admin/${S()}/${ep}`);
    await sleep();
    return readAll(ep).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },
  async get(id) {
    if (!MOCK) return http(`/admin/${S()}/${ep}/${id}`);
    await sleep(200);
    const it = readAll(ep).find((x) => idOf(x) === id);
    if (!it) throw new Error("Item not found");
    return it;
  },
  async create(values) {
    if (!MOCK) return http(`/admin/${S()}/${ep}`, { method: "POST", body: toFormData(values) });
    await sleep(500);
    const all = readAll(ep);
    const now = new Date().toISOString();
    const item = { ...(await prepare(values)), id: `${ep}-${Date.now()}`, slug: slugify(values.title), author: "admin", createdAt: now, updatedAt: now };
    LS.set(key(ep), [item, ...all]);
    return item;
  },
  async update(id, values) {
    if (!MOCK) return http(`/admin/${S()}/${ep}/${id}`, { method: "PUT", body: toFormData(values) });
    await sleep(500);
    const all = readAll(ep);
    const data = await prepare(values);
    const next = all.map((x) => (idOf(x) === id ? { ...x, ...data, slug: slugify(values.title), updatedAt: new Date().toISOString() } : x));
    LS.set(key(ep), next);
    return next.find((x) => idOf(x) === id);
  },
  async remove(id) {
    if (!MOCK) return http(`/admin/${S()}/${ep}/${id}`, { method: "DELETE" });
    await sleep(350);
    LS.set(key(ep), readAll(ep).filter((x) => idOf(x) !== id));
    return { ok: true };
  },
});

/* ---------------- auth ---------------- */
const DEMO_EMAIL = "admin@marble.com";
export const auth = {
  isAuthed: () => !!localStorage.getItem("admin_token"),
  email: () => localStorage.getItem("admin_email") || "admin",
  logout() { localStorage.removeItem("admin_token"); localStorage.removeItem("admin_email"); },
  async login(email, password) {
    let d;
    if (MOCK) {
      await sleep(600);
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== LS.get("adm_mock_pw", "admin123")) throw new Error("Invalid email or password");
      d = { token: "demo-token", email: DEMO_EMAIL };
    } else d = await http("/auth/login", { method: "POST", body: { email, password } });
    localStorage.setItem("admin_token", d.token);
    localStorage.setItem("admin_email", d.email);
    return d;
  },
  async forgot(email) {
    if (!MOCK) return http("/auth/forgot-password", { method: "POST", body: { email } });
    await sleep(700);
    return { message: "If that email exists, a reset link has been sent.", demoLink: "/reset-password/demo-token" };
  },
  async reset(token, password) {
    if (!MOCK) return http("/auth/reset-password", { method: "POST", body: { token, password } });
    await sleep(700);
    if (token !== "demo-token") throw new Error("This reset link is invalid or has expired.");
    LS.set("adm_mock_pw", password);
    return { message: "Password updated." };
  },
};

/* ---------------- contact messages ---------------- */
const mkMsgs = () => [
  ["Aarav Mehta", "aarav@example.com", "+91 98765 43210", "Marble flooring quote", "Hi, I would like a quote for 1,200 sq ft of Italian marble flooring for my villa. Can you share rates and timelines?"],
  ["Sophie Turner", "sophie@example.com", "", "Kitchen benchtop", "Do you supply and install marble kitchen benchtops? I would love to book a site visit next week."],
  ["Rahul Verma", "rahul@example.com", "+91 91234 56789", "Bulk order", "We are an interior firm looking for a long-term marble supplier. Please call me back."],
].map(([name, email, phone, subject, message], i) => ({
  id: `msg-${i + 1}`, name, email, phone, subject, message, read: i === 2,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));
const mkey = () => `adm_mock_${S()}_contacts`;
const readMsgs = () => { let d = LS.get(mkey(), null); if (!d) { d = mkMsgs(); LS.set(mkey(), d); } return d; };

export const contacts = {
  async list() {
    if (!MOCK) return http(`/admin/${S()}/contacts`);
    await sleep();
    return readMsgs().sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt));
  },
  async setRead(id, read) {
    if (!MOCK) return http(`/admin/${S()}/contacts/${id}`, { method: "PUT", body: { read } });
    LS.set(mkey(), readMsgs().map((m) => (m.id === id ? { ...m, read } : m)));
    return { ok: true };
  },
  async remove(id) {
    if (!MOCK) return http(`/admin/${S()}/contacts/${id}`, { method: "DELETE" });
    await sleep(250);
    LS.set(mkey(), readMsgs().filter((m) => m.id !== id));
    return { ok: true };
  },
};
