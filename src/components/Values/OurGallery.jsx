import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import "./OurGallery.css";

/* ------------------------------------------------------------------
   IE Marbles – Our Project Gallery
   Connected directly with Express & MongoDB Admin Panel.
------------------------------------------------------------------- */
const DEFAULT_SLIDES = [
  { title: "Carrara Living Room", type: "Wall Cladding", tone: "carrara", image: "", slug: "carrara-living-room" },
  { title: "Calacatta Gold Bathroom", type: "Floor & Vanity", tone: "calacatta", image: "", slug: "calacatta-gold-bathroom" },
  { title: "Nero Marquina Kitchen", type: "Countertop", tone: "marquina", image: "", slug: "nero-marquina-kitchen" },
  { title: "Verde Alpi Entrance", type: "Feature Wall", tone: "verde", image: "", slug: "verde-alpi-entrance" },
  { title: "Travertine Staircase", type: "Steps & Risers", tone: "travertine", image: "", slug: "travertine-staircase" },
  { title: "Statuario Master Suite", type: "Bookmatched Slabs", tone: "statuario", image: "", slug: "statuario-master-suite" },
];

const HEADING = ["Marble", "interiors", "we've", "crafted"];
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
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.12) setInView(true);
        else if (!e.isIntersecting) setInView(false);
      },
      { threshold: [0, 0.12] }
    );
    io.observe(el);
    return () => io.disconnect();
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

export default function OurGallery({ bgImage = "" }) {
  const [sectionRef, inView] = useInView();
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const navigate = useNavigate();

  const apiProjects = useApi("/projects").data;

  const slides = useMemo(() => {
    if (Array.isArray(apiProjects) && apiProjects.length > 0) {
      const tones = ["carrara", "calacatta", "marquina", "verde", "travertine", "statuario"];
      return apiProjects.map((p, idx) => ({
        title: p.title,
        type: p.category || p.type || "Architectural Stone",
        tone: tones[idx % tones.length],
        image: p.image ? (p.image.startsWith("http") ? p.image : `/uploads/${p.image}`) : "",
        slug: p.slug || `project-${idx}`,
      }));
    }
    return DEFAULT_SLIDES;
  }, [apiProjects]);

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

    const cur = cursorRef.current;
    if (cur) {
      const r = cur.parentElement.getBoundingClientRect();
      cur.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`;
    }

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

  return (
    <section
      ref={sectionRef}
      className={`og ${inView ? "is-visible" : ""}`}
      aria-labelledby="og-heading"
    >
      {bgImage && <img className="og__bg-img" src={bgImage} alt="" aria-hidden="true" />}
      <div className="og__bg-shade" aria-hidden="true" />
      <svg className="og__bg-veins" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path pathLength="1" d="M-20 120C240 60 380 240 620 190S980 10 1220 120s220 130 260 80" />
        <path pathLength="1" d="M-20 690C180 640 320 750 560 700s440-150 660-70 200 100 240 50" />
      </svg>

      <div className="og__inner">
        {/* -------- text column -------- */}
        <div className="og__text">
          <span className="og__pill og__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Our gallery
          </span>

          <h2 id="og-heading" className="og__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="og__word" key={w} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <span className="og__rule" aria-hidden="true">
            <b />
            <i />
          </span>

          <p className="og__lead og__fade" style={{ "--d": "600ms" }}>
            From book-matched feature walls to full marble bathrooms, browse
            the spaces we have finished with natural stone.
          </p>

          <div className="og__controls og__fade" style={{ "--d": "760ms" }}>
            <button
              type="button"
              className="og__btn"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous project"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              className="og__btn"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next project"
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

          <Link
            className="og__link og__fade"
            style={{ "--d": "900ms" }}
            to="/projects"
          >
            <span>View all projects</span>
            <Arrow />
          </Link>
        </div>

        {/* -------- slider -------- */}
        <div className="og__slider">
          <div
            ref={trackRef}
            className={`og__track ${dragging ? "is-dragging" : ""}`}
            role="region"
            aria-roledescription="carousel"
            aria-label="Marble project gallery"
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
            {slides.map((s, i) => (
              <article
                className={`og__card tone-${s.tone || "carrara"}`}
                key={s.title + i}
                style={{ "--d": `${450 + i * 140}ms` }}
                onMouseMove={spot}
                onClick={() => navigate(`/projects/${s.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/projects/${s.slug}`)}
              >
                <div className="og__media">
                  <svg className="og__veins" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
                    <path pathLength="1" d="M-10 90C70 40 120 170 190 130S270 30 320 80" />
                    <path pathLength="1" d="M-10 330C60 280 140 380 210 320S290 280 320 300" />
                    <path pathLength="1" className="thin" d="M110 -10C140 80 90 150 140 240S200 330 170 410" />
                  </svg>
                  {s.image && (
                    <img src={s.image} alt={s.title} loading="lazy" decoding="async" draggable="false" />
                  )}
                  <span className="og__shine" aria-hidden="true" />
                </div>

                <span className="og__spot" aria-hidden="true" />

                <div className="og__caption">
                  <span className="og__cap-type">{s.type}</span>
                  <h3 className="og__cap-title">{s.title}</h3>
                </div>

                <span className="og__open" aria-hidden="true">
                  <Arrow />
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
