import { useEffect, useRef, useState } from "react";
import "./WhyChooseUs.css";

/* ------------------------------------------------------------------
   Reveal hook – replays EVERY time the section scrolls back into view.
   Shows at 12% visible, resets only once fully off-screen.
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

/* ---------- icons ---------- */
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconSlab = () => (
  <Icon>
    <path d="M12 2.5 21 9l-9 12.5L3 9l9-6.5Z" />
    <path d="M3 9h18M8.5 9 12 2.5 15.5 9 12 21.5 8.5 9Z" />
  </Icon>
);
const IconMatch = () => (
  <Icon>
    <rect x="3" y="4" width="8" height="16" rx="1.5" />
    <rect x="13" y="4" width="8" height="16" rx="1.5" />
    <path d="M7 9c2 1 2 4 0 6M17 9c-2 1-2 4 0 6" />
  </Icon>
);
const IconPrice = () => (
  <Icon>
    <path d="M12 2.8 4.5 5.7v5.6c0 4.5 3.1 8.2 7.5 9.9 4.4-1.7 7.5-5.4 7.5-9.9V5.7L12 2.8Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Icon>
);
const IconCare = () => (
  <Icon>
    <path d="M12 21c-4.4-3.2-8-6.3-8-10.2A4.6 4.6 0 0 1 12 8a4.6 4.6 0 0 1 8 2.8C20 14.7 16.4 17.8 12 21Z" />
    <path d="M12 8V3" />
  </Icon>
);

/* ---------- content (edit freely) ---------- */
const REASONS = [
  {
    title: "Hand-selected natural slabs",
    text: "Every slab is chosen in person for colour, veining and thickness, so only the best stone reaches your home.",
    Icon: IconSlab,
  },
  {
    title: "Vein-matched installation",
    text: "Our fitters book-match and align the veining across joints, so large walls and floors read as one continuous surface.",
    Icon: IconMatch,
  },
  {
    title: "Clear pricing, no surprises",
    text: "You approve the exact slab and a fixed, itemised quote before any cutting begins.",
    Icon: IconPrice,
  },
  {
    title: "Sealed and cared for",
    text: "Each surface is sealed after installation, and we give you a simple care guide to keep the polish for years.",
    Icon: IconCare,
  },
];

/* marble slabs that fan out. High-res natural marble photos for realistic fan */
const SLABS = [
  { tone: "verde", image: "/Images/Service/Dover White Marble.png" },
  { tone: "marquina", image: "/Images/Service/Omini Bianco Marble.png" },
  { tone: "calacatta", image: "/Images/Service/Tempest Marble.png" },
  { tone: "statuario", image: "/Images/Client feedback/Client feedback-1.png" },
  { tone: "carrara", image: "/Images/Client feedback/Client feedback-2.png" },
];

const HEADING = ["Why", "homeowners", "trust", "our", "marble"];

const ArrowUpRight = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/* soft light that follows the pointer across a card */
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/* ---------- component ---------- */
export default function WhyChooseUs({
  reasons = REASONS,
  slabs = SLABS,
  image = "", // optional: one photo instead of the slab fan
  imageAlt = "Selection of polished marble slabs",
  buttonLabel = "Discover more",
  href = "/about",
  onButtonClick,
}) {
  const [ref, inView] = useInView();

  /* gentle 3D tilt of the slab fan following the pointer */
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    e.currentTarget.style.setProperty("--tilt", (x * 2).toFixed(3));
  };
  const untilt = (e) => e.currentTarget.style.setProperty("--tilt", "0");

  return (
    <section
      ref={ref}
      className={`wc ${inView ? "is-visible" : ""}`}
      aria-labelledby="wc-heading"
    >
      <svg className="wc__bg-veins" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path pathLength="1" d="M-20 150C230 90 360 270 590 220S920 20 1170 130s240 150 330 90" />
        <path pathLength="1" d="M-20 780C170 720 310 840 530 790s430-170 650-90 260 120 300 70" />
      </svg>

      <div className="wc__inner">
        {/* ---------------- left ---------------- */}
        <div className="wc__left">
          <span className="wc__pill wc__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Why choose us
          </span>

          <h2 id="wc-heading" className="wc__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="wc__word" key={w} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <span className="wc__rule" aria-hidden="true">
            <b />
            <i />
          </span>

          <p className="wc__lead wc__fade" style={{ "--d": "620ms" }}>
            Choose from premium marble and natural stone, with honest guidance
            from people who handle every slab themselves.
          </p>

          <a
            className="wc__cta wc__fade"
            style={{ "--d": "780ms" }}
            href={href}
            onClick={onButtonClick}
          >
            <span className="wc__cta-label">{buttonLabel}</span>
            <span className="wc__cta-icon">
              <ArrowUpRight />
            </span>
          </a>

          {/* fan of marble slabs */}
          <div
            className="wc__showcase"
            role="img"
            aria-label={imageAlt}
            onMouseMove={tilt}
            onMouseLeave={untilt}
          >
            <span className="wc__ring" aria-hidden="true" />
            <div className="wc__stage">
              {image ? (
                <img className="wc__photo" src={image} alt="" loading="lazy" decoding="async" />
              ) : (
                slabs.map((s, i) => {
                  const mid = (slabs.length - 1) / 2;
                  const off = i - mid;
                  return (
                    <div
                      className={`wc__slab tone-${s.tone}`}
                      key={i}
                      style={{
                        "--r": `${off * 9}deg`,
                        "--x": `${off * 44}%`,
                        "--z": i,
                        "--t": `${350 + i * 140}ms`,
                      }}
                    >
                      <svg className="wc__veins" viewBox="0 0 200 280" preserveAspectRatio="none" aria-hidden="true">
                        {i % 2 === 0 ? (
                          <>
                            <path pathLength="1" d="M-10 60C50 20 80 120 130 90S190 30 215 70" />
                            <path pathLength="1" d="M-10 220C40 180 100 250 150 210s50-30 70-10" />
                          </>
                        ) : (
                          <>
                            <path pathLength="1" d="M60 -10C90 70 40 120 90 190S150 250 130 290" />
                            <path pathLength="1" className="thin" d="M-10 150C50 130 110 170 215 120" />
                          </>
                        )}
                      </svg>
                      {s.image && <img src={s.image} alt="" loading="lazy" decoding="async" />}
                      <span className="wc__shine" aria-hidden="true" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ---------------- right ---------------- */}
        <ul className="wc__list">
          {reasons.map(({ title, text, Icon: Ico }, i) => (
            <li
              className="wc__card"
              key={title}
              style={{ "--d": `${450 + i * 170}ms` }}
              onMouseMove={spot}
            >
              <span className="wc__spot" aria-hidden="true" />
              <span className="wc__badge" aria-hidden="true">
                <Ico />
              </span>
              <div className="wc__body">
                <h3 className="wc__card-title">{title}</h3>
                <p className="wc__card-text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}