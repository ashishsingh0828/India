import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { asset } from "../../api";
import { pic } from "../../data/images";
import "./ProjectGallery.css";

const ENTER = ["right", "left", "bottom", "top"];

export function GalleryCard({ title, a, b, href, index = 0 }) {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const enter = ENTER[index % ENTER.length];

  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
  }, []);

  return (
    <Link className="pg-card" to={href} data-enter={enter}>
      <img ref={aRef} className="pg-img pg-img-a" src={pic(a, index)} alt={title} loading="lazy" onLoad={markLoaded} />
      <img ref={bRef} className="pg-img pg-img-b" src={pic(b || a, index + 1)} alt="" aria-hidden="true" loading="lazy" onLoad={markLoaded} />
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
        {projects.map((p, index) => (
          <GalleryCard
            key={p.slug || p.id || p._id}
            title={p.title}
            a={asset(p.imageA)}
            b={asset(p.imageB || p.imageA)}
            href={`/projects/${p.slug}`}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
