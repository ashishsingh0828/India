import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import { BRAND } from "../../config";
import useInView from "../hooks/useInView";
import "./Footer.css";

const EXPLORE_LINKS = [
  { id: "home", label: "Home", to: "/" },
  { id: "about", label: "About Us", to: "/about" },
  { id: "services", label: "Services", to: "/services" },
  { id: "projects", label: "Projects", to: "/projects" },
  { id: "blogs", label: "Notes on Natural Stone", to: "/blogs" },
  { id: "contact", label: "Contact", to: "/contact" },
];

const MATERIAL_LINKS = [
  { id: "marble", label: "Marble", to: "/services" },
  { id: "quartzite", label: "Quartzite", to: "/services" },
  { id: "travertine", label: "Travertine", to: "/services" },
  { id: "limestone", label: "Limestone", to: "/services" },
];

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/ie.marbles/" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  { id: "pinterest", label: "Pinterest", href: "https://pinterest.com" },
];

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

  return (
    <svg {...fillProps}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
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

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [rootRef, inView] = useInView({ rootMargin: "0px 0px -4% 0px" });
  const [showTop, setShowTop] = useState(false);

  const address = BRAND?.address;
  const phone = BRAND?.phone;
  const contactEmail = BRAND?.email;

  useEffect(() => {
    if (status !== "done") return undefined;
    const timer = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const limit = Math.max(600, window.innerHeight * 0.9);
      setShowTop(window.scrollY > limit);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      if (onSubscribe) await onSubscribe(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const scrollTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const feedback =
    status === "done"
      ? "Thank you. We will send the next note to your inbox."
      : status === "error"
        ? "Something went wrong. Please try again."
        : "";

  return (
    <>
      <footer ref={rootRef} className={`ft${inView ? " is-visible" : ""}`} aria-label="Site footer">
        <div className="ft-main">
          <svg
            className="ft-veins"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path className="ft-vein ft-vein--gold" d="M-40 160C260 60 420 330 780 210S1320 60 1660 250" />
            <path className="ft-vein ft-vein--white" d="M-40 640C320 500 560 780 960 600S1420 430 1660 610" />
            <path className="ft-vein ft-vein--gold" d="M300 -30C380 220 260 420 520 560S820 760 760 940" />
            <path className="ft-vein ft-vein--white" d="M1180 -20C1100 180 1300 340 1180 520S1020 760 1120 930" />
          </svg>

          <div className="ft-container ft-main-inner">
            <div className="ft-newsletter">
              <div className="ft-newsletter-copy ft-item" style={{ "--i": 0 }}>
                <h3>Notes on Natural Stone</h3>
                <p>
                  Material guides, surface finishes, selection considerations and architectural applications.
                </p>
              </div>
              <form className="ft-newsletter-form ft-item" style={{ "--i": 1 }} onSubmit={handleSubscribe}>
                <div className="ft-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    aria-label="Email address"
                    required
                  />
                  <button type="submit" className="ft-field-btn" disabled={status === "sending"}>
                    {status === "sending" ? "Sending" : "Subscribe"}
                  </button>
                </div>
                <p className={`ft-feedback${feedback ? " is-visible" : ""}`} role="status">
                  {feedback}
                </p>
              </form>
            </div>

            <span className="ft-line" />

            <div className="ft-columns">
              <div className="ft-col ft-col--brand ft-item" style={{ "--i": 0 }}>
                <Logo light />
                <p className="ft-about">
                  IE Marble &amp; Traders is a natural-stone sourcing and supply business, helping architects, designers, developers and private clients identify materials suited to their projects.
                </p>
                <div className="ft-socials">
                  {SOCIALS.map((social) => (
                    <a key={social.id} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                      <SocialIcon type={social.id} />
                    </a>
                  ))}
                </div>
              </div>

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

              <div className="ft-col ft-item" style={{ "--i": 2 }}>
                <h4 className="ft-col-title">Materials</h4>
                <ul className="ft-links">
                  {MATERIAL_LINKS.map((link) => (
                    <li key={link.id}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ft-col ft-col--contact ft-item" style={{ "--i": 3 }}>
                <h4 className="ft-col-title">Contact</h4>
                <ul className="ft-contact">
                  {address && (
                    <li>
                      <span className="ft-contact-icon"><ContactIcon type="pin" /></span>
                      <span>{address}</span>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <span className="ft-contact-icon"><ContactIcon type="phone" /></span>
                      <a className="ft-contact-link" href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}>
                        {phone}
                      </a>
                    </li>
                  )}
                  {contactEmail && (
                    <li>
                      <span className="ft-contact-icon"><ContactIcon type="mail" /></span>
                      <a className="ft-contact-link" href={`mailto:${contactEmail}`}>
                        {contactEmail}
                      </a>
                    </li>
                  )}
                  <li>
                    <span className="ft-contact-icon"><ContactIcon type="mail" /></span>
                    <Link className="ft-contact-link" to="/contact">
                      Send a project enquiry
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="ft-bottom">
            <div className="ft-container ft-bottom-inner">
              <p className="ft-copy">
                &copy; {new Date().getFullYear()} IE Marble &amp; Traders. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className={`ft-top-btn${showTop ? " is-shown" : ""}`}
        onClick={scrollTop}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}