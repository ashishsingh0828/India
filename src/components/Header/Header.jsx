import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApi } from "../../api";
import { BRAND } from "../../config";
import Logo from "../Logo/Logo";
import "./Header.css";

const icons = {
  chevronDown: "M6 9l6 6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M7 7h10v10",
  close: "M6 6l12 12M18 6 6 18",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
};

function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name] || icons.arrow} />
    </svg>
  );
}

export default function Header() {
  const navRef = useRef(null);
  const { pathname } = useLocation();
  const services = useApi("/services").data || [];
  const [stuck, setStuck] = useState(false);
  const [openTop, setOpenTop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/", end: true },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "All Architectural Services", href: "/services" },
        ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
      ],
    },
    { label: "Projects", href: "/projects" },
    { label: "Journal", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  const closeAll = useCallback(() => {
    setOpenTop(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 35);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e) =>
      navRef.current && !navRef.current.contains(e.target) && setOpenTop(null);
    const onKeyDown = (e) => e.key === "Escape" && closeAll();
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeAll]);

  useEffect(() => {
    const onResize = () => window.innerWidth > 1024 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isSection = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`header-section${stuck ? " is-stuck" : ""}`}>
      {/* ----------------- Sleek Concierge Strip ----------------- */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          <div className="header-topbar-left">
            <span className="header-topbar-item">
              <Icon name="pin" className="header-topbar-icon" />
              <span>{BRAND.address}</span>
            </span>
            <span className="header-topbar-sep" aria-hidden="true">•</span>
            <span className="header-topbar-item">
              <Icon name="clock" className="header-topbar-icon" />
              <span>{BRAND.hours}</span>
            </span>
          </div>

          <div className="header-topbar-right">
            <a href={BRAND.phoneHref} className="header-topbar-item">
              <Icon name="phone" className="header-topbar-icon" />
              <span>{BRAND.phone}</span>
            </a>
            <span className="header-topbar-sep" aria-hidden="true">•</span>
            <a href={`mailto:${BRAND.email}`} className="header-topbar-item">
              <Icon name="mail" className="header-topbar-icon" />
              <span>{BRAND.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ----------------- Main Luxury Navigation Bar ----------------- */}
      <div className="header-bar">
        <div className="header-inner">
          <Logo />

          <nav
            ref={navRef}
            className={`header-nav${mobileOpen ? " is-open" : ""}`}
            aria-label="Primary"
          >
            <div className="header-nav-head">
              <Logo />
              <button
                type="button"
                className="header-nav-close"
                aria-label="Close menu"
                onClick={closeAll}
              >
                <Icon name="close" />
              </button>
            </div>

            <ul className="header-menu">
              {menuItems.map((item, index) => {
                const isOpen = openTop === index;
                const cls = [
                  "header-item",
                  isOpen && "is-open",
                  isSection(item.href) && "is-current",
                ]
                  .filter(Boolean)
                  .join(" ");

                if (!item.children) {
                  return (
                    <li className={cls} key={item.label}>
                      <NavLink to={item.href} end={item.end} className="header-link">
                        <span>{item.label}</span>
                        <span className="header-link-line" aria-hidden="true" />
                      </NavLink>
                    </li>
                  );
                }

                return (
                  <li
                    className={cls}
                    key={item.label}
                    onMouseEnter={() => window.innerWidth > 1024 && setOpenTop(index)}
                    onMouseLeave={() => window.innerWidth > 1024 && setOpenTop(null)}
                  >
                    <button
                      type="button"
                      className="header-link"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onClick={() => setOpenTop(isOpen ? null : index)}
                    >
                      <span>{item.label}</span>
                      <Icon name="chevronDown" className="header-link-chevron" />
                      <span className="header-link-line" aria-hidden="true" />
                    </button>
                    <ul className="header-dropdown">
                      <li className="header-dropdown-heading">
                        <span>Architectural Slabs &amp; Services</span>
                      </li>
                      {item.children.map((child) => (
                        <li className="header-subitem" key={child.href}>
                          <NavLink to={child.href} end className="header-sublink">
                            <span>{child.label}</span>
                            <Icon name="arrow" className="header-sublink-arrow" />
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div className="header-nav-footer">
              <Link to="/contact" className="ie-btn header-mobile-cta" onClick={closeAll}>
                <span>Enquire</span>
                <span className="ie-btn-arrow">&rarr;</span>
              </Link>
            </div>
          </nav>

          {/* Right Action: Square Hover Button */}
          <div className="header-actions">
            <Link to="/contact" className="ie-btn header-cta">
              <span>Request a Quote</span>
              <span className="ie-btn-arrow">&rarr;</span>
            </Link>

            <button
              type="button"
              className="header-burger"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`header-backdrop${mobileOpen ? " is-active" : ""}`}
        onClick={closeAll}
        aria-hidden="true"
      />
    </header>
  );
}
