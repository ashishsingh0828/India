import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../../config";
import "./About.css";

export default function About() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`about-story${visible ? " is-visible" : ""}`}>
      <div className="about-story-inner">
        <div className="about-story-media">
          <div className="about-story-imgbox">
            <img
              src="/Images/About/Main/about.png"
              alt="Natural stone slab detailing, veining, and texture"
              loading="lazy"
            />
            <span className="about-story-frame" aria-hidden="true" />
          </div>
          <div className="about-story-badge">
            <span className="about-story-badge-num">STONE</span>
            <span className="about-story-badge-lbl">Curated with Intent</span>
          </div>
        </div>

        <div className="about-story-content">
          <span className="about-story-pill">
            <i aria-hidden="true" />
            IE Marbles 
          </span>

          <h2 className="about-story-title">
            Where Natural Stone Meets Architectural Intent
          </h2>

          <p className="about-story-lead">
            IE Marbles is a natural-stone sourcing and supply business focused on helping architects, designers, developers and private clients identify materials suited to their projects.
          </p>

          <p className="about-story-text">
            From expressive marble and distinctive quartzite to the subtle textures of travertine and limestone, our approach begins with understanding how a material will contribute to a space. Working within the natural-stone ecosystem, we coordinate project-specific sourcing, material selection and, where required, processing and supply arrangements through relevant suppliers and specialist partners.
          </p>

          <div className="about-story-pillars">
            <div className="about-pillar">
              <span className="about-pillar-icon">✦</span>
              <div className="about-pillar-text">
                <strong>Material Understanding</strong>
                <p>We consider natural variation, color, veining, and finish alongside the demands of the intended application.</p>
              </div>
            </div>
            <div className="about-pillar">
              <span className="about-pillar-icon">✦</span>
              <div className="about-pillar-text">
                <strong>Procurement Coordination</strong>
                <p>Aligning project dimensions, finishes, and quantities through transparent supplier and processing coordination.</p>
              </div>
            </div>
          </div>

          <div className="about-story-action">
            <Link className="about-story-btn" to="/contact">
              <span>Discuss a Project</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}