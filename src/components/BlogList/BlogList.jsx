import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./BlogList.css";

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BlogCard({ post, index }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(null);
  const href = `/blogs/${post.slug}`; // -> your blog-details route

  /* Fade-up when scrolled into view */
  useEffect(() => {
    const el = cardRef.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer.current); };
  }, []);

  /* Image fade-in on load (also covers cached images) */
  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");
  useEffect(() => {
    if (imgRef.current?.complete) imgRef.current.classList.add("is-loaded");
  }, []);

  /* Draw a pixelated copy of the image onto the canvas */
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
    const c = canvasRef.current;
    c.classList.remove("is-wipe");
    c.classList.remove("is-on");
  };

  /* Hover: image turns pixelated, then the sharp image comes back sweeping in from the left */
  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvasRef.current;
    stop();
    if (!draw(30)) return;
    void c.offsetWidth;            // restart transitions
    c.classList.add("is-on");      // fade in pixelated image
    timer.current = setTimeout(() => {
      draw(14);                    // slightly finer while it wipes away
      c.classList.add("is-wipe");  // wipes out left -> right, revealing the sharp image
    }, 170);
  };

  return (
    <article ref={cardRef} className="bl-card" style={{ transitionDelay: `${(index % 3) * 120}ms` }}>
      <Link
        className="bl-thumb"
        to={href}
        aria-label={post.title}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <img ref={imgRef} src={post.image || undefined} alt={post.title} loading="lazy" onLoad={markLoaded} />
        <canvas ref={canvasRef} className="bl-pixel" aria-hidden="true" />
      </Link>

      <div className="bl-body">
        {post.category && <span className="bl-cat">{post.category}</span>}
        <h4 className="bl-title">
          <Link to={href}>{post.title}</Link>
        </h4>
        <Link to={href} className="bl-read">
          <span className="bl-arrow bl-arrow-l"><Arrow /></span>
          <span className="bl-read-text">Read More</span>
          <span className="bl-arrow bl-arrow-r"><Arrow /></span>
        </Link>
      </div>
    </article>
  );
}

export default function BlogList({ posts = [] }) {
  return (
    <section className="bl-section">
      <div className="bl-grid">
        {posts.map((p, i) => (
          <BlogCard key={p.slug} post={p} index={i} />
        ))}
      </div>
    </section>
  );
}
