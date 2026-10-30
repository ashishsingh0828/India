import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { pic } from "../../data/images";
import "./BlogList.css";

const ENTER = ["right", "left", "bottom", "top"];

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function BlogCard({ post, index }) {
  const cardRef = useRef(null);
  const href = `/blogs/${post.slug}`;
  const enter = ENTER[index % ENTER.length];

  useEffect(() => {
    const el = cardRef.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aRef = useRef(null);
  const bRef = useRef(null);
  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
  }, [post.image]);

  return (
    <article
      ref={cardRef}
      className="bl-card"
      data-enter={enter}
      style={{ transitionDelay: `${(index % 3) * 120}ms` }}
    >
      <Link className="bl-thumb" to={href} aria-label={post.title}>
        <img ref={aRef} className="bl-img bl-img-a" src={pic(post.image, index)} alt={post.title} loading="lazy" onLoad={markLoaded} />
        <img ref={bRef} className="bl-img bl-img-b" src={pic(post.image, index + 2)} alt="" aria-hidden="true" loading="lazy" onLoad={markLoaded} />
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
