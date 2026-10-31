import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import "./ServiceDetails.css";

const ENTER = ["right", "left", "bottom", "top"];

/* ---------- Helpers ---------- */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`sd-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

function FadeImage({ src, alt = "", className = "", enter = "right" }) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
  }, [src]);

  return (
    <div className={`sd-pix ${className}`} data-enter={enter}>
      <img ref={aRef} className="sd-img sd-img-a" src={src || "/Images/Banner Slider images/1.png"} alt={alt} loading="lazy" onLoad={markLoaded} />
      <img ref={bRef} className="sd-img sd-img-b" src={src || "/Images/Banner Slider images/2.png"} alt="" aria-hidden="true" loading="lazy" onLoad={markLoaded} />
    </div>
  );
}

const Chevron = ({ dir = "right" }) => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className={`sd-chev sd-chev-${dir}`}>
    <path d={dir === "right" ? "M6 3l5 5-5 5" : "M3 6l5 5 5-5"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StoneSlabIcon = ({ alt }) => (
  <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <rect x="4" y="4" width="24" height="24" rx="2" />
      {alt ? (
        <path d="M7 25c3-6 5-8 9-11s7-3 9-6M9 7c2 5 5 7 9 9s5 5 7 9" strokeDasharray="1 1" />
      ) : (
        <path d="M4 16h24M16 4v24M7 8c4 3 6 8 5 16M25 8c-4 3-6 8-5 16" />
      )}
    </g>
  </svg>
);

/* ---------- Video popup (rendered into <body> so it is always on top) ---------- */
function VideoModal({ id, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  if (!id) return null;

  return createPortal(
    <div className="sd-modal" role="dialog" aria-modal="true" aria-label="Video" onClick={onClose}>
      <div className="sd-modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="sd-modal-close" onClick={onClose} aria-label="Close video">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title="Service video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>,
    document.body
  );
}

/* ---------- FAQ accordion (one open at a time, smooth height) ---------- */
function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="sd-faq">
      {items.map((it, i) => (
        <div key={`${it.q}-${i}`} className={`sd-acc ${open === i ? "is-open" : ""}`}>
          <h5>
            <button
              type="button"
              id={`faq-h-${i}`}
              aria-expanded={open === i}
              aria-controls={`faq-p-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <span>{it.q}</span>
              <span className="sd-acc-icon"><Chevron dir="down" /></span>
            </button>
          </h5>
          <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-h-${i}`} className="sd-acc-panel">
            <div className="sd-acc-inner"><p>{it.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */
export default function ServiceDetails({ service, links = [] }) {
  const [playing, setPlaying] = useState(false);
  const close = useCallback(() => setPlaying(false), []);

  return (
    <section className="sd-section">
      <div className="sd-container">
        {/* ============ MAIN ============ */}
        <div className="sd-main">
          {service.hero && <Reveal className="sd-hero"><FadeImage src={service.hero} alt="" enter={ENTER[0]} /></Reveal>}

          {service.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={60 * i}>{p}</Reveal>
          ))}

          {service.strategyText && <Reveal as="h3" className="sd-h3">{service.strategyHeading}</Reveal>}
          {service.strategyText && <Reveal as="p">{service.strategyText}</Reveal>}

          {service.features?.length > 0 && (
          <div className="sd-features">
            <Reveal><FadeImage src={service.sideImage} className="sd-features-img" enter={ENTER[1]} /></Reveal>
            <Reveal className="sd-features-card" delay={140}>
              {service.features.map((f, i) => (
                <div key={`${f.title}-${i}`} className="sd-feature">
                  <span className="sd-feature-icon"><StoneSlabIcon alt={i % 2} /></span>
                  <div>
                    <h5>{f.title}</h5>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
          )}

          {service.steps?.length > 0 && <>
          <Reveal as="h3" className="sd-h3">{service.processHeading}</Reveal>
          <ol className="sd-steps">
            {service.steps.map((s, i) => (
              <Reveal as="li" key={`${s.title}-${i}`} delay={i * 100}>
                <span className="sd-step-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h5>{s.title}</h5>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          </>}

          {service.video && <>
          {service.videoHeading && <Reveal as="h3" className="sd-h3">{service.videoHeading}</Reveal>}
          {service.videoText && <Reveal as="p">{service.videoText}</Reveal>}

          <Reveal className="sd-video">
            <img src={service.video.thumb || undefined} alt="" loading="lazy" />
            <button type="button" className="sd-play" onClick={() => setPlaying(true)} aria-label="Play video">
              <span className="sd-play-ring" aria-hidden="true" />
              <svg className="sd-play-icon" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            </button>
          </Reveal>
          </>}

          {service.faqs?.length > 0 && <>
          <h3 className="sd-h3">{service.faqHeading}</h3>
          <Accordion items={service.faqs} />
          </>}
        </div>

        {/* ============ SIDEBAR ============ */}
        <aside className="sd-side">
          <Reveal delay={80}>
            <Link className="sd-contact" to="/contact">
              <img
                className="sd-contact-photo"
                src={service.contactImage || service.hero || "/Images/Client feedback/Client feedback-1.png"}
                alt=""
              />
              <span className="sd-contact-shade" />
              <span className="sd-contact-body">
                <span className="sd-contact-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </span>
                <small>Need help? Talk to an expert</small>
                <strong>Write to us for slab advice</strong>
              </span>
            </Link>
          </Reveal>

          <Reveal className="sd-widget" delay={160}>
            <h4>Service List</h4>
            <ul className="sd-links">
              {links.map((l) => (
                <li key={l.href}>
                  <NavLink to={l.href}><span>{l.label}</span><Chevron /></NavLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>

      {playing && <VideoModal id={service.video.youtubeId} onClose={close} />}
    </section>
  );
}