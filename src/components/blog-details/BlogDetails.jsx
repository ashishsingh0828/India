import { useRef, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { slugify } from "../../api";
import "./BlogDetails.css";

/* ---------- Small helpers ---------- */
const ICONS = {
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zm-8 8a8 8 0 0116 0",
  cal: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4",
  folder: "M3 6h6l2 2h10v11H3z",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zm9 16l-4-4",
};
const Icon = ({ n, size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="bd-icon">
    <path d={ICONS[n]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Fade-up on scroll */
function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`bd-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/* Image with fade-in + pixelate -> sharp wipe (left to right) on hover */
function PixelImage({ src, alt = "", className = "" }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    imgRef.current?.complete && imgRef.current.classList.add("is-loaded");
    return () => clearTimeout(timer.current);
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
  const start = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = canvasRef.current;
    stop();
    if (!draw(26)) return;
    void c.offsetWidth;
    c.classList.add("is-on");
    timer.current = setTimeout(() => { draw(12); c.classList.add("is-wipe"); }, 170);
  };

  return (
    <div className={`bd-pix ${className}`} onMouseEnter={start} onMouseLeave={stop}>
      <img ref={imgRef} src={src || undefined} alt={alt} loading="lazy" onLoad={(e) => e.currentTarget.classList.add("is-loaded")} />
      <canvas ref={canvasRef} className="bd-pixel" aria-hidden="true" />
    </div>
  );
}

/* ---------- Page ---------- */
export default function BlogDetails({ post, recent = [], categories = [], tags = [] }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    nav(`/blogs?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="bd-section">
      <div className="bd-container">
        {/* ============ MAIN ============ */}
        <div className="bd-main">
          <article>
            {post.hero && (
              <Reveal className="bd-hero">
                <PixelImage src={post.hero} alt={post.introHeading} />
              </Reveal>
            )}

            <Reveal as="ul" className="bd-meta bd-meta--top">
              <li><Icon n="user" /> By <Link to={`/blogs?author=${encodeURIComponent(post.author)}`}>{post.author}</Link></li>
              <li><Icon n="cal" /> <span>{post.date}</span></li>
              {post.category && <li><Icon n="folder" /> <Link to={`/blogs?category=${slugify(post.category)}`}>{post.category}</Link></li>}
            </Reveal>

            <Reveal as="h3" className="bd-h3">{post.introHeading}</Reveal>
            {post.introText && <Reveal as="p" delay={80}>{post.introText}</Reveal>}

            {post.gallery?.length > 0 && (
              <div className="bd-gallery">
                {post.gallery.map((g, i) => (
                  <Reveal key={`${g}-${i}`} delay={i * 120}>
                    <PixelImage src={g} className="bd-gallery-img" />
                  </Reveal>
                ))}
              </div>
            )}

            {post.secondText && <Reveal as="h3" className="bd-h3">{post.secondHeading}</Reveal>}
            {post.secondText && <Reveal as="p" delay={80}>{post.secondText}</Reveal>}

            {post.approachItems?.length > 0 && (
            <div className={`bd-approach ${post.approachImage ? "" : "bd-approach--solo"}`}>
              <Reveal>
                <h3 className="bd-h3">{post.approachHeading}</h3>
                <ul className="bd-list">
                  {post.approachItems.map((it, i) => (
                    <li key={`${it}-${i}`}>
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                        <path d="M1 8h12M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              {post.approachImage && (
                <Reveal delay={150}>
                  <PixelImage src={post.approachImage} className="bd-approach-img" />
                </Reveal>
              )}
            </div>
            )}
          </article>

          {(post.category || post.tags.length > 0) && (
          <Reveal className="bd-bottom">
            {post.category && (
            <span className="bd-bottom-group">
              <span className="bd-bottom-label">Posted in</span>
              <Link className="bd-badge" to={`/blogs?category=${slugify(post.category)}`}>{post.category}</Link>
            </span>
            )}
            {post.tags.length > 0 && (
            <span className="bd-bottom-group">
              <span className="bd-bottom-label">Tags</span>
              {post.tags.map((t) => (
                <Link key={t} className="bd-tag-outline" to={`/blogs?tag=${slugify(t)}`}>{t}</Link>
              ))}
            </span>
            )}
          </Reveal>
          )}
        </div>

        {/* ============ SIDEBAR ============ */}
        <aside className="bd-side">
          <Reveal className="bd-widget" delay={100}>
            <h4 className="bd-w-title">Search</h4>
            <form className="bd-search" onSubmit={onSearch} role="search">
              <input type="search" required placeholder="Search here..." value={q} onChange={(e) => setQ(e.target.value)} />
              <button type="submit" aria-label="Search"><Icon n="search" size={16} /></button>
            </form>
          </Reveal>

          {recent.length > 0 && (
          <Reveal className="bd-widget" delay={160}>
            <h4 className="bd-w-title">Recent Posts</h4>
            <ul className="bd-recent">
              {recent.map((r) => (
                <li key={r.slug}>
                  <Link className="bd-recent-thumb" to={`/blogs/${r.slug}`} tabIndex={-1} aria-hidden="true">
                    <img src={r.image || undefined} alt="" loading="lazy" />
                  </Link>
                  <Link className="bd-recent-title" to={`/blogs/${r.slug}`}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </Reveal>
          )}

          {categories.length > 0 && (
          <Reveal className="bd-widget" delay={220}>
            <h4 className="bd-w-title bd-line">Categories</h4>
            <ul className="bd-cats">
              {categories.map((c) => (
                <li key={c}>
                  <Link to={`/blogs?category=${slugify(c)}`}><Icon n="folder" size={13} /> <span>{c}</span></Link>
                </li>
              ))}
            </ul>
          </Reveal>
          )}

          {tags.length > 0 && (
          <Reveal className="bd-widget" delay={280}>
            <h4 className="bd-w-title bd-line">Tags</h4>
            <div className="bd-tags">
              {tags.map((t) => (
                <Link key={t} to={`/blogs?tag=${slugify(t)}`}>{t}</Link>
              ))}
            </div>
          </Reveal>
          )}
        </aside>
      </div>
    </section>
  );
}
