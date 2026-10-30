import useInView from "../hooks/useInView";
import "./Enquiry.css";

const GlobeIcon = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <circle cx="16" cy="16" r="12" />
    <ellipse cx="16" cy="16" rx="5.2" ry="12" />
    <path d="M4.5 12.5h23M4.5 19.5h23" />
  </svg>
);

const ShipIcon = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 19h26l-3.5 6.5h-19L3 19Z" />
    <path d="M7 19v-5h18v5M12 14V9h8v5" />
  </svg>
);

export default function EnquiryStrip() {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className={`enq-strip${inView ? " is-visible" : ""}`}
      aria-labelledby="enq-strip-title"
    >
      <div className="enq-strip__inner">
        <h2 id="enq-strip-title" className="enq-strip__title">
          India-wide and international project enquiries
        </h2>

        <article className="enq-strip__item" style={{ "--i": 1 }}>
          <span className="enq-strip__icon"><GlobeIcon /></span>
          <h3>India-wide procurement</h3>
          <p>
            Project coordination for architects, interior designers, developers and private clients across all metropolitan and regional destinations.
          </p>
        </article>

        <article className="enq-strip__item" style={{ "--i": 2 }}>
          <span className="enq-strip__icon"><ShipIcon /></span>
          <h3>International shipments</h3>
          <p>
            Coordinated sourcing, export packing and overseas freight. Lead times, port deliveries and schedules tailored to project specifications.
          </p>
        </article>
      </div>
    </section>
  );
}