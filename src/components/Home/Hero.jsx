import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const SLIDES = [
  {
    id: "carrara",
    name: "White Carrara",
    note: "Classic Italian white marble with grey veining",
    title: "Natural stone, curated for your project",
    text: "Marble, quartzite, travertine and limestone, selected with architects, designers and developers for the spaces they shape.",
    theme: "light",
    scrim: "250, 247, 242",
    image: "/Images/Home/Slider Benner/1.png",
    marble: {
      seed: 7,
      bg: ["#fbfaf8", "#e6e2db"],
      cloud: "#cfc9bf",
      vein: "#6c7078",
      vein2: "#a7aab0",
      gold: "#c9a24b",
    },
  },
  {
    id: "emperador",
    name: "Emperador Dark Brown",
    note: "Deep brown marble with gold & cream veins",
    title: "Emperador brown for floors with depth",
    text: "Rich brown stone with fine honey veining, suited to floors, feature walls and staircases.",
    theme: "dark",
    scrim: "52, 36, 23",
 image: "/Images/Home/Slider Benner/2.png",
    marble: {
      seed: 21,
      bg: ["#7b5a3e", "#46321f"],
      cloud: "#2c1e12",
      vein: "#f0e1c0",
      vein2: "#c9a24b",
      gold: "#e6c97c",
    },
  },
  {
    id: "grey",
    name: "Statuario & Grey Vein",
    note: "Refined grey veined marble for serene modern rooms",
    title: "Quiet grey veining for calm rooms",
    text: "Statuario and grey-veined marble for kitchens, bathrooms and living spaces that stay bright and balanced.",
    theme: "light",
    scrim: "244, 244, 245",
   image: "/Images/Home/Slider Benner/3.png",
    marble: {
      seed: 43,
      bg: ["#e4e5e7", "#b3b5b9"],
      cloud: "#8d9096",
      vein: "#4d515a",
      vein2: "#ffffff",
      gold: "#c9a24b",
    },
  },
  {
    id: "gold",
    name: "Nero Marquina & Gold",
    note: "Deep black natural stone with gold accents",
    title: "Black stone with gold veining",
    text: "Stone selection and processing coordination for book-matched feature walls and statement entrances.",
    theme: "dark",
    scrim: "20, 17, 14",
 image: "/Images/Home/Slider Benner/4.png",
    marble: {
      seed: 64,
      bg: ["#27231f", "#0c0a08"],
      cloud: "#3a332b",
      vein: "#dcb85e",
      vein2: "#f3e3b0",
      gold: "#b98a2e",
    },
  },
];

function veinTable(width) {
  const n = 40;
  const peak = 19;
  return Array.from({ length: n }, (_, i) =>
    Math.max(0, 1 - Math.abs(i - peak) / width).toFixed(3)
  ).join(" ");
}

function marbleUri(slide) {
  const { marble: m } = slide;
  const W = 1600;
  const H = 900;
  const flt = (id, inner) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">${inner}</filter>`;
  const opaque =
    '<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"';

  const vein = (id, seed, freq, width, warp, color) =>
    flt(
      id,
      `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="5" seed="${seed}" result="n"/>` +
        `${opaque} in="n" result="no"/>` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0035" numOctaves="3" seed="${seed + 5}" result="w"/>` +
        `${opaque} in="w" result="wo"/>` +
        `<feDisplacementMap in="no" in2="wo" scale="${warp}" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
        `<feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>` +
        `<feComponentTransfer in="a" result="line"><feFuncA type="table" tableValues="${veinTable(width)}"/></feComponentTransfer>` +
        `<feFlood flood-color="${color}" result="c"/>` +
        `<feComposite in="c" in2="line" operator="in"/>`
    );

  const cloud = flt(
    "cloud",
    `<feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0028" numOctaves="4" seed="${m.seed + 2}" result="n"/>` +
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
    `<linearGradient id="polish" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    cloud +
    vein("v1", m.seed, "0.0032 0.0075", 1.5, 190, m.vein) +
    vein("v2", m.seed + 11, "0.0055 0.011", 1.1, 130, m.vein2) +
    vein("v3", m.seed + 29, "0.0028 0.006", 0.8, 220, m.gold) +
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

const pad = (n) => String(n + 1).padStart(2, "0");

export default function Hero({
  slides = SLIDES,
  exploreHref = "/services",
  quoteHref = "/contact",
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const count = slides.length;
  const marbles = useMemo(
    () => slides.map((s) => (s.image ? s.image : marbleUri(s))),
    [slides]
  );

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const onPointerDown = (e) => {
    touchX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (touchX.current === null) return;
    const dx = e.clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  return (
    <section
      className={`hero${paused ? " is-paused" : ""}`}
      data-theme={slides[index].theme}
      aria-roledescription="carousel"
      aria-label="IE Marbles featured stone"
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setPaused(true);
      }}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const Title = i === 0 ? "h1" : "h2";
        return (
          <div
            key={s.id}
            className={`hero__slide${active ? " is-active" : ""}`}
            data-theme={s.theme}
            style={{ "--scrim": s.scrim }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
          >
            <img
              className="hero__photo"
              src={marbles[i]}
              alt=""
              decoding="async"
              draggable="false"
            />
            <div className="hero__scrim" />

            <div className="hero__inner">
              <div className="hero__content">
                <span className="hero__badge">
                  <i className="hero__diamond" aria-hidden="true" />
                  Stone, curated
                </span>

                <Title className="hero__title">{s.title}</Title>

                <span className="hero__rule" aria-hidden="true" />

                <p className="hero__text">{s.text}</p>

                <div className="hero__actions">
                  <Link className="hero__btn hero__btn--solid" to={exploreHref}>
                    Enquire About a Stone
                  </Link>
                  <Link className="hero__btn hero__btn--ghost" to={quoteHref}>
                    Discuss a Project
                  </Link>
                </div>
              </div>

              <div className="hero__caption">
                <strong>{s.name}</strong>
                <span>{s.note}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hero__frame" aria-hidden="true" />

      <div className="hero__bar">
        <ol className="hero__tabs">
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`hero__tab${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Show ${s.name}`}
                aria-current={i === index}
              >
                <span className="hero__tab-line">
                  {i === index && (
                    <span
                      key={`fill-${index}`}
                      className="hero__tab-fill"
                      onAnimationEnd={(e) => {
                        if (e.animationName === "heroFill") next();
                      }}
                    />
                  )}
                </span>
                <span className="hero__tab-num">{pad(i)}</span>
                <span className="hero__tab-name">{s.name}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="hero__arrows">
          <button type="button" className="hero__arrow" onClick={prev} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="hero__arrow" onClick={next} aria-label="Next slide">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}