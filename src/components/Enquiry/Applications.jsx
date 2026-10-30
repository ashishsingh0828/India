import { useState } from "react";
import { Link } from "react-router-dom";
import useInView from "../hooks/useInView";
import { IMG } from "../../data/images";
import "./Applications.css";
export const APPLICATIONS_DATA = [
  {
    id: "01",
    tabTitle: "Feature Walls & Book-Matching",
    title: "Book-matched feature walls & vertical stone facade installations",
    description:
      "Stone selection and processing coordination for book-matched feature walls and vertical installations, where pattern symmetry, continuity, and vein alignment shape the entire interior space.",
    specifications: [
      { label: "Recommended finishes", value: "Polished, Honed, Leathered" },
      { label: "Slab thickness", value: "18mm to 20mm calibrated" },
      { label: "Coordination focus", value: "Dry-lay vein sequencing before delivery" },
    ],
    image: IMG.appVideo1,
    alt: "Book-matched luxury marble feature wall with bold veining",
  },
  {
    id: "02",
    tabTitle: "Facades & Exterior Cladding",
    title: "Dimensional and calibration requirements coordinated to agreed specification",
    description:
      "Precision-calibrated stone panels tailored for mechanically fixed facades and ventilated architectural envelopes, selected for resistance to thermal expansion and weathering.",
    specifications: [
      { label: "Recommended stones", value: "Quartzite, Granite, Dense Limestones" },
      { label: "Edge detailing", value: "Chamfered, Mitered, Calibrated backs" },
      { label: "Coordination focus", value: "Weight tolerance and structural anchors" },
    ],
    image: IMG.appVideo2,
    alt: "Refined light natural stone facade cladding",
  },
  {
    id: "03",
    tabTitle: "Staircases & Custom Risers",
    title: "Monolithic treads, risers and seamlessly matched landings",
    description:
      "Carefully graded stone slabs for stairs and transitions, ensuring continuous veining wraps down risers and edge profiles withstand high-traffic wear up close.",
    specifications: [
      { label: "Profile detailing", value: "Full bullnose, Pencil round, Mitered apron" },
      { label: "Surface texture", value: "Honed with fluted anti-slip inserts" },
      { label: "Coordination focus", value: "Color and batch uniformity across flights" },
    ],
    image: IMG.appVideo3,
    alt: "Solid natural stone staircase and architectural landing",
  },
  {
    id: "04",
    tabTitle: "Floors & Seamless Surfaces",
    title: "Expansive flooring, kitchen counters and bespoke bath vanities",
    description:
      "Sourcing low-porosity, high-density blocks curated for consistent floor spreads and monolithic kitchen surfaces that harmonize with custom cabinetry and fixtures.",
    specifications: [
      { label: "Treatments", value: "Hydrophobic deep-penetrating sealants" },
      { label: "Slab sizing", value: "Gang-saw jumbo slabs for minimum joints" },
      { label: "Coordination focus", value: "Flatness tolerances and lot consistency" },
    ],
    image: IMG.appVideo4,
    alt: "Warm toned marble suited to floors and architectural surfaces",
  },
];
export default function Applications() {
  const [ref, inView] = useInView();
  const [activeIdx, setActiveIdx] = useState(0);

  const onKeyDown = (e, index) => {
    const last = APPLICATIONS_DATA.length - 1;
    let next = null;
    if (e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActiveIdx(next);
      document.getElementById(`app-trigger-${next}`)?.focus();
    }
  };

  return (
    <section
      ref={ref}
      className={`app-curation${inView ? " is-visible" : ""}`}
      aria-labelledby="app-curation-title"
    >
      <div className="app-curation__container">
        <header className="app-curation__header">
          <p className="app-curation__kicker">Applications in architecture &amp; interiors</p>
          <div className="app-curation__headline-wrap">
            <h2 id="app-curation-title" className="app-curation__title">
              Where natural stone meets architectural purpose
            </h2>
            <p className="app-curation__subhead">
              Every application demands deliberate specification—from dry-lay vein tracking across expansive living rooms to strict calibration tolerances for exterior cladding.
            </p>
          </div>
        </header>

        <div className="app-curation__grid">
          {/* Image stack: all images stay mounted, so switching is a smooth cross-fade */}
          <div className="app-curation__display">
            <div className="app-curation__media-box">
              {APPLICATIONS_DATA.map((item, i) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt={i === activeIdx ? item.alt : ""}
                  aria-hidden={i !== activeIdx}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`app-curation__image${i === activeIdx ? " is-active" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="app-curation__accordion">
            {APPLICATIONS_DATA.map((item, index) => {
              const isActive = index === activeIdx;
              return (
                <div key={item.id} className={`app-card${isActive ? " is-active" : ""}`}>
                  <h3 className="app-card__title">
                    <button
                      type="button"
                      id={`app-trigger-${index}`}
                      className="app-card__header"
                      aria-expanded={isActive}
                      aria-controls={`app-panel-${index}`}
                      onClick={() => setActiveIdx(index)}
                      onKeyDown={(e) => onKeyDown(e, index)}
                    >
                      <span className="app-card__num">{item.id}</span>
                      <span className="app-card__heading">{item.tabTitle}</span>
                      <span className="app-card__indicator" aria-hidden="true" />
                    </button>
                  </h3>

                  <div
                    id={`app-panel-${index}`}
                    role="region"
                    aria-labelledby={`app-trigger-${index}`}
                    className="app-card__collapsible"
                  >
                    <div className="app-card__collapsible-inner">
                      <div className="app-card__body">
                        <p className="app-card__lead">{item.title}</p>
                        <p className="app-card__description">{item.description}</p>

                        <dl className="app-card__specs">
                          {item.specifications.map((spec) => (
                            <div key={spec.label} className="app-card__spec">
                              <dt>{spec.label}</dt>
                              <dd>{spec.value}</dd>
                            </div>
                          ))}
                        </dl>

                        <Link to="/contact" className="app-card__link">
                          <span>Enquire about this application</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="app-curation__action">
          <Link className="app-curation__btn" to="/contact">
            Discuss your project brief
          </Link>
        </div>
      </div>
    </section>
  );
}