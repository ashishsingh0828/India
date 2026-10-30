import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

const STONES = {
  carrara: {
    name: "White Carrara",
    seed: 7,
    bg: ["#fbfaf8", "#e6e2db"],
    cloud: "#cfc9bf",
    vein: "#6c7078",
    vein2: "#a7aab0",
    gold: "#c9a24b",
  },
  grey: {
    name: "Grey Quartzite",
    seed: 43,
    bg: ["#e4e5e7", "#b3b5b9"],
    cloud: "#8d9096",
    vein: "#4d515a",
    vein2: "#ffffff",
    gold: "#c9a24b",
  },
  emperador: {
    name: "Classic Travertine",
    seed: 21,
    bg: ["#7b5a3e", "#46321f"],
    cloud: "#2c1e12",
    vein: "#f0e1c0",
    vein2: "#c9a24b",
    gold: "#e6c97c",
  },
  nero: {
    name: "Fine Limestone",
    seed: 64,
    bg: ["#27231f", "#0c0a08"],
    cloud: "#3a332b",
    vein: "#dcb85e",
    vein2: "#f3e3b0",
    gold: "#b98a2e",
  },
};

function veinTable(width) {
  return Array.from({ length: 40 }, (_, i) =>
    Math.max(0, 1 - Math.abs(i - 19) / width).toFixed(3)
  ).join(" ");
}

function marbleUri(m, W = 900, H = 1100) {
  const k = 1.7;
  const flt = (id, inner) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">${inner}</filter>`;
  const opaque =
    '<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"';

  const vein = (id, seed, fx, fy, width, warp, color) =>
    flt(
      id,
      `<feTurbulence type="fractalNoise" baseFrequency="${fx * k} ${fy * k}" numOctaves="5" seed="${seed}" result="n"/>` +
        `${opaque} in="n" result="no"/>` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.0035 0.005" numOctaves="3" seed="${seed + 5}" result="w"/>` +
        `${opaque} in="w" result="wo"/>` +
        `<feDisplacementMap in="no" in2="wo" scale="${warp}" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
        `<feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>` +
        `<feComponentTransfer in="a" result="line"><feFuncA type="table" tableValues="${veinTable(width)}"/></feComponentTransfer>` +
        `<feFlood flood-color="${color}" result="c"/>` +
        `<feComposite in="c" in2="line" operator="in"/>`
    );

  const cloud = flt(
    "cloud",
    `<feTurbulence type="fractalNoise" baseFrequency="0.003 0.0045" numOctaves="4" seed="${m.seed + 2}" result="n"/>` +
      `<feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.38" result="a"/>` +
      `<feFlood flood-color="${m.cloud}" result="c"/>` +
      `<feComposite in="c" in2="a" operator="in"/>`
  );

  const layer = (id, op) =>
    `<rect width="${W}" height="${H}" fill="#000" fill-opacity="0" filter="url(#${id})" opacity="${op}"/>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m.bg[0]}"/><stop offset="1" stop-color="${m.bg[1]}"/></linearGradient>` +
    `<linearGradient id="polish" x1="0" y1="0" x2="1" y2="0.7"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    cloud +
    vein("v1", m.seed, 0.0032, 0.0075, 1.5, 150, m.vein) +
    vein("v2", m.seed + 11, 0.0055, 0.011, 1.1, 110, m.vein2) +
    vein("v3", m.seed + 29, 0.0028, 0.006, 0.8, 170, m.gold) +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>` +
    layer("cloud", 1) +
    layer("v2", 0.55) +
    layer("v1", 0.85) +
    layer("v3", 0.9) +
    `<rect width="${W}" height="${H}" fill="url(#polish)"/>` +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

const FEATURES = [
  "Project-oriented natural stone sourcing",
  "Clear specification & finish coordination",
  "Material selection aligned with architectural intent",
];

export default function AboutUs({
  images = {},
  founder = {
    name: "IE Marbles",
    role: "Stone, Curated · Sourcing & Specification",
    image: "",
  },
  learnMoreHref = "/about",
}) {
  const [ref, visible] = useReveal();

  const art = useMemo(
    () => ({
      carrara: marbleUri(STONES.carrara),
      grey: marbleUri(STONES.grey),
      emperador: marbleUri(STONES.emperador, 900, 1500),
      nero: marbleUri(STONES.nero, 400, 400),
    }),
    []
  );

  const panels = [
    {
      key: "top",
      cls: "about__panel--top",
      src: images.top || "/Images/Home/About/Selected Marble Slabs.png",
      label: "Selected Marble Slabs",
      d: "0.1s",
    },
    {
      key: "bottom",
      cls: "about__panel--bottom",
      src: images.bottom || "/Images/Home/About/Distinctive Quartzite.png",
      label: "Distinctive Quartzite",
      d: "0.35s",
    },
    {
      key: "tall",
      cls: "about__panel--tall",
      src: images.tall || "/Images/Home/About/Textured Travertine.png",
      label: "Textured Travertine",
      d: "0.2s",
    },
  ];

  const swatches = [
    { name: STONES.carrara.name, src: art.carrara },
    { name: STONES.grey.name, src: art.grey },
    { name: STONES.emperador.name, src: art.emperador },
    { name: STONES.nero.name, src: art.nero },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className={`about${visible ? " is-visible" : ""}`}
      aria-labelledby="about-title"
    >
      <svg
        className="about__veins"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M-40 140 C 240 200, 420 60, 700 140 S 1120 260, 1500 120" />
        <path d="M-20 760 C 200 700, 420 820, 720 760 S 1120 660, 1500 780" />
        <path className="gold" d="M900 -10 C 940 120, 880 200, 960 330" />
      </svg>

      <div className="about__inner">
        <div className="about__media">
          {panels.map((p) => (
            <figure
              key={p.key}
              className={`about__panel ${p.cls}`}
              style={{ "--d": p.d }}
            >
              <span className="about__panel-line" aria-hidden="true" />
              <div className="about__img">
                <img
                  src={p.src}
                  alt={`${p.label} natural stone reference`}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <span className="about__shine" aria-hidden="true" />
                <figcaption className="about__caption">
                  <i aria-hidden="true" />
                  {p.label}
                </figcaption>
              </div>
            </figure>
          ))}

          <Link
            className="about__badge about__reveal"
            style={{ "--d": "0.7s" }}
            to={learnMoreHref}
            aria-label="Learn more about IE Marbles"
          >
            <svg
              className="about__ring"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="aboutRingPath"
                  d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                />
              </defs>
              <text>
                <textPath
                  href="#aboutRingPath"
                  textLength="484"
                  lengthAdjust="spacing"
                >
                IE MARBLES {" "}
                </textPath>
              </text>
            </svg>
            <span className="about__badge-core" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
              </svg>
            </span>
          </Link>
        </div>

        <div className="about__content">
          <span className="about__tag about__reveal" style={{ "--d": "0.1s" }}>
            <i className="about__diamond" aria-hidden="true" />
            IE Marbles
          </span>

          <h2
            id="about-title"
            className="about__title about__reveal"
            style={{ "--d": "0.25s" }}
          >
            Where Natural Stone Meets Architectural Intent
          </h2>

          <p className="about__text about__reveal" style={{ "--d": "0.4s" }}>
            We are a natural-stone sourcing and supply business focused on helping architects, designers, developers and private clients identify materials suited to their projects.
          </p>

          <div
            className="about__quote about__reveal"
            style={{ "--d": "0.55s" }}
          >
            <span className="about__quote-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
                <path d="M3 12l9 4.5 9-4.5" />
                <path d="M3 16.5L12 21l9-4.5" />
              </svg>
            </span>
            <p>
              The right stone should do more than complete a space. It should belong to it.
            </p>
          </div>

          <ul
            className="about__stones about__reveal"
            style={{ "--d": "0.7s" }}
            aria-label="Curated stone categories"
          >
            {swatches.map((s) => (
              <li key={s.name}>
                <span
                  className="about__swatch"
                  style={{ backgroundImage: `url("${s.src}")` }}
                  aria-hidden="true"
                />
                {s.name}
              </li>
            ))}
          </ul>

          <div
            className="about__foot about__reveal"
            style={{ "--d": "0.85s" }}
          >
            <ul className="about__list">
              {FEATURES.map((f) => (
                <li key={f}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <div className="about__founder">
              <span className="about__avatar">
                {founder.image ? (
                  <img src={founder.image} alt={founder.name} />
                ) : (
                  "IE"
                )}
              </span>
              <strong>{founder.name}</strong>
              <span>{founder.role}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}