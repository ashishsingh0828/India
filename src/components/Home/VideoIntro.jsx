import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./VideoIntro.css";

const STONE = {
  seed: 64,
  bg: ["#27231f", "#0c0a08"],
  cloud: "#3a332b",
  vein: "#dcb85e",
  vein2: "#f3e3b0",
  gold: "#b98a2e",
};

function veinTable(width) {
  return Array.from({ length: 40 }, (_, i) =>
    Math.max(0, 1 - Math.abs(i - 19) / width).toFixed(3)
  ).join(" ");
}

function marbleUri(m, W = 1600, H = 900) {
  const flt = (id, inner) =>
    `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}" color-interpolation-filters="sRGB">${inner}</filter>`;
  const opaque =
    '<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"/>';

  const vein = (id, seed, fx, fy, width, warp, color) =>
    flt(
      id,
      `<feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="5" seed="${seed}" result="n"/>` +
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
    cloud +
    vein("v1", m.seed, 0.0032, 0.0075, 1.5, 190, m.vein) +
    vein("v2", m.seed + 11, 0.0055, 0.011, 1.1, 130, m.vein2) +
    vein("v3", m.seed + 29, 0.0028, 0.006, 0.8, 220, m.gold) +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>` +
    layer("cloud", 1) +
    layer("v2", 0.55) +
    layer("v1", 0.85) +
    layer("v3", 0.9) +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function useReveal(threshold = 0.25) {
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/**
 * Turns any normal YouTube / Vimeo link into an embeddable player URL.
 * Fixes: youtu.be links were previously sent to the Vimeo player (wrong site).
 */
function embedSrc(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let out = null;

    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      let id = null;
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else if (["embed", "shorts", "live", "v"].includes(parts[0])) id = parts[1];
      if (id) out = new URL(`https://www.youtube.com/embed/${id}`);
    } else if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) out = new URL(`https://www.youtube.com/embed/${id}`);
    } else if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) out = new URL(`https://player.vimeo.com/video/${id}`);
    } else if (host === "player.vimeo.com") {
      out = u;
    }

    if (!out) out = u; // unknown host: use as-is

    out.searchParams.set("autoplay", "1");
    out.searchParams.set("rel", "0");
    out.searchParams.set("playsinline", "1");
    return out.toString();
  } catch {
    return url;
  }
}

export default function VideoIntro({
  title = "STONE, CURATED",
  image = "/Images/Video section Images/Video section Images.png",
  videoUrl = "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
}) {
  const [ref, visible] = useReveal();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const playRef = useRef(null);
  const closeRef = useRef(null);
  const closingRef = useRef(false);

  const [imgSrc, setImgSrc] = useState(image || marbleUri(STONE));

  useEffect(() => {
    setImgSrc(image || marbleUri(STONE));
  }, [image]);

  const src = useMemo(() => embedSrc(videoUrl), [videoUrl]);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, [ref]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closingRef.current = false;
      playRef.current?.focus();
    }, 320);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const letters = Array.from(title);

  // Rendered into <body> so it always sits above the header, menus and every other section
  const modal =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className={`video__modal${closing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="IE Marbles"
            onClick={close}
          >
            <div className="video__dialog" onClick={(e) => e.stopPropagation()}>
              <button
                ref={closeRef}
                type="button"
                className="video__close"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                aria-label="Close video"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <div className="video__player">
                <iframe
                  src={src}
                  title="IE Marbles"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <section
      ref={ref}
      className={`video${visible ? " is-visible" : ""}`}
      onPointerMove={onMove}
      aria-label="IE Marbles introduction video"
    >
      <img
        className="video__bg"
        src={imgSrc}
        alt=""
        decoding="async"
        draggable="false"
        onError={() => {
          console.warn(`[VideoIntro] Could not load image from: ${imgSrc}. Falling back to procedural marble.`);
          setImgSrc(marbleUri(STONE));
        }}
      />
      {/* Dark overlay that keeps the text readable on bright images — tune it in VideoIntro.css (.video__shade) */}
      <div className="video__shade" aria-hidden="true" />
      <div className="video__spot" aria-hidden="true" />
      <div className="video__frame" aria-hidden="true" />

      <div className="video__stage">
        <button
          ref={playRef}
          type="button"
          className="video__play"
          onClick={() => setOpen(true)}
          aria-label="Play the IE Marbles video"
          aria-haspopup="dialog"
        >
          <span className="video__ripple" aria-hidden="true" />
          <span className="video__ripple video__ripple--2" aria-hidden="true" />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <span className="video__play-text">Play</span>
        </button>
      </div>

      <div className="video__meta">
        <span className="video__tag">
          <i aria-hidden="true" />
          IE Marbles
        </span>
        <p>A short introduction to how we help select and coordinate natural stone for your project.</p>
      </div>

      <h2 className="video__title" aria-label={title}>
        {letters.map((ch, i) =>
          ch === " " ? (
            <span key={i} className="video__space" aria-hidden="true" />
          ) : (
            <span key={i} className="video__wrap" style={{ "--i": i }} aria-hidden="true">
              <span className="video__char" data-char={ch}>
                {ch}
              </span>
            </span>
          )
        )}
      </h2>

      {modal}
    </section>
  );
}