import { useState } from "react";
import { Link } from "react-router-dom";
import "./Faq.css";

const CATEGORIES = ["All", "Sourcing", "Selection", "Processing", "Care"];

const FAQS = [
  {
    category: "Sourcing",
    code: "01",
    q: "How do you source natural stone?",
    a: "We coordinate project-specific sourcing through relevant suppliers and specialist partners, based on the material, quantity and specification your project needs. Availability varies by stone and supplier, so we confirm it with you before any order is finalised.",
    highlight: "Availability is confirmed with you before an order is finalised.",
  },
  {
    category: "Selection",
    code: "02",
    q: "Can I review the actual material before approving an order?",
    a: "Where the supplier allows, we share slab photographs and material references so you can review colour, veining and natural variation before an order progresses. Natural stone differs from slab to slab, so we encourage selection against the actual material. Arrangements for viewing in person depend on the supplier and the project.",
    highlight: "Material and specifications are agreed before an order is finalised.",
  },
  {
    category: "Processing",
    code: "03",
    q: "Do you offer cutting and processing?",
    a: "We coordinate processing, including CNC and waterjet work where available, through specialist partners. Dimensions, finishes and calibration requirements are agreed in the specification so that everyone works to the same details.",
    highlight: "Dimensional and calibration requirements are coordinated to the agreed specification.",
  },
  {
    category: "Processing",
    code: "04",
    q: "Can you help with book-matched feature walls and facades?",
    a: "Yes. We coordinate stone selection and processing for book-matched feature walls and facade applications. Book-matching relies on sequential slabs from the same block, so what is possible depends on the stone and the material available.",
    highlight: "Stone selection and processing coordination for book-matched feature walls and facade applications.",
  },
  {
    category: "Sourcing",
    code: "05",
    q: "Do you take enquiries from outside your city, or from abroad?",
    a: "We take project enquiries from across India and internationally. Timelines, delivery arrangements and costs depend on the stone, the quantity and the project location, and we discuss them openly during the enquiry.",
    highlight: "Share your BOQ or a material reference to begin.",
  },
  {
    category: "Care",
    code: "06",
    q: "How should natural stone be cared for?",
    a: "Care depends on the type of stone, its finish and where it is used. Some stones benefit from sealing, and cleaning products made for natural stone should be used. Ask us for material details on your selection, and follow your installer's guidance for final care instructions.",
    highlight: "Request material details when you enquire.",
  },
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs =
    activeCategory === "All" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  const toggle = (i) => {
    setOpenIndex((cur) => (cur === i ? -1 : i));
  };

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-eyebrow">
            <span className="faq-eyebrow-line" />
            Questions
          </span>
          <h2 id="faq-title" className="faq-title">
            Questions about natural stone
          </h2>
          <p className="faq-subtitle">
            Straightforward answers on sourcing, specifications, processing coordination and care.
          </p>
        </div>

        <div className="faq-layout">
          <aside className="faq-aside">
            <div className="faq-consult-card">
              <span className="faq-card-tag">IE Marbles</span>
              <h3 className="faq-card-title">Have a stone or specification in mind?</h3>
              <p className="faq-card-text">
                Send us your material reference, drawings or BOQ through the contact form and we will take it from there.
              </p>

              <div className="faq-categories">
                <span className="faq-cat-label">Filter questions</span>
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
                  <span className="faq-contact-k">Enquiries</span>
                  <span className="faq-contact-v">India and international</span>
                </div>
              </div>

              <Link to="/contact" className="ie-btn faq-card-btn">
                <span>Discuss a Project</span>
                <span className="ie-btn-arrow">&rarr;</span>
              </Link>
            </div>
          </aside>

          <div className="faq-main">
            <div className="faq-list">
              {filteredFaqs.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <article key={item.q} className={`faq-item${isOpen ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-meta">
                        <span className="faq-code">[{item.code}]</span>
                        <span className="faq-tag">{item.category}</span>
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