import { useCallback, useEffect, useRef, useState } from "react";
import "./ClientFeedback.css";

const TESTIMONIALS = [
  {
    name: "Ar. Rajesh Mehta",
    role: "Principal Architect, Studio Forma",
    rating: 5,
    avatar: "",
    text: "IE Marbles approached our villa project with genuine material intent. The vein-matching across the double-height feature wall and the dry-lay inspection before dispatch made on-site execution effortless.",
  },
  {
    name: "Sunaina Kapoor",
    role: "Lead Interior Designer, Atelier K",
    rating: 5,
    avatar: "",
    text: "Finding quartzite and marble slabs that align with subtle tonal palettes is always challenging. Their coordination and documented finish schedules gave our clients complete clarity throughout procurement.",
  },
  {
    name: "Devendra Verma",
    role: "Project Director, Skyline Developments",
    rating: 5,
    avatar: "",
    text: "From sharing our initial BOQ to verifying calibration tolerances for facade cladding, their transparent process coordination ensured specifications were strictly met without lead-time surprises.",
  },
];

const HEADING = ["Working", "with", "architects,", "designers", "&", "clients"];
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

const StarRow = () => (
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z" />
      </svg>
    ))}
  </>
);

const Stars = ({ rating }) => (
  <span className="tt__stars" role="img" aria-label={`Rated ${rating} out of 5`}>
    <span className="tt__stars-row">
      <StarRow />
    </span>
    <span
      className="tt__stars-row tt__stars-fill"
      style={{ width: `${(rating / 5) * 100}%` }}
    >
      <StarRow />
    </span>
  </span>
);

const QuoteIcon = () => <span className="tt__qmark">“</span>;

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

export default function ClientFeedback({
  items = TESTIMONIALS,
  image = "/Images/About/Feed/feed.png",
  imageAlt = "Architectural stone installation and curated slab selection",
  interval = 7000,
}) {
  const [ref, inView] = useInView();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const swipe = useRef({ x: 0, down: false });
  const total = items.length;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback((n) => setIndex(((n % total) + total) % total), [total]);
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = () => go(index - 1);

  const paused = hovered || focused || !inView;

  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, down: true };
  };
  const onPointerUp = (e) => {
    if (!swipe.current.down) return;
    swipe.current.down = false;
    const dx = e.clientX - swipe.current.x;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      ref={ref}
      className={`tt ${inView ? "is-visible" : ""}`}
      aria-labelledby="tt-heading"
    >
      <svg
        className="tt__bg-veins"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          pathLength="1"
          d="M-20 160C230 100 360 280 590 230S920 30 1170 140s240 150 330 90"
        />
        <path
          pathLength="1"
          d="M-20 790C170 730 310 850 530 800s430-170 650-90 260 120 300 70"
        />
      </svg>

      <div className="tt__inner">
        <figure className="tt__photo">
          <span className="tt__frame" aria-hidden="true" />
          <div className="tt__img">
            {image ? (
              <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
            ) : (
              <div className="tt__slab" role="img" aria-label={imageAlt}>
                <svg viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength="1" d="M-10 110C90 50 150 200 240 160S350 40 420 100" />
                  <path pathLength="1" d="M-10 380C80 330 170 430 260 370s130-60 170-20" />
                  <path pathLength="1" className="thin" d="M170 -10C210 110 140 200 200 310S280 430 240 510" />
                </svg>
              </div>
            )}
            <span className="tt__shine" aria-hidden="true" />
          </div>

          <span className="tt__badge" aria-hidden="true">
            <span key={index} className="tt__badge-icon">
              <QuoteIcon />
            </span>
          </span>
        </figure>

        <div className="tt__content">
          <span className="tt__pill tt__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Project Collaborations
          </span>

          <h2 id="tt-heading" className="tt__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="tt__word" key={w + i} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <span className="tt__rule" aria-hidden="true">
            <b />
            <i />
          </span>

          <div
            className="tt__stage"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current.down = false)}
          >
            {items.map((t, i) => (
              <article
                key={t.name}
                className={`tt__slide ${i === index ? "is-active" : ""}`}
                aria-hidden={i !== index}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
              >
                <div className="tt__it" style={{ "--k": 0 }}>
                  <Stars rating={t.rating} />
                </div>

                <blockquote className="tt__quote tt__it" style={{ "--k": 1 }}>
                  <p>{t.text}</p>
                </blockquote>

                <span className="tt__divider tt__it" style={{ "--k": 2 }} aria-hidden="true" />

                <footer className="tt__author tt__it" style={{ "--k": 3 }}>
                  <span className="tt__avatar">
                    {t.avatar ? (
                      <img src={t.avatar} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <b>{t.name.split(" ").slice(-1)[0].charAt(0)}</b>
                    )}
                  </span>
                  <span className="tt__who">
                    <cite>{t.name}</cite>
                    <small>{t.role}</small>
                  </span>
                </footer>
              </article>
            ))}
          </div>

          <div className="tt__controls tt__fade" style={{ "--d": "900ms" }}>
            <button
              type="button"
              className="tt__btn"
              onClick={prev}
              aria-label="Previous testimonial"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              className="tt__btn"
              onClick={next}
              aria-label="Next testimonial"
            >
              <Arrow />
            </button>

            <span className="tt__count" aria-live="off">
              <b>{pad(index + 1)}</b>
              <span className="tt__progress" aria-hidden="true">
                <i
                  key={index}
                  className={paused ? "is-paused" : ""}
                  style={
                    reduced
                      ? { animation: "none", transform: "scaleX(1)" }
                      : { "--dur": `${interval}ms` }
                  }
                  onAnimationEnd={next}
                />
              </span>
              <em>{pad(total)}</em>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}