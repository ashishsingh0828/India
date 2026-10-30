import { useEffect, useRef, useState } from "react";
import "./OurValues.css";

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

const IconMaterial = () => (
  <Icon>
    <path d="M12 2.5 21 9l-9 12.5L3 9l9-6.5Z" />
    <path d="M3 9h18M8.5 9 12 2.5 15.5 9 12 21.5 8.5 9Z" />
  </Icon>
);

const IconDetail = () => (
  <Icon>
    <path d="M4 6h16M4 12h16M4 18h10" />
    <circle cx="18" cy="18" r="3" />
    <path d="m20.5 20.5 2 2" />
  </Icon>
);

const IconCollaboration = () => (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const IconClarity = () => (
  <Icon>
    <path d="M12 2.8 4.5 5.7v5.6c0 4.5 3.1 8.2 7.5 9.9 4.4-1.7 7.5-5.4 7.5-9.9V5.7L12 2.8Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Icon>
);

const VALUES = [
  {
    title: "Material Understanding",
    text: "We consider the natural character of stone, including its colour, veining, texture and variation, alongside the practical requirements of its intended application.",
    points: ["Natural veining & tonal study", "Application-first stone suitability"],
    Icon: IconMaterial,
  },
  {
    title: "Attention to Detail",
    text: "Clear dimensions, agreed finishes, material references and documented requirements help establish a shared understanding before an order progresses.",
    points: ["Documented finish schedules", "Precise dimensional verification"],
    Icon: IconDetail,
  },
  {
    title: "Collaborative Working",
    text: "We value clear communication with everyone involved—architects, interior designers, contractors and suppliers—from initial enquiry to supply coordination.",
    points: ["Architect & designer alignment", "Integrated trade communication"],
    Icon: IconCollaboration,
  },
  {
    title: "A Commitment to Clarity",
    text: "We communicate specifications, availability, pricing and procurement responsibilities clearly, allowing clients to make informed decisions throughout.",
    points: ["Transparent procurement steps", "Clear specification schedules"],
    Icon: IconClarity,
  },
];

const HEADING = ["What", "Guides", "Our", "Work"];

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

export default function OurValues({
  image = "/Images/About/Guiding Principles/banner.png",
  imageAlt = "Architectural interior showcasing natural stone veining and material selection",
}) {
  const [ref, inView] = useInView(0.18);

  return (
    <section
      ref={ref}
      className={`ov ${inView ? "is-visible" : ""}`}
      aria-labelledby="ov-heading"
    >
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
        <div className="ov__left">
          <span className="ov__pill ov__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Guiding Principles
          </span>

          <h2 id="ov-heading" className="ov__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="ov__word" key={w + i} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <p className="ov__lead ov__fade" style={{ "--d": "520ms" }}>
            Our approach is grounded in a simple principle: understand the brief,
            respect the natural character of the material, and coordinate every
            procurement detail with care.
          </p>

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

        <ul className="ov__list">
          {VALUES.map(({ title, text, points, Icon: Ico }, i) => (
            <li
              className="ov__item"
              key={title}
              style={{ "--d": `${450 + i * 160}ms` }}
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