import { useEffect, useRef, useState } from "react";
import "./OurValues.css";

/* ---------- reveal-on-scroll hook (no extra libraries) ---------- */
function useInView(threshold = 0.2) {
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ---------- icons (stroke style, inherit colour) ---------- */
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
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

const IconQuality = () => (
  <Icon>
    <path d="M12 2.5 21 9l-9 12.5L3 9l9-6.5Z" />
    <path d="M3 9h18M8.5 9 12 2.5 15.5 9 12 21.5 8.5 9Z" />
  </Icon>
);

const IconIntegrity = () => (
  <Icon>
    <path d="M12 2.8 4.5 5.7v5.6c0 4.5 3.1 8.2 7.5 9.9 4.4-1.7 7.5-5.4 7.5-9.9V5.7L12 2.8Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Icon>
);

const IconInnovation = () => (
  <Icon>
    <path d="M12 2.5 3.5 7.2v9.6L12 21.5l8.5-4.7V7.2L12 2.5Z" />
    <path d="M3.5 7.2 12 12l8.5-4.8M12 12v9.5" />
  </Icon>
);

/* ---------- content ---------- */
const VALUES = [
  {
    title: "Quality excellence",
    text: "Every slab is selected, cut and polished under strict quality control, so the stone in your home looks as good in ten years as it does on day one.",
    points: ["Hand-selected natural stone", "Checked at every stage"],
    Icon: IconQuality,
  },
  {
    title: "Integrity & transparency",
    text: "You see the exact slab before it is cut. Clear pricing, honest timelines and no surprises between quote and installation.",
    points: ["Slab approval before cutting", "Fixed, itemised quotes"],
    Icon: IconIntegrity,
  },
  {
    title: "Innovation & technology",
    text: "Digital templating and precision cutting keep seams tight and veining matched, so large surfaces read as one continuous piece of marble.",
    points: ["Vein-matched book-matching", "Precision CNC finishing"],
    Icon: IconInnovation,
  },
];

const HEADING = ["Foundational", "values", "behind", "our", "marble", "craft"];

const Check = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path
      d="M3.2 8.4 6.5 11.5 12.8 4.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- component ---------- */
export default function OurValues({
  image = "/Images/Service/Bianco Vogue Marble.png",
  imageAlt = "Living space finished with Statuario bookmatched marble slabs",
}) {
  const [ref, inView] = useInView(0.18);

  return (
    <section
      ref={ref}
      className={`ov ${inView ? "is-visible" : ""}`}
      aria-labelledby="ov-heading"
    >
      {/* soft marble veining in the background */}
      <svg
        className="ov__bg-veins"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          pathLength="1"
          d="M-20 140C220 90 330 260 560 220S900 20 1150 130s240 150 330 90"
        />
        <path
          pathLength="1"
          d="M-20 760C160 700 300 820 520 770s420-170 640-90 260 120 300 70"
        />
        <path
          pathLength="1"
          className="thin"
          d="M300 -10C340 120 280 230 360 360S520 520 480 700"
        />
      </svg>

      <div className="ov__inner">
        {/* ---------------- left column ---------------- */}
        <div className="ov__left">
          <span className="ov__pill ov__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Our values
          </span>

          <h2 id="ov-heading" className="ov__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="ov__word" key={w + i} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <p className="ov__lead ov__fade" style={{ "--d": "520ms" }}>
            Our advanced production processes, skilled craftsmanship and strict
            quality control ensure consistent performance, refined finishes and
            long-lasting durability.
          </p>

          {/* polished marble slab frame */}
          <figure className="ov__slab ov__fade" style={{ "--d": "700ms" }}>
            <div className="ov__slab-img">
              <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
              <span className="ov__shine" aria-hidden="true" />
              <svg
                className="ov__slab-veins"
                viewBox="0 0 600 340"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path pathLength="1" d="M-10 60C120 20 190 140 300 110S470 20 610 70" />
                <path pathLength="1" d="M-10 290C100 250 230 330 340 290s190-70 270-20" />
              </svg>
            </div>
            <span className="ov__slab-frame" aria-hidden="true" />
          </figure>
        </div>

        {/* ---------------- right column ---------------- */}
        <ul className="ov__list">
          {VALUES.map(({ title, text, points, Icon: Ico }, i) => (
            <li
              className="ov__item"
              key={title}
              style={{ "--d": `${450 + i * 200}ms` }}
            >
              <div className="ov__badge" aria-hidden="true">
                <Ico />
              </div>

              <div className="ov__body">
                <h3 className="ov__item-title">{title}</h3>
                <p className="ov__item-text">{text}</p>
                <ul className="ov__points">
                  {points.map((p) => (
                    <li key={p}>
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}