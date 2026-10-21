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
              src="/Images/Banner Slider images/1.png"
              alt="Master artisan cutting luxury marble slabs"
              loading="lazy"
            />
            <span className="about-story-frame" aria-hidden="true" />
          </div>
          <div className="about-story-badge">
            <span className="about-story-badge-num">25+</span>
            <span className="about-story-badge-lbl">Years of Marble Excellence</span>
          </div>
        </div>

        <div className="about-story-content">
          <span className="about-story-pill">
            <i aria-hidden="true" />
            Our Heritage &amp; Philosophy
          </span>

          <h2 className="about-story-title">
            Where Ancient Earth Art Meets Modern Architectural Precision
          </h2>

          <p className="about-story-lead">
            Founded with an enduring passion for authentic natural stone, IE Marbles has grown into one of India’s premier luxury marble purveyors and precision fabricators.
          </p>

          <p className="about-story-text">
            Every slab in our Kishangarh gallery is curated in person directly from prestigious Italian quarries in Carrara and Verona, along with the finest regional deposits in Rajasthan. We honor each block’s unique geological journey—matching veins across expansive living spaces, honing surfaces to tactile perfection, and securing long-term durability with advanced sealing systems.
          </p>

          <div className="about-story-pillars">
            <div className="about-pillar">
              <span className="about-pillar-icon">✦</span>
              <div className="about-pillar-text">
                <strong>Quarry-Direct Sourcing</strong>
                <p>No intermediaries; hand-inspected blocks from Italy and India.</p>
              </div>
            </div>
            <div className="about-pillar">
              <span className="about-pillar-icon">✦</span>
              <div className="about-pillar-text">
                <strong>Master Stonemasons</strong>
                <p>Decades of collective craftsmanship in tight-joint dry lays and book-matching.</p>
              </div>
            </div>
          </div>

          <div className="about-story-action">
            <Link className="about-story-btn" to="/contact">
              <span>Schedule a Private Viewing</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
