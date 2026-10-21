import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../api";
import "./OurServices.css";

/* ------------------------------------------------------------------ */
/*  IE Marbles – Our Services                                          */
/*  Connected directly with Express & MongoDB Admin Panel              */
/*  Fallback SVG marble procedural textures when photos aren't loaded. */
/* ------------------------------------------------------------------ */

const STONES = {
  carrara: { seed: 7, bg: ["#fbfaf8", "#e6e2db"], cloud: "#cfc9bf", vein: "#6c7078", vein2: "#a7aab0", gold: "#c9a24b" },
  emperador: { seed: 21, bg: ["#7b5a3e", "#46321f"], cloud: "#2c1e12", vein: "#f0e1c0", vein2: "#c9a24b", gold: "#e6c97c" },
  grey: { seed: 43, bg: ["#e4e5e7", "#b3b5b9"], cloud: "#8d9096", vein: "#4d515a", vein2: "#ffffff", gold: "#c9a24b" },
  nero: { seed: 64, bg: ["#27231f", "#0c0a08"], cloud: "#3a332b", vein: "#dcb85e", vein2: "#f3e3b0", gold: "#b98a2e" },
};

const DEFAULT_SERVICES = [
  {
    title: "Marble Flooring",
    text: "Polished and honed marble floors, laid with tight joints for a seamless, long-lasting finish.",
    stone: "carrara",
    slug: "marble-flooring",
    image: "/Images/About Us images/Calacatta Crema Marble.png",
  },
  {
    title: "Wall Cladding",
    text: "Feature walls and full-height cladding in book-matched marble and natural stone.",
    stone: "emperador",
    slug: "wall-cladding",
    image: "/Images/About Us images/Calacatta Viola Marble.png",
  },
  {
    title: "Kitchen & Bath Surfaces",
    text: "Countertops, vanities and wet-area surfaces cut to measure and sealed against stains.",
    stone: "grey",
    slug: "kitchen-and-bath",
    image: "/Images/About Us images/Statuario Baratini Marble.png",
  },
  {
    title: "Staircases & Inlays",
    text: "Marble steps, borders and gold inlay details made to measure for entrances and feature spaces.",
    stone: "nero",
    slug: "staircases-and-inlays",
    image: "/Images/About Us images/Thasos Velluto Marble.png",
  },
];

/* thin vein lines where the noise crosses ~0.49 */
function veinTable(width) {
  return Array.from({ length: 40 }, (_, i) =>
    Math.max(0, 1 - Math.abs(i - 19) / width).toFixed(3)
  ).join(" ");
}

/* built once as a cached image so hover and scroll stay smooth */
function marbleUri(m, W = 800, H = 800) {
  const k = 1.5;
  const flt = (id, inner) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">${inner}</filter>`;
  const opaque =
    '<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"';

  const vein = (id, seed, fx, fy, width, warp, color) =>
    flt(
      id,
      `<feTurbulence type="fractalNoise" baseFrequency="${fx * k} ${fy * k}" numOctaves="5" seed="${seed}" result="n"/>` +
        `${opaque} in="n" result="no"/>` +
        `<feTurbulence type="fractalNoise" baseFrequency="0.003 0.0045" numOctaves="3" seed="${seed + 5}" result="w"/>` +
        `${opaque} in="w" result="wo"/>` +
        `<feDisplacementMap in="no" in2="wo" scale="${warp}" xChannelSelector="R" yChannelSelector="G" result="d"/>` +
        `<feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>` +
        `<feComponentTransfer in="a" result="line"><feFuncA type="table" tableValues="${veinTable(width)}"/></feComponentTransfer>` +
        `<feFlood flood-color="${color}" result="c"/>` +
        `<feComposite in="c" in2="line" operator="in"/>`
    );

  const cloud = flt(
    "cloud",
    `<feTurbulence type="fractalNoise" baseFrequency="0.0026 0.004" numOctaves="4" seed="${m.seed + 2}" result="n"/>` +
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
    vein("v1", m.seed, 0.0032, 0.0075, 1.5, 140, m.vein) +
    vein("v2", m.seed + 11, 0.0055, 0.011, 1.1, 100, m.vein2) +
    vein("v3", m.seed + 29, 0.0028, 0.006, 0.8, 160, m.gold) +
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

function useReveal(threshold = 0.15) {
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
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const TITLE = "Transforming spaces with perfect marble finishes";

export default function OurServices() {
  const [ref, visible] = useReveal();
  const apiServices = useApi("/services").data;

  // Use dynamic services from Admin panel if available, else default list
  const services = useMemo(() => {
    if (Array.isArray(apiServices) && apiServices.length > 0) {
      const stoneKeys = ["carrara", "emperador", "grey", "nero"];
      return apiServices.slice(0, 4).map((s, idx) => ({
        title: s.title,
        text: s.shortText || s.summary || s.description || "Precision cut and installed natural stone surfaces.",
        stone: stoneKeys[idx % stoneKeys.length],
        image: s.image ? (s.image.startsWith("http") ? s.image : `/uploads/${s.image}`) : null,
        slug: s.slug || `service-${idx}`,
      }));
    }
    return DEFAULT_SERVICES;
  }, [apiServices]);

  const art = useMemo(
    () =>
      services.map((s) => ({
        base: s.image || marbleUri(STONES[s.stone] || STONES.carrara),
        hover: s.image || null,
      })),
    [services]
  );

  const words = TITLE.split(" ");

  return (
    <section
      ref={ref}
      id="services"
      className={`services${visible ? " is-visible" : ""}`}
      aria-labelledby="services-title"
    >
      <svg className="services__veins" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-40 120 C 260 180, 460 40, 740 120 S 1140 240, 1500 100" />
        <path d="M-20 780 C 220 720, 440 840, 740 780 S 1140 680, 1500 800" />
        <path className="gold" d="M1000 -10 C 1040 110, 980 190, 1060 320" />
      </svg>

      <div className="services__inner">
        {/* ---------------- Header ---------------- */}
        <header className="services__head">
          <div className="services__head-left">
            <span className="services__tag services__fade" style={{ "--d": "0.05s" }}>
              <i aria-hidden="true" />
              Services we provide
            </span>

            <h2 id="services-title" className="services__title" aria-label={TITLE}>
              {words.map((w, i) => (
                <span key={`${w}-${i}`}>
                  <span className="services__word" aria-hidden="true">
                    <span className="services__word-in" style={{ "--w": i }}>
                      {w}
                    </span>
                  </span>
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </h2>
          </div>

          <p className="services__lead services__fade" style={{ "--d": "0.5s" }}>
            We are a professional marble and natural stone studio. From supply
            and cutting to polishing and installation, we deliver finished
            interiors for homes, hotels and commercial projects.
          </p>
        </header>

        <span className="services__rule" aria-hidden="true" />

        {/* ---------------- Cards ---------------- */}
        <ul className="services__grid">
          {services.map((s, i) => {
            const href = `/services/${s.slug}`;
            return (
              <li
                key={s.title + i}
                className="services__card services__fade"
                style={{ "--d": `${0.6 + i * 0.16}s` }}
              >
                <div className="services__media">
                  <div className="services__imgs">
                    <img
                      className="services__img services__img--base"
                      src={art[i].base}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    <img
                      className="services__img services__img--hover"
                      src={art[i].hover || art[i].base}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                    <span className="services__tint" aria-hidden="true" />
                  </div>

                  <Link className="services__icon" to={href} aria-label={`Learn more about ${s.title}`}>
                    <ArrowIcon />
                  </Link>
                </div>

                <div className="services__body">
                  <h3 className="services__name">
                    <Link to={href}>{s.title}</Link>
                  </h3>
                  <p className="services__text">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ---------------- Bottom link ---------------- */}
        <div className="services__more services__fade" style={{ "--d": "1.3s" }}>
          <Link className="services__all" to="/services">
            <span>View all services</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
