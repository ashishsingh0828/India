import { useState } from "react";
import { Link } from "react-router-dom";
import "./Faq.css";

const CATEGORIES = ["All", "Sourcing", "Dry-Lay & Cutting", "Care & Sealing"];

const FAQS = [
  {
    category: "Sourcing",
    tag: "QUARRY SOURCING",
    code: "01",
    q: "Where do you source your natural marble slabs from?",
    a: "We directly import premium natural stone blocks and slabs from world-renowned quarries in Carrara and Verona (Italy), Greece, Spain, and Turkey, alongside select luxury Indian marbles from our regional hubs in Kishangarh and Makrana.",
    highlight: "Direct quarry-to-yard import eliminates middlemen and guarantees single-block vein consistency.",
  },
  {
    category: "Dry-Lay & Cutting",
    tag: "DRY-LAY VERIFICATION",
    code: "02",
    q: "Can I inspect and approve the actual slabs before cutting?",
    a: "Yes, absolutely. We invite clients, interior designers, and architects to our Kishangarh gallery to walk through full-sized slabs. We digitally photograph and catalog each slab so you approve the exact grain and vein alignment prior to any cutting or fabrication.",
    highlight: "100% pre-cutting approval: clients review high-resolution 3D dry-lay maps of every room.",
  },
  {
    category: "Dry-Lay & Cutting",
    tag: "BOOKMATCHING SYMMETRY",
    code: "03",
    q: "What is book-matching and how do you achieve it?",
    a: "Book-matching involves cutting sequential slabs from the same block and polishing opposite sides, creating a mirror-image symmetry across seams. Our precision CNC saws ensure vein continuity across expansive feature walls, grand foyers, and master bathrooms.",
    highlight: "Laser-aligned joints calibrated to sub-millimeter tolerances for a continuous stone canvas.",
  },
  {
    category: "Care & Sealing",
    tag: "NANO-SEALANT BARRIER",
    code: "04",
    q: "How are marble floors and countertops protected against staining?",
    a: "Every installed surface receives deep penetrating, breathable fluoropolymer sealers that protect against wine, oils, and moisture without altering the natural stone color or sheen. We also provide our signature care kit and ongoing maintenance support.",
    highlight: "Non-yellowing fluoropolymer sealer provides up to 5 years of stain and moisture protection.",
  },
  {
    category: "Sourcing",
    tag: "TURNKEY INSTALLATION",
    code: "05",
    q: "Do you manage both supply and installation across India?",
    a: "Yes. Our turnkey service covers block selection, digital templating, precision cutting, edge profiling, dry-lay verification, master artisan installation, and diamond-pad polishing for residences, hotels, and luxury commercial projects across India.",
    highlight: "Complete turnkey execution backed by over 25 years of master stone craftsmanship.",
  },
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = activeCategory === "All"
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  const toggle = (i) => {
    setOpenIndex((cur) => (cur === i ? -1 : i));
  };

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-container">
        {/* Top Header */}
        <div className="faq-header">
          <span className="faq-eyebrow">
            <span className="faq-eyebrow-line" />
            Curated Knowledge Base
          </span>
          <h2 id="faq-title" className="faq-title">
            Architectural Stone Guidance &amp; Insights
          </h2>
          <p className="faq-subtitle">
            Essential principles on slab inspection, vein bookmatching, dry-lay planning, and lasting stone preservation.
          </p>
        </div>

        {/* Dual-Panel Architectural Layout */}
        <div className="faq-layout">
          {/* Left Panel: Sticky Consultant Card */}
          <aside className="faq-aside">
            <div className="faq-consult-card">
              <span className="faq-card-tag">IE MARBLES ADVISORY</span>
              <h3 className="faq-card-title">
                Have a Specific Slab or Vein Requirement?
              </h3>
              <p className="faq-card-text">
                Write to the IE Marbles team through the contact form. We are a new studio, with 28+ years of combined team experience in natural stone.
              </p>

              {/* Category Filter Chips */}
              <div className="faq-categories">
                <span className="faq-cat-label">Filter Inquiries:</span>
                <div className="faq-cat-buttons">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`faq-cat-btn${activeCategory === cat ? " is-active" : ""}`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setOpenIndex(0);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="faq-card-contact">
                <div className="faq-contact-item">
                  <span className="faq-contact-k">Experience</span>
                  <span className="faq-contact-v">28+ years, team combined</span>
                </div>
              </div>

              <Link to="/contact" className="ie-btn faq-card-btn">
                <span>Inquire With An Expert</span>
                <span className="ie-btn-arrow">&rarr;</span>
              </Link>
            </div>
          </aside>

          {/* Right Panel: Interactive Architectural Query Blocks */}
          <div className="faq-main">
            <div className="faq-list">
              {filteredFaqs.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <article
                    key={item.q}
                    className={`faq-item${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-meta">
                        <span className="faq-code">[{item.code}]</span>
                        <span className="faq-tag">{item.tag}</span>
                      </div>

                      <div className="faq-trigger-content">
                        <h3 className="faq-q-text">{item.q}</h3>
                        <span className="faq-toggle-icon" aria-hidden="true">
                          <span className="faq-toggle-h" />
                          <span className={`faq-toggle-v${isOpen ? " is-collapsed" : ""}`} />
                        </span>
                      </div>
                    </button>

                    <div className={`faq-collapse${isOpen ? " is-open" : ""}`}>
                      <div className="faq-answer-inner">
                        <p className="faq-answer-p">{item.a}</p>
                        <div className="faq-highlight-box">
                          <span className="faq-highlight-icon">✦</span>
                          <span className="faq-highlight-text">{item.highlight}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
