import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { slugify } from "../../api";
import "./BlogDetails.css";

const ENTER = ["right", "left", "bottom", "top"];

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

function FadeImage({ src, alt = "", className = "", enter = "right" }) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
  }, [src]);

  return (
    <div className={`bd-pix ${className}`} data-enter={enter}>
      <img ref={aRef} className="bd-img bd-img-a" src={src || "/Images/Banner Slider images/1.png"} alt={alt} loading="lazy" onLoad={markLoaded} />
      <img ref={bRef} className="bd-img bd-img-b" src={src || "/Images/Banner Slider images/3.png"} alt="" aria-hidden="true" loading="lazy" onLoad={markLoaded} />
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
                <FadeImage src={post.hero} alt={post.introHeading} enter={ENTER[0]} />
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
                    <FadeImage src={g} className="bd-gallery-img" enter={ENTER[i % ENTER.length]} />
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
                  <FadeImage src={post.approachImage} className="bd-approach-img" enter={ENTER[2]} />
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
                    <img src={r.image || "/Images/Banner Slider images/1.png"} alt="" loading="lazy" />
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
