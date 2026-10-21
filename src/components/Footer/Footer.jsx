import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import "./Footer.css";

const CTA_IMAGE = "/Images/Banner Slider images/1.png";

const EXPLORE_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "about", label: "About Us", to: "/about" },
  { id: "services", label: "Architectural Services", to: "/services" },
  { id: "projects", label: "Stone Projects", to: "/projects" },
  { id: "blogs", label: "Stone Journal", to: "/blogs" },
  { id: "contact", label: "Contact & Consultations", to: "/contact" },
];

const EXPERTISE_LINKS = [
  { id: "statuario", label: "Italian Statuario Marble", to: "/services" },
  { id: "calacatta", label: "Calacatta Gold Slabs", to: "/services" },
  { id: "flooring", label: "Marble Flooring & Dry-Lay", to: "/services" },
  { id: "cladding", label: "Bookmatched Wall Cladding", to: "/services" },
  { id: "kitchen", label: "Kitchen Islands & Countertops", to: "/services" },
  { id: "vanities", label: "Luxury Bathroom Vanities", to: "/services" },
];

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  { id: "pinterest", label: "Pinterest", href: "https://pinterest.com" },
];

const LEGAL_LINKS = [
  { id: "privacy", label: "Privacy Policy", to: "/contact" },
  { id: "terms", label: "Terms of Supply", to: "/contact" },
  { id: "care", label: "Stone Care Guide", to: "/about" },
];

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function SocialIcon({ type }) {
  const fillProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
  };

  if (type === "instagram") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    );
  }

  if (type === "pinterest") {
    return (
      <svg {...fillProps}>
        <path d="M12 2a10 10 0 0 0-3.64 19.31c-.09-.82-.17-2.08.03-2.98l1.2-5.08s-.3-.61-.3-1.51c0-1.41.82-2.47 1.84-2.47.87 0 1.29.65 1.29 1.43 0 .87-.55 2.18-.84 3.39-.24 1.01.51 1.84 1.5 1.84 1.8 0 3.19-1.9 3.19-4.64 0-2.43-1.75-4.12-4.24-4.12-2.89 0-4.58 2.17-4.58 4.4 0 .87.33 1.81.75 2.32a.3.3 0 0 1 .07.29l-.28 1.15c-.04.18-.15.22-.34.13-1.27-.59-2.06-2.44-2.06-3.93 0-3.2 2.33-6.14 6.71-6.14 3.52 0 6.26 2.51 6.26 5.86 0 3.5-2.2 6.31-5.26 6.31-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.65A10 10 0 1 0 12 2Z" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg {...fillProps}>
        <path d="M14 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H11v7H8v-7H6v-3h2V9a4 4 0 0 1 4-4h2v3Z" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg {...fillProps}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }

  return (
    <svg {...fillProps}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ContactIcon({ type }) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (type === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.6" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg {...common}>
        <path d="M5 4h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.4 20 4 13.6 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 7h17M12.5 1.5 18 7l-5.5 5.5" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [rootRef, inView] = useInView(0.08);

  useEffect(() => {
    if (!subscribed) return undefined;
    const timer = setTimeout(() => setSubscribed(false), 5000);
    return () => clearTimeout(timer);
  }, [subscribed]);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={rootRef} className={`ft${inView ? " is-visible" : ""}`} aria-label="Site footer">
      {/* ----------------- Top Architectural CTA Banner ----------------- */}
      <div
        className="ft-cta"
        style={{ "--ft-cta-bg": `url("${CTA_IMAGE}")` }}
      >
        <div className="ft-container ft-cta-inner">
          <div className="ft-cta-copy">
            <span className="ft-eyebrow ft-item" style={{ "--i": 0 }}>
              <span className="ft-eyebrow-line" />
              Private Slab Consultations
            </span>
            <h2 className="ft-cta-title ft-item" style={{ "--i": 1 }}>
              Let&apos;s craft your <em>dream space</em> in authentic natural marble &amp; stone
            </h2>
          </div>
          <div className="ft-cta-action ft-item" style={{ "--i": 2 }}>
            <Link to="/contact" className="ft-square-btn">
              <span>Book A Gallery Consultation</span>
              <span className="ft-square-btn-arrow">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ----------------- Main Luxury Footer ----------------- */}
      <div className="ft-main">
        {/* Subtle decorative gold & white marble veins */}
        <svg
          className="ft-veins"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path className="ft-vein ft-vein--gold" pathLength="1" d="M-40 160C260 60 420 330 780 210S1320 60 1660 250" />
          <path className="ft-vein ft-vein--white" pathLength="1" d="M-40 640C320 500 560 780 960 600S1420 430 1660 610" />
          <path className="ft-vein ft-vein--gold" pathLength="1" d="M300 -30C380 220 260 420 520 560S820 760 760 940" />
          <path className="ft-vein ft-vein--white" pathLength="1" d="M1180 -20C1100 180 1300 340 1180 520S1020 760 1120 930" />
        </svg>

        <div className="ft-container ft-main-inner">
          {/* Newsletter / Catalog Request */}
          <div className="ft-newsletter">
            <div className="ft-newsletter-copy ft-item" style={{ "--i": 0 }}>
              <h3>Join The IE Marbles Journal</h3>
              <p>
                Direct quarry shipments, new Italian slab arrivals, and private showroom viewings in Kishangarh.
              </p>
            </div>
            <form className="ft-newsletter-form ft-item" style={{ "--i": 1 }} onSubmit={handleSubscribe}>
              <div className="ft-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="ft-field-btn">Subscribe</button>
              </div>
              <p className={`ft-feedback${subscribed ? " is-visible" : ""}`} role="status">
                {subscribed ? "Thank you. Welcome to the IE Marbles private journal." : ""}
              </p>
            </form>
          </div>

          <span className="ft-line" />

          {/* 4 Main Columns */}
          <div className="ft-columns">
            {/* Column 1: Brand */}
            <div className="ft-col ft-col--brand ft-item" style={{ "--i": 0 }}>
              <Logo light />
              <p className="ft-about">
                IE Marbles curates the world&apos;s finest natural marble, granite, and quartzite. We deliver bespoke fabrication, precision CNC cutting, and vein-matched installations for luxury villas, hotels, and landmark architectural spaces.
              </p>
              <div className="ft-socials">
                {SOCIALS.map((social) => (
                  <a key={social.id} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                    <SocialIcon type={social.id} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="ft-col ft-item" style={{ "--i": 1 }}>
              <h4 className="ft-col-title">Explore</h4>
              <ul className="ft-links">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Slabs & Expertise */}
            <div className="ft-col ft-item" style={{ "--i": 2 }}>
              <h4 className="ft-col-title">Signature Stone</h4>
              <ul className="ft-links">
                {EXPERTISE_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ft-col ft-col--contact ft-item" style={{ "--i": 3 }}>
              <h4 className="ft-col-title">Studio</h4>
              <ul className="ft-contact">
                <li>
                  <span className="ft-contact-text">
                    A new natural stone studio. 28+ years of combined team experience. Use the contact form to enquire.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ----------------- Bottom Legal Bar ----------------- */}
        <div className="ft-bottom">
          <div className="ft-container ft-bottom-inner">
            <p className="ft-copy">
              &copy; {new Date().getFullYear()} IE Marbles. All rights reserved.
            </p>
            <ul className="ft-legal">
              {LEGAL_LINKS.map((link) => (
                <li key={link.id}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="ft-top-btn"
              onClick={scrollTop}
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
