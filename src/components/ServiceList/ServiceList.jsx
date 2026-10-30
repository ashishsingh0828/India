import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { pic } from "../../data/images";
import "./ServiceList.css";

const ENTER = ["right", "left", "bottom", "top"];

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ServiceItem({ service, index }) {
  const itemRef = useRef(null);
  const href = `/services/${service.slug}`;
  const enter = ENTER[index % ENTER.length];

  useEffect(() => {
    const el = itemRef.current;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aRef = useRef(null);
  const bRef = useRef(null);
  const markLoaded = (e) => e.currentTarget.classList.add("is-loaded");

  useEffect(() => {
    [aRef.current, bRef.current].forEach((el) => el?.complete && el.classList.add("is-loaded"));
  }, [service.image]);

  return (
    <div
      ref={itemRef}
      className="sl-item"
      data-enter={enter}
      style={{ transitionDelay: `${100 + index * 150}ms` }}
    >
      <Link className="sl-thumb" to={href} aria-label={service.title}>
        <img
          ref={aRef}
          className="sl-img sl-img-a"
          src={pic(service.image, index)}
          alt={service.title}
          loading="lazy"
          onLoad={markLoaded}
        />
        <img
          ref={bRef}
          className="sl-img sl-img-b"
          src={pic(service.image, index + 1)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onLoad={markLoaded}
        />
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
