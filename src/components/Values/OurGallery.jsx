import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { asset, useApi } from "../../api";
import { IMG } from "../../data/images";
import "./OurGallery.css";

/* ────────────────────────────────────────────────────────────
   DATASETS
   ──────────────────────────────────────────────────────────── */

export const STONE_SLIDES = [
  { title: "Bianco Vogue",    tone: "carrara",    image: IMG.curatedBianco,   slug: "bianco-vogue" },
  { title: "Fossana Marble",  tone: "calacatta",  image: IMG.curatedFossana,  slug: "fossana" },
  { title: "Paonazzo Marble", tone: "statuario",  image: IMG.curatedPaonazzo, slug: "paonazzo" },
  { title: "Pirgon Marble",   tone: "travertine", image: IMG.curatedPirgon,   slug: "pirgon" },
  { title: "Thassos White",   tone: "statuario",  image: IMG.curatedThassos,  slug: "thassos-white" },
  { title: "Tortuga Marble",  tone: "marquina",   image: IMG.curatedTortuga,  slug: "tortuga" },
];


export const PROJECT_SLIDES = [
  { title: "Marble Feature Wall",  tone: "marquina",   image: IMG.appVideo1     ?? IMG.appVideo1,     slug: "marble-feature-wall" },
  { title: "Sky Residence Lobby",  tone: "statuario",  image: IMG.appVideo2 ?? IMG.appVideo2, slug: "sky-residence-lobby" },
  { title: "Monolithic Staircase", tone: "carrara",    image: IMG.appVideo3 ?? IMG.appVideo3,    slug: "monolithic-staircase" },
  { title: "Stone Flooring Suite", tone: "travertine", image: IMG.appVideo4     ?? IMG.appVideo4,     slug: "stone-flooring-suite" },
];

/* ────────────────────────────────────────────────────────────
   VARIANT PRESETS: any of these can be overridden with props
   ──────────────────────────────────────────────────────────── */

const VARIANTS = {
  slab: {
    slides: STONE_SLIDES,
    eyebrow: "Curated slabs",
    heading: ["Curated", "stone", "collections"],
    lead: "Raw slab photography of the stones we source, so you can judge colour, veining and character.",
    ctaLabel: "Enquire about a stone",
    linkLabel: "View all stones",
    linkTo: null, // pass linkTo to show a secondary link in slab mode
    cardBase: null, // pass cardBase to link cards to detail pages; otherwise cards open ctaTo
    regionLabel: "Curated stone collections",
    nextLabel: "Next stone",
    prevLabel: "Previous stone",
    bgImage: IMG.galleryThassos,
  },
  project: {
    slides: PROJECT_SLIDES,
    eyebrow: "Verified projects",
    heading: ["Verified", "projects", "and", "material", "studies"],
    lead: "Finished installations and material studies from our verified architectural projects.",
    ctaLabel: "Request material details",
    linkLabel: "View all projects",
    linkTo: "/projects",
    cardBase: "/projects",
    regionLabel: "Verified projects",
    nextLabel: "Next project",
    prevLabel: "Previous project",
    bgImage: IMG.aboutThasos,
  },
};

const TONES = ["carrara", "calacatta", "marquina", "verde", "travertine", "statuario"];

function slideImage(raw, fallback) {
  if (!raw || /unsplash\.com|picsum\.photos/i.test(raw)) return fallback;
  if (raw.startsWith("/Images/") || raw.startsWith("/images/")) return raw;
  if (/^(https?:|data:)/i.test(raw)) return raw;
  return asset(raw.startsWith("/") ? raw : `/uploads/${raw}`);
}

const pad = (n) => String(n).padStart(2, "0");

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    // threshold 0 + isIntersecting works for tall sections and for pages restored mid-scroll on refresh
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    // refresh safety: if the section is already on screen after first paint, reveal it
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) setInView(true);
      });
    });
    return () => {
      io.disconnect();
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);
  return [ref, inView];
}

const Arrow = ({ dir = "right" }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function OurGallery({
  id,
  variant = "project", // "slab" | "project"
  items,
  bgImage,
  eyebrow,
  heading,
  lead,
  cardBase,
  linkTo,
  linkLabel,
  ctaLabel,
  ctaTo = "/contact",
  regionLabel,
  nextLabel,
  prevLabel,
}) {
  const cfg = VARIANTS[variant] || VARIANTS.project;
  const isSlab = variant === "slab";

  const bg = bgImage === undefined ? cfg.bgImage : bgImage;
  const eyebrowText = eyebrow ?? cfg.eyebrow;
  const headingValue = heading ?? cfg.heading;
  const leadText = lead ?? cfg.lead;
  const base = cardBase === undefined ? cfg.cardBase : cardBase;
  const secondaryTo = linkTo === undefined ? cfg.linkTo : linkTo;
  const secondaryLabel = linkLabel ?? cfg.linkLabel;
  const primaryLabel = ctaLabel ?? cfg.ctaLabel;
  const region = regionLabel ?? cfg.regionLabel;
  const nextText = nextLabel ?? cfg.nextLabel;
  const prevText = prevLabel ?? cfg.prevLabel;

  // Heading words are animated one by one, but always read/announced with spaces
  const words = Array.isArray(headingValue) ? headingValue : String(headingValue).split(" ");
  const headingText = Array.isArray(headingValue) ? headingValue.join(" ") : headingValue;

  const headingId = useId();
  const [sectionRef, inView] = useInView();
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const navigate = useNavigate();

  const apiProjects = useApi("/projects").data;

  const slides = useMemo(() => {
    if (Array.isArray(items) && items.length > 0) return items;
    // API projects only feed the project gallery, never the slab gallery
    if (!isSlab && Array.isArray(apiProjects) && apiProjects.length > 0) {
      return apiProjects.map((p, idx) => ({
        title: p.title,
        tone: TONES[idx % TONES.length],
        image: slideImage(p.image || p.imageA, PROJECT_SLIDES[idx % PROJECT_SLIDES.length].image),
        slug: p.slug || `project-${idx}`,
      }));
    }
    return cfg.slides;
  }, [items, apiProjects, isSlab, cfg.slides]);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const card = el.querySelector(".og__card");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : 1;
    const atEnd = el.scrollLeft >= max - 4;

    setCanPrev(el.scrollLeft > 4);
    setCanNext(!atEnd);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setIndex(atEnd && max > 0 ? slides.length - 1 : Math.round(el.scrollLeft / step));
  }, [slides.length]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".og__card");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) trackRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
  };
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  // Cards open their detail page when a base is configured, otherwise the enquiry page
  const open = (s) => navigate(s.href || (base ? `${base}/${s.slug}` : ctaTo));

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`og og--${isSlab ? "slab" : "project"} ${inView ? "is-visible" : ""}`}
      aria-labelledby={headingId}
    >
      {bg && <img className="og__bg-img" src={bg} alt="" aria-hidden="true" />}
      <div className="og__bg-shade" aria-hidden="true" />
      <svg className="og__bg-veins" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path pathLength="1" d="M-20 120C240 60 380 240 620 190S980 10 1220 120s220 130 260 80" />
        <path pathLength="1" d="M-20 690C180 640 320 750 560 700s440-150 660-70 200 100 240 50" />
      </svg>

      <div className="og__inner">
        <div className="og__text">
          <span className="og__pill og__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> {eyebrowText}
          </span>

          <h2 id={headingId} className="og__title" aria-label={headingText}>
            {words.map((w, i) => (
              <span className="og__word" key={`${w}-${i}`} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>
              </span>
            ))}
          </h2>

          <span className="og__rule" aria-hidden="true">
            <b />
            <i />
          </span>

          <p className="og__lead og__fade" style={{ "--d": "600ms" }}>
            {leadText}
          </p>

          <div className="og__actions og__fade" style={{ "--d": "720ms" }}>
            <Link className="og__cta" to={ctaTo}>
              <span>{primaryLabel}</span>
            </Link>
            {/* {secondaryTo && (
              <Link className="og__link" to={secondaryTo}>
                <span>{secondaryLabel}</span>
                <Arrow />
              </Link>
            )} */}
          </div>

          <div className="og__controls og__fade" style={{ "--d": "840ms" }}>
            <button
              type="button"
              className="og__btn"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label={prevText}
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              className="og__btn"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label={nextText}
            >
              <Arrow />
            </button>

            <span className="og__count" aria-live="polite">
              <b>{pad(index + 1)}</b>
              <span className="og__progress" aria-hidden="true">
                <i style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
              </span>
              <em>{pad(slides.length)}</em>
            </span>
          </div>
        </div>

        <div className="og__slider">
          <div
            ref={trackRef}
            className={`og__track ${dragging ? "is-dragging" : ""}`}
            role="region"
            aria-roledescription="carousel"
            aria-label={region}
            tabIndex={0}
            onScroll={sync}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
          >
            {slides.map((s, i) => {
              return (
                <article
                  className={`og__card tone-${s.tone || "carrara"}`}
                  key={s.title + i}
                  style={{ "--d": `${450 + i * 140}ms` }}
                  onMouseMove={spot}
                  onClick={() => open(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(s);
                    }
                  }}
                >
                  <div className="og__media">
                    {/* decorative veins only show while there is no photograph */}
                    {!s.image && (
                      <svg className="og__veins" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
                        <path pathLength="1" d="M-10 90C70 40 120 170 190 130S270 30 320 80" />
                        <path pathLength="1" d="M-10 330C60 280 140 380 210 320S290 280 320 300" />
                        <path pathLength="1" className="thin" d="M110 -10C140 80 90 150 140 240S200 330 170 410" />
                      </svg>
                    )}
                    {s.image && (
                      <img src={s.image} alt={s.title} loading="lazy" decoding="async" draggable="false" />
                    )}
                    <span className="og__shine" aria-hidden="true" />
                    <span className="og__spot" aria-hidden="true" />
                    <span className="og__open" aria-hidden="true">
                      <Arrow />
                    </span>
                  </div>

                  <div className="og__caption">
                    <h3 className="og__cap-title">{s.title}</h3>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}