import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, MOCK, SITES, getSite, setSite } from "../api";
import { getResources, RESOURCE_KEYS } from "../config";
import { Icon, Brand } from "./ui";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const email = auth.email();
  const [site, setSiteState] = useState(getSite());

  const RESOURCES = getResources(site);
  const [, first, second] = pathname.split("/");
  const cfg = RESOURCES[first];
  const title = first === "contacts" ? "Messages" : !first ? "Dashboard" : cfg ? (second === "new" ? `New ${cfg.label}` : second ? `Edit ${cfg.label}` : cfg.plural) : "Dashboard";

  useEffect(() => { setOpen(false); setMenu(false); }, [pathname]);
  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => { auth.logout(); nav("/login"); };
  const switchSite = (s) => {
    if (s === site) return;
    setSite(s);
    setSiteState(s);
    if (first && first !== "contacts" && second) nav(`/${first}`); // an item id belongs to one site only
  };

  return (
    <div className="adm">
      <aside className={`adm-side ${open ? "is-open" : ""}`}>
        <Brand />

        <p className="side-label">Menu</p>
        <nav>
          <NavLink to="/" end><Icon n="dashboard" /> Dashboard</NavLink>
        </nav>

        <p className="side-label">Content</p>
        <nav>
          {RESOURCE_KEYS.map((k) => (
            <NavLink key={k} to={`/${k}`}><Icon n={RESOURCES[k].icon} /> {RESOURCES[k].plural}</NavLink>
          ))}
        </nav>

        <p className="side-label">Inbox</p>
        <nav>
          <NavLink to="/contacts"><Icon n="mail" /> Messages</NavLink>
        </nav>

        <button className="side-logout" onClick={logout}><Icon n="logout" /> Logout</button>
      </aside>
      {open && <div className="adm-overlay" onClick={() => setOpen(false)} />}

      <div className="adm-main">
        <header className="adm-head">
          <button className="icon-btn burger" onClick={() => setOpen(true)} aria-label="Open menu"><Icon n="menu" size={22} /></button>
          <h1>{title}</h1>
          {SITES.length > 1 && (
            <div className="site-switch" role="group" aria-label="Website">
              {SITES.map((s) => (
                <button key={s.key} className={site === s.key ? "on" : ""} onClick={() => switchSite(s.key)}>{s.label}</button>
              ))}
            </div>
          )}
          {MOCK && <span className="demo-chip" title="Data is saved in this browser only">Demo mode</span>}
          <a className="btn ghost sm view-site" href={SITES.find((s) => s.key === site)?.url} target="_blank" rel="noreferrer" title="Open this website in a new tab">
            <Icon n="eye" size={15} /> <span>View website</span>
          </a>
          <div className="user" ref={menuRef}>
            <button className="user-btn" onClick={() => setMenu((v) => !v)}>
              <span className="user-email">{email}</span>
              <span className="avatar">{email[0].toUpperCase()}</span>
            </button>
            {menu && (
              <div className="user-menu">
                <div className="user-menu-top"><b>Administrator</b><small>{email}</small></div>
                <button onClick={logout}><Icon n="logout" size={16} /> Logout</button>
              </div>
            )}
          </div>
        </header>
        <main className="adm-content" key={pathname + site}><Outlet /></main>
      </div>
    </div>
  );
}
