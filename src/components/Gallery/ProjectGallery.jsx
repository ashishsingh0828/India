import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { asset } from "../../api";
import "./ProjectGallery.css";

// Pixel block sizes, coarse -> fine
const STEPS = [64, 40, 24, 14, 8, 4];
const STEP_MS = 60;

export function GalleryCard({ title, a, b, href }) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(null);

  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  // Handle images that were already cached before React attached onLoad
  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
    return () => clearTimeout(timer.current);
  }, []);

  const draw = useCallback((image, block) => {
    const canvas = canvasRef.current;
    if (!image || !canvas || !image.naturalWidth) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // object-fit: cover source rect
    const ir = image.naturalWidth / image.naturalHeight;
    const cr = w / h;
    let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
    if (ir > cr) { sw = sh * cr; sx = (image.naturalWidth - sw) / 2; }
    else { sh = sw / cr; sy = (image.naturalHeight - sh) / 2; }

    const w2 = Math.max(1, Math.round(w / (block * dpr)));
    const h2 = Math.max(1, Math.round(h / (block * dpr)));
    const small = document.createElement("canvas");
    small.width = w2;
    small.height = h2;
    small.getContext("2d").drawImage(image, sx, sy, sw, sh, 0, 0, w2, h2);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(small, 0, 0, w2, h2, 0, 0, w, h);
    return true;
  }, []);

  // Pixelate (coarse -> sharp) into the target image, fading the canvas in and out
  const swapTo = (showSecond) => {
    clearTimeout(timer.current);
    const canvas = canvasRef.current;
    const target = showSecond ? bRef.current : aRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      bRef.current.classList.toggle("is-shown", showSecond);
      canvas.classList.remove("is-on");
    };

    if (reduce || !target?.naturalWidth) { finish(); return; }

    let i = 0;
    const tick = () => {
      if (i >= STEPS.length) { finish(); return; }
      draw(target, STEPS[i++]);
      canvas.classList.add("is-on");
      timer.current = setTimeout(tick, STEP_MS);
    };
    tick();
  };

  return (
    <Link
      className="pg-card"
      to={href}
      onMouseEnter={() => swapTo(true)}
      onMouseLeave={() => swapTo(false)}
      onFocus={() => swapTo(true)}
      onBlur={() => swapTo(false)}
    >
      <img ref={aRef} className="pg-img pg-img-a" src={a || undefined} alt={title} loading="lazy" onLoad={markLoaded} />
      <img ref={bRef} className="pg-img pg-img-b" src={b || undefined} alt="" aria-hidden="true" loading="lazy" />
      <canvas ref={canvasRef} className="pg-pixel" aria-hidden="true" />
      <span className="pg-label">
        <span className="pg-label-text">{title}</span>
      </span>
    </Link>
  );
}

export default function ProjectGallery({ projects = [] }) {
  return (
    <section className="pg-section">
      <div className="pg-grid">
        {projects.map((p) => (
          <GalleryCard
            key={p.id}
            title={p.title}
            a={asset(p.imageA)}
            b={asset(p.imageB || p.imageA)}
            href={`/projects/${p.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
