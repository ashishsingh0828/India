import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { asset, paras, lines } from "../../api";
import { GalleryCard } from "../Gallery/ProjectGallery"; // same pixelate-swap card + white label
import "./ProjectDetail.css";

const card = (p) => ({ title: p.title, a: asset(p.imageA), b: asset(p.imageB), href: `/projects/${p.slug}` });

// API response -> the shape the page below renders
function toView(p) {
  const { prev, next, related } = p;
  const site = p.website && (/^https?:/.test(p.website) ? p.website : `https://${p.website}`);
  return {
    hero: asset(p.heroImage || p.imageA),
    info: [
      { label: "Clients", value: p.client },
      { label: "Project Type", value: p.projectType },
      { label: "Date", value: p.date },
      { label: "Website", value: p.website, link: site },
    ].filter((r) => r.value),
    heading: p.heading,
    paragraphs: paras(p.paragraphs),
    factsTitle: p.factsTitle,
    factsText: p.factsText,
    checks: lines(p.checks),
    prev: prev && { title: prev.title, href: `/projects/${prev.slug}` },
    next: next && { title: next.title, href: `/projects/${next.slug}` },
    related: (related || []).map(card),
  };
}

/* Fade-up when scrolled into view */
function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`pd-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

const Check = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
    <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" className={`pd-chev pd-chev-${dir}`}>
    <path d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProjectDetail({ data }) {
  const project = toView(data);

  return (
    <main className="pd">
      <div className="pd-container">
        {/* Top: image + info card */}
        <section className="pd-top">
          <Reveal className="pd-hero">
            <img
              src={project.hero || undefined}
              alt={project.heading}
              onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
              ref={(el) => el?.complete && el.classList.add("is-loaded")}
            />
          </Reveal>

          <Reveal className="pd-info" delay={120}>
            {project.info.map((row) => (
              <div className="pd-info-row" key={row.label}>
                <h5>{row.label}</h5>
                {row.link ? (
                  <a href={row.link} className="pd-info-link" target="_blank" rel="noreferrer">{row.value}</a>
                ) : (
                  <p>{row.value}</p>
                )}
              </div>
            ))}
          </Reveal>
        </section>

        {/* About */}
        <section className="pd-about">
          <Reveal as="h3">{project.heading}</Reveal>
          {project.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={80 * (i + 1)}>{p}</Reveal>
          ))}
        </section>

        {/* Facts */}
        {(project.factsText || project.checks.length > 0) && (
        <section className="pd-facts">
          <Reveal as="h3" className="pd-facts-title">{project.factsTitle}</Reveal>
          <div className="pd-facts-body">
            {project.factsText && <Reveal as="p" delay={100}>{project.factsText}</Reveal>}
            {project.checks.length > 0 && (
            <Reveal as="ul" className="pd-checks" delay={200}>
              {project.checks.map((c, i) => (
                <li key={`${c}-${i}`}><Check /> <span>{c}</span></li>
              ))}
            </Reveal>
            )}
          </div>
        </section>
        )}

        {/* Prev / Next */}
        <Reveal as="nav" className="pd-nav" aria-label="Project navigation">
          {project.prev ? (
            <Link rel="prev" to={project.prev.href} className="pd-nav-link">
              <Chevron dir="left" /> <span>{project.prev.title}</span>
            </Link>
          ) : <span />}
          {project.next && (
            <Link rel="next" to={project.next.href} className="pd-nav-link">
              <span>{project.next.title}</span> <Chevron dir="right" />
            </Link>
          )}
        </Reveal>

        {/* Related: same pixelate-swap cards + white label */}
        <section className="pg-section pd-related">
          <div className="pg-grid">
            {project.related.map((p, i) => (
              <Reveal key={p.href} delay={120 * i} className="pd-related-item">
                <GalleryCard {...p} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
