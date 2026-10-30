import { useEffect, useRef, useState } from "react";
import "./WhyChooseUs.css";

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
const IconDetail = () => (
  <Icon>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 5 5" />
  </Icon>
);
const IconCoord = () => (
  <Icon>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V3h6v1M8.5 11h7M8.5 15h4.5" />
  </Icon>
);
const IconCollab = () => (
  <Icon>
    <circle cx="9" cy="12" r="5.5" />
    <circle cx="15" cy="12" r="5.5" />
  </Icon>
);
const IconClarity = () => (
  <Icon>
    <path d="M12 2.8 4.5 5.7v5.6c0 4.5 3.1 8.2 7.5 9.9 4.4-1.7 7.5-5.4 7.5-9.9V5.7L12 2.8Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Icon>
);

const REASONS = [
  {
    title: "Selection with Intent",
    text: "Every project has its own aesthetic and functional requirements. We help explore suitable natural-stone options based on colour, veining, texture, finish and intended application.",
    Icon: IconSlab,
  },
  {
    title: "Attention to Material Detail",
    text: "Natural stone is inherently individual. Its patterns, tonal variations, dimensions and surface characteristics deserve careful consideration. We encourage informed selection and clear material specifications before an order is finalised.",
    Icon: IconDetail,
  },
  {
    title: "Project-Focused Coordination",
    text: "From material references and slab dimensions to finish requirements and quantity schedules, we work to clarify project needs and coordinate appropriate sourcing and processing arrangements.",
    Icon: IconCoord,
  },
  {
    title: "A Collaborative Approach",
    text: "We welcome collaboration with architects, interior designers, contractors, developers and private clients. By understanding the brief and communicating requirements clearly, we aim to make material selection and supply coordination more straightforward.",
    Icon: IconCollab,
  },
  {
    title: "Clarity at Every Stage",
    text: "We believe a professional procurement process begins with transparent discussions about material availability, specifications, pricing, processing requirements and delivery arrangements. Our approach is centred on clear expectations and agreed project requirements.",
    Icon: IconClarity,
  },
];

const SLABS = [
  { tone: "verde", image: "/Images/Service/Dover White Marble.png" },
  { tone: "calacatta", image: "/Images/Service/Tempest Marble.png" },
  { tone: "marquina", image: "/Images/Service/Omini Bianco Marble.png" },
];

const HEADING = ["A"," ", " More", "Considered", "Approach","", ",to", "Natural", "Stone"];

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

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function WhyChooseUs({
  reasons = REASONS,
  slabs = SLABS,
  image = "",
  imageAlt = "Selection of polished marble slabs",
  buttonLabel = "Discuss a Project",
  href = "/contact",
  onButtonClick,
}) {
  const [ref, inView] = useInView();

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
        <div className="wc__left">
          <span className="wc__pill wc__fade" style={{ "--d": "0ms" }}>
            <i aria-hidden="true" /> Why choose us
          </span>

          <h2 id="wc-heading" className="wc__title" aria-label={HEADING.join(" ")}>
            {HEADING.map((w, i) => (
              <span className="wc__word" key={`${w}-${i}`} aria-hidden="true">
                <span style={{ "--i": i }}>{w}</span>{" "}
              </span>
            ))}
          </h2>

          <span className="wc__rule" aria-hidden="true">
            <b />
            <i />
          </span>

          <p className="wc__lead wc__fade" style={{ "--d": "620ms" }}>
            Natural stone is more than a surface. It brings character, depth
            and individuality to architecture. Selecting the right material
            requires an understanding of its visual qualities, intended
            application and practical requirements.
          </p>

          <p className="wc__lead wc__fade" style={{ "--d": "700ms" }}>
            At IE Marbles, we approach every enquiry with a focus
            on thoughtful material selection, clear specifications and
            project-oriented coordination. Our aim is to help architects,
            interior designers, developers and private clients identify
            natural-stone options that align with their design vision and
            project needs.
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

        <div className="wc__right">
          <ul className="wc__list">
            {reasons.map(({ title, text, Icon: Ico }, i) => (
              <li
                className="wc__card"
                key={title}
                style={{ "--d": `${450 + i * 150}ms` }}
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

          <blockquote className="wc__quote wc__fade" style={{ "--d": "1300ms" }}>
            <span className="wc__quote-label">The IE Perspective</span>
            <p>The right stone should do more than complete a space. It should belong to it.</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}