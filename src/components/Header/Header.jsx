import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApi } from "../../api";
import Logo from "../Logo/Logo";
import "./Header.css";

const icons = {
  chevronDown: "M6 9l6 6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  close: "M6 6l12 12M18 6 6 18",
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

function MenuList({ menuItems, pathname, openTop, setOpenTop, desktop }) {
  const isSection = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
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
            onMouseEnter={() => desktop && setOpenTop(index)}
            onMouseLeave={() => desktop && setOpenTop(null)}
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
  );
}

export default function Header() {
  const desktopNavRef = useRef(null);
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
    const onPointerDown = (e) => {
      if (window.innerWidth <= 1024) return;
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target)) setOpenTop(null);
    };
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
    const onResize = () => {
      if (window.innerWidth > 1024) setMobileOpen(false);
      else setOpenTop(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const stuckCls = stuck ? " is-stuck" : "";

  return (
    <>
      <header className={`header-section header-desktop${stuckCls}`}>
        <div className="header-bar">
          <div className="header-inner">
            <Logo />
            <nav ref={desktopNavRef} className="header-nav" aria-label="Primary">
              <MenuList
                menuItems={menuItems}
                pathname={pathname}
                openTop={openTop}
                setOpenTop={setOpenTop}
                desktop
              />
            </nav>
            <div className="header-actions">
              <Link to="/contact" className="ie-btn header-cta">
                <span>Discuss a Project</span>
                <span className="ie-btn-arrow">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <header className={`header-section header-mobile${stuckCls}`}>
        <div className="header-bar">
          <div className="header-inner">
            <Logo />
            <button
              type="button"
              className={`header-burger${mobileOpen ? " is-open" : ""}`}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              onClick={() => {
                setOpenTop(null);
                setMobileOpen((open) => !open);
              }}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {createPortal(
        <>
          <div
            className={`header-backdrop${mobileOpen ? " is-active" : ""}`}
            onClick={closeAll}
            aria-hidden="true"
          />
          <nav
            className={`header-nav header-nav--drawer${mobileOpen ? " is-open" : ""}`}
            aria-label="Mobile"
            aria-hidden={!mobileOpen}
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
            <MenuList
              menuItems={menuItems}
              pathname={pathname}
              openTop={openTop}
              setOpenTop={setOpenTop}
              desktop={false}
            />
            <div className="header-nav-footer">
              <Link to="/contact" className="ie-btn header-mobile-cta" onClick={closeAll}>
                <span>Discuss a Project</span>
                <span className="ie-btn-arrow">&rarr;</span>
              </Link>
            </div>
          </nav>
        </>,
        document.body
      )}
    </>
  );
}
