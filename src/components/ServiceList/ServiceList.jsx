import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ServiceList.css";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ServiceItem({ service, index }) {
  const itemRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(null);
  const href = `/services/${service.slug}`; // -> your service-details route

  /* Fade-up: runs on page load/refresh (items already in view) and on scroll */
  useEffect(() => {
    const el = itemRef.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    imgRef.current?.complete && imgRef.current.classList.add("is-loaded");
    return () => { io.disconnect(); clearTimeout(timer.current); };
  }, []);

  const draw = useCallback((block) => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    if (!image?.naturalWidth || !canvas) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
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

  const stop = () => {
    clearTimeout(timer.current);
    canvasRef.current.classList.remove("is-wipe", "is-on");
  };

  /* Hover: pixelate, then the sharp image sweeps back in from the left */
  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvasRef.current;
    stop();
    if (!draw(28)) return;
    void c.offsetWidth;
    c.classList.add("is-on");
    timer.current = setTimeout(() => { draw(14); c.classList.add("is-wipe"); }, 170);
  };

  return (
    <div
      ref={itemRef}
      className="sl-item"
      style={{ transitionDelay: `${100 + index * 150}ms` }}
    >
      <Link
        className="sl-thumb"
        to={href}
        aria-label={service.title}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <img
          ref={imgRef}
          src={service.image || undefined}
          alt={service.title}
          loading="lazy"
          onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
        />
        <canvas ref={canvasRef} className="sl-pixel" aria-hidden="true" />
        <span className="sl-icon"><ArrowUpRight /></span>
      </Link>

      <div className="sl-body">
        <h4 className="sl-title">
          <Link to={href}>{service.title}</Link>
        </h4>
        <p className="sl-desc">{service.description}</p>
      </div>
    </div>
  );
}

export default function ServiceList({ services = [] }) {
  return (
    <section className="sl-section">
      <div className="sl-grid">
        {services.map((s, i) => (
          <ServiceItem key={s.slug} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
