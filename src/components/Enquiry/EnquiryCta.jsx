import { Link } from "react-router-dom";
import useInView from "../hooks/useInView";
import "./Enquiry.css";

const STEPS = [
  "Share your project brief & BOQ",
  "Review curated stone options",
  "Confirm specifications & finish",
  "Coordinate sourcing & supply",
];

export default function EnquiryCta() {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className={`enq-cta${inView ? " is-visible" : ""}`}
      aria-labelledby="enq-cta-title"
    >
      <div className="enq-cta__inner">
        <h2 id="enq-cta-title" className="enq-cta__title">
          Let’s discuss your project
        </h2>
        <p className="enq-cta__lead">
          Share your material schedule, architectural drawings or bill of quantities (BOQ). We will return with appropriate stone references, dimensional specifications and transparent coordination steps.
        </p>

        <ol className="enq-cta__steps">
          {STEPS.map((step, idx) => (
            <li key={step} style={{ "--i": idx }}>
              <span aria-hidden="true">{idx + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <div className="enq-cta__actions">
          <Link className="enq-cta__btn enq-cta__btn--solid" to="/contact">
            Discuss a project
          </Link>
          <Link className="enq-cta__btn enq-cta__btn--ghost" to="/contact">
            Share your BOQ
          </Link>
        </div>
      </div>
    </section>
  );
}