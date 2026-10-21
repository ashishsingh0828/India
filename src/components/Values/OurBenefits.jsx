import { useEffect, useRef, useState } from "react";
import "./OurBenefits.css";

/* ---------- content (edit freely) ---------- */
const STATS = [
  { label: "Completed projects", value: 3, suffix: "K+", decimals: 0 },
  { label: "Countries supported", value: 150, suffix: "+", decimals: 0 },
  { label: "Customer rating", value: 4.9, suffix: "/5", decimals: 1 },
];

const BENEFITS = [
  "Free slab consultation & dry-lay",
  "100% genuine quarry certification",
  "Premium natural Italian & Indian marble",
  "Expert stone fabricators & installers",
];

const HEADING = ["Unlock", "the", "advantages", "of", "marble", "flooring", "&", "natural", "stone"];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------
   Reveal hook – replays EVERY time the section scrolls back into view.
------------------------------------------------------------------- */
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
        if (e.intersectionRatio >= 0.15) setInView(true);
        else if (!e.isIntersecting) setInView(false);
      },
      { threshold: [0, 0.15] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/* ------------------------------------------------------------------
   Count-up hook – runs from 0 every time `active` turns true,
   and resets to 0 when it turns false (so it replays on re-entry).
------------------------------------------------------------------- */
function useCountUp(target, active, { delay = 0, duration = 2000 } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    if (reducedMotion()) {
      setVal(target);
      return;
    }
    let raf;
    let start;
    const ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)); // easeOutExpo
    const tick = (now) => {
      if (start === undefined) start = now;
      const p = Math.min((now - start) / duration, 1);
      setVal(target * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, target, delay, duration]);
  return val;
}

/* ---------- pieces ---------- */
function Stat({ label, value, suffix, decimals, active, delay, d }) {
  const n = useCountUp(value, active, { delay, duration: 2200 });
  const shown = n.toFixed(decimals);

  /* soft light that follows the pointer */
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <li className="ob__stat" style={{ "--d": d }} onMouseMove={spot}>
      <span className="ob__spot" aria-hidden="true" />
      <span className="ob__stat-label">
        <i aria-hidden="true" />
        {label}
      </span>
      <span className="ob__stat-line" aria-hidden="true" />
      <p className="ob__stat-num" aria-label={`${value}${suffix}`}>
        <span aria-hidden="true">{shown}</span>
        <small aria-hidden="true">{suffix}</small>
      </p>
    </li>
  );
}

const ArrowUpRight = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 18 18 6M8 6h10v10" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
  </svg>
);

const toEmbed = (url) => {
  try {
    const u = new URL(url);
    let id = u.searchParams.get("v");
    if (!id && u.hostname === "youtu.be") id = u.pathname.slice(1);
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  } catch (e) {
    /* not a valid URL – use as is */
  }
  return url;
};

/* ---------- component ---------- */
export default function OurBenefits({
  stats = STATS,
  benefits = BENEFITS,
  bgImage = "/Images/Our gallery/Tortuga Marble.png",
  videoUrl = "https://www.youtube.com/watch?v=hddwAIXbKZo",
  onPlay, // optional: use your own handler instead of the built-in video pop-up
}) {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(false);

  /* video pop-up: Esc to close, lock page scroll while open */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const play = () => (onPlay ? onPlay() : videoUrl && setOpen(true));

  return (
    <section
      ref={ref}
      className={`ob ${inView ? "is-visible" : ""}`}
      aria-labelledby="ob-heading"
    >
      <div className="ob__panel">
        {/* ---------- background ---------- */}
        <div className="ob__bg" aria-hidden="true">
          {bgImage ? (
            <img src={bgImage} alt="" loading="lazy" decoding="async" />
          ) : (
            <svg viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
              <path pathLength="1" d="M-20 140C260 70 400 270 660 210S1040 20 1280 130s200 120 240 70" />
              <path pathLength="1" d="M-20 640C200 590 360 710 620 650s440-170 680-80 150 90 200 40" />
              <path pathLength="1" className="thin" d="M820 -10C860 120 780 230 860 360S1000 520 960 820" />
            </svg>
          )}
        </div>
        <div className="ob__shade" aria-hidden="true" />

        {/* ---------- top row ---------- */}
        <div className="ob__top">
          <div className="ob__head">
            <span className="ob__pill ob__fade" style={{ "--d": "0ms" }}>
              <i aria-hidden="true" /> Our benefits
            </span>

            <h2 id="ob-heading" className="ob__title" aria-label={HEADING.join(" ")}>
              {HEADING.map((w, i) => (
                <span className="ob__word" key={w + i} aria-hidden="true">
                  <span style={{ "--i": i }}>{w}</span>{" "}
                </span>
              ))}
            </h2>

            <span className="ob__rule" aria-hidden="true">
              <b />
              <i />
            </span>
          </div>

          {/* rotating circular text + play button */}
          <div className="ob__circle">
            <svg className="ob__ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="ob-circle-path" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
              </defs>
              <text>
                <textPath href="#ob-circle-path" textLength="494" lengthAdjust="spacing">
                  WATCH THE VIDEO • WATCH THE VIDEO •
                </textPath>
              </text>
            </svg>
            <button type="button" className="ob__play" onClick={play} aria-label="Watch the video">
              <PlayIcon />
            </button>
          </div>
        </div>

        {/* ---------- counters ---------- */}
        <ul className="ob__stats">
          {stats.map((s, i) => (
            <Stat
              key={s.label}
              {...s}
              active={inView}
              delay={700 + i * 180}
              d={`${500 + i * 180}ms`}
            />
          ))}
        </ul>

        {/* ---------- benefits row ---------- */}
        <ul className="ob__benefits">
          {benefits.map((b, i) => (
            <li className="ob__benefit" key={b} style={{ "--d": `${1000 + i * 140}ms` }}>
              <span className="ob__arrow">
                <ArrowUpRight />
              </span>
              <span className="ob__benefit-text">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- video pop-up ---------- */}
      {open && (
        <div
          className="ob__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Video"
          onClick={() => setOpen(false)}
        >
          <div className="ob__modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ob__close"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              autoFocus
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <iframe
              src={toEmbed(videoUrl)}
              title="Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}