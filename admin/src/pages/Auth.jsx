import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { auth, MOCK } from "../api";
import { Icon, Brand } from "../components/ui";

function Shell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-brand">
        <Brand />
        <div className="auth-quote">
          <h2>Manage your projects, services and blog in one place.</h2>
          <p>Add content, upload images and publish to the India website in a few clicks.</p>
        </div>
        <small>© {new Date().getFullYear()} IE Marbles &amp; Traders · Admin</small>
      </div>
      <div className="auth-form">
        <div className="auth-card">
          <Brand className="auth-mobile-brand" />
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <label className="fld">
      <span className="fld-label">{label}</span>
      <span className="input-icon">
        <Icon n="lock" size={17} />
        <input type={show ? "text" : "password"} required minLength={6} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} placeholder="••••••••" />
        <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
          <Icon n={show ? "eyeoff" : "eye"} size={17} />
        </button>
      </span>
    </label>
  );
}

/* ---------------- Login ---------------- */
export function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  if (auth.isAuthed()) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try { await auth.login(f.email, f.password); nav("/"); }
    catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <Shell title="Welcome back" subtitle="Sign in to your admin panel">
      <form onSubmit={submit} className="stack">
        {MOCK && <div className="note"><Icon n="info" size={16} /> Demo login: <b>admin@marble.com</b> / <b>admin123</b></div>}
        {err && <div className="alert">{err}</div>}
        <label className="fld">
          <span className="fld-label">Username</span>
          <span className="input-icon">
            <Icon n="mail" size={17} />
            <input type="text" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Admin" />
          </span>
        </label>
        <PasswordInput label="Password" value={f.password} onChange={(v) => setF({ ...f, password: v })} autoComplete="current-password" />
        <div className="row-between">
          <span />
          <Link to="/forgot-password" className="link">Forgot password?</Link>
        </div>
        <button className="btn lg" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </Shell>
  );
}

/* ---------------- Forgot password ---------------- */
export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try { setDone(await auth.forgot(email)); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <Shell title="Forgot password?" subtitle="Enter your email and we’ll send you a reset link.">
      {done ? (
        <div className="stack">
          <div className="success"><Icon n="check" size={18} /> {done.message}</div>
          <p className="muted small">Check your inbox (and spam folder). The link expires after a short time.</p>
          {done.demoLink && <Link className="btn ghost" to={done.demoLink}>Demo: open the reset page</Link>}
          <Link to="/login" className="link center"><Icon n="left" size={14} /> Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="stack">
          {err && <div className="alert">{err}</div>}
          <label className="fld">
            <span className="fld-label">Email</span>
            <span className="input-icon">
              <Icon n="mail" size={17} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </span>
          </label>
          <button className="btn lg" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
          <Link to="/login" className="link center"><Icon n="left" size={14} /> Back to login</Link>
        </form>
      )}
    </Shell>
  );
}

/* ---------------- Reset password ---------------- */
const strength = (p) => [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

export function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const score = strength(pw);

  const submit = async (e) => {
    e.preventDefault();
    if (pw !== pw2) return setErr("Passwords do not match");
    setBusy(true);
    setErr("");
    try { await auth.reset(token, pw); setDone(true); setTimeout(() => nav("/login"), 2200); }
    catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <Shell title="Set a new password" subtitle="Choose a strong password you haven’t used before.">
      {done ? (
        <div className="stack">
          <div className="success"><Icon n="check" size={18} /> Password updated. Redirecting to login…</div>
          <Link to="/login" className="btn lg">Go to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="stack">
          {err && <div className="alert">{err}</div>}
          <PasswordInput label="New password" value={pw} onChange={setPw} autoComplete="new-password" />
          <div className="meter" data-score={score}><span /><span /><span /><span /></div>
          <small className="muted">Use 8+ characters with an uppercase letter, a number and a symbol.</small>
          <PasswordInput label="Confirm password" value={pw2} onChange={setPw2} autoComplete="new-password" />
          <button className="btn lg" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
          <Link to="/login" className="link center"><Icon n="left" size={14} /> Back to login</Link>
        </form>
      )}
    </Shell>
  );
}
