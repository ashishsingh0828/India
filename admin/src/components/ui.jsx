import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { asset } from "../api";

/* ---------- Icons ---------- */
const P = {
  dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z",
  folder: "M3 6h6l2 2h10v11H3z",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  doc: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7",
  plus: "M12 5v14M5 12h14",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4",
  edit: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6",
  eyeoff: "M3 3l18 18M10 6a9 9 0 0112 6 12 12 0 01-3 4M6 8a12 12 0 00-4 4s4 7 10 7a9 9 0 004-1",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 018 0v3",
  menu: "M4 6h16M4 12h16M4 18h16",
  logout: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
  upload: "M12 16V5M7 10l5-5 5 5M5 19h14",
  check: "M5 12l5 5 9-10",
  close: "M6 6l12 12M18 6L6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  info: "M12 8h.01M11 12h1v5h1M12 3a9 9 0 100 18 9 9 0 000-18z",
};
export const Icon = ({ n, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className="ic" aria-hidden="true">
    <path d={P[n]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Brand ---------- */
export const BrandMark = ({ size = 36 }) => (
  <svg className="brand-mark" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <defs>
      <linearGradient id="adm-gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2D1" />
        <stop offset="40%" stopColor="#DFB76C" />
        <stop offset="70%" stopColor="#B38634" />
        <stop offset="100%" stopColor="#7E5818" />
      </linearGradient>
      <linearGradient id="adm-brown" x1="0%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#6B5340" />
        <stop offset="50%" stopColor="#4B3626" />
        <stop offset="100%" stopColor="#352418" />
      </linearGradient>
      <linearGradient id="adm-white" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#DCD9D3" />
      </linearGradient>
    </defs>
    <g transform="translate(1, 0)">
      {/* 1 */}
      <path d="M 23 15 L 28 10 L 37 18 L 37 85 L 26 85 L 26 27 Z" fill="url(#adm-gold)" opacity="0.95" />
      <polygon points="28,23 37,18 37,85 28,85" fill="url(#adm-brown)" />
      <line x1="37" y1="18" x2="37" y2="85" stroke="url(#adm-gold)" strokeWidth="1.2" />
      {/* E */}
      <polygon points="46,18 77,18 77,27 46,27" fill="url(#adm-brown)" />
      <polygon points="46,14 77,14 77,18 46,18" fill="url(#adm-gold)" />
      <polygon points="46,27 54,27 54,76 46,76" fill="url(#adm-brown)" />
      <polygon points="54,44 77,44 77,53 54,53" fill="url(#adm-brown)" />
      <polygon points="46,76 79,76 79,85 46,85" fill="url(#adm-brown)" />
      <polygon points="46,85 79,85 77,89 46,89" fill="url(#adm-gold)" />
      <polygon points="42,14 46,18 46,85 42,89" fill="url(#adm-gold)" />
      {/* Diagonal white facet */}
      <polygon points="46,35 54,27 68,40 61,48" fill="url(#adm-white)" />
      <polygon points="46,35 54,27 57,29 49,37" fill="url(#adm-gold)" />
      <polygon points="68,40 61,48 64,51 71,43" fill="url(#adm-gold)" />
    </g>
  </svg>
);
export const Brand = ({ className = "" }) => (
  <div className={`brand ${className}`}><BrandMark /> <span>IE Marbles<small>Admin Portal</small></span></div>
);

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = "ok") => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, message, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon n={t.type === "ok" ? "check" : "close"} size={16} /> {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Small pieces ---------- */
export const Spinner = ({ label = "Loading…" }) => (
  <div className="spinner-wrap"><span className="spinner" /> <span>{label}</span></div>
);

export const Badge = ({ ok, children }) => <span className={`badge ${ok ? "ok" : ""}`}>{children}</span>;

export const PageHeader = ({ title, subtitle, children }) => (
  <div className="page-head">
    <div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="page-head-actions">{children}</div>
  </div>
);

export function ConfirmModal({ open, title, text, confirmText = "Delete", busy, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="modal-back" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon"><Icon n="trash" size={22} /></div>
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn danger-solid" onClick={onConfirm} disabled={busy}>{busy ? "Deleting…" : confirmText}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Form fields ---------- */
export function ImageField({ label, value, onChange, required, error }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(false);
  const src = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : asset(value)), [value]);
  const take = (f) => f && f.type.startsWith("image/") && onChange(f);

  return (
    <div className={`fld ${error ? "has-err" : ""}`}>
      <span className="fld-label">{label}{required && <b> *</b>}</span>
      <div
        className={`drop ${drag ? "is-drag" : ""} ${src ? "has-img" : ""}`}
        onClick={() => input.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current.click()}
      >
        {src ? (
          <>
            <img src={src} alt="" />
            <span className="drop-actions" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn sm" onClick={() => input.current.click()}>Replace</button>
              <button type="button" className="btn sm danger-solid" onClick={() => onChange("")}>Remove</button>
            </span>
          </>
        ) : (
          <span className="drop-empty"><Icon n="upload" size={22} /><b>Click or drop an image</b><small>JPG, PNG, WEBP · up to 5MB</small></span>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { take(e.target.files[0]); e.target.value = ""; }} />
      {error && <em>{error}</em>}
    </div>
  );
}

export function FieldInput({ field, value, onChange, error }) {
  const { name, label, type = "text", options, rows = 4, help, placeholder, required } = field;
  if (type === "image") return <ImageField label={label} value={value} onChange={onChange} required={required} error={error} />;
  if (type === "switch")
    return (
      <label className="switch">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch-track"><span /></span>
        <span>{label}</span>
      </label>
    );
  return (
    <label className={`fld ${error ? "has-err" : ""}`}>
      <span className="fld-label">{label}{required && <b> *</b>}</span>
      {type === "textarea" ? (
        <textarea name={name} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : type === "select" ? (
        <select name={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          {value && !options.some((o) => o.value === value) && <option value={value}>{value}</option>}
        </select>
      ) : (
        <input name={name} type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {help && !error && <small>{help}</small>}
      {error && <em>{error}</em>}
    </label>
  );
}
