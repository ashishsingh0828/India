import { useEffect, useRef, useState } from "react";
import { sendContact } from "../../api";
import { BRAND } from "../../config";
import "./ContactForm.css";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Honeypot bot protection
    if (form.website) {
      setForm(initialForm);
      setStatus({
        type: "success",
        text: "Thank you. Your project enquiry has been received.",
      });
      return;
    }

    // 2. Client validation
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const payload = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        address: form.address.trim(),
        subject: form.company
          ? `Project Enquiry: ${form.company}`
          : "Project Sourcing & Material Specification Enquiry",
        message: form.message.trim(),
        website: form.website,
      };

      const response = await sendContact(payload);

      setStatus({
        type: "success",
        text:
          response?.message ||
          "Thank you. Your project details have been received. We will respond with material options and next steps.",
      });
      setForm(initialForm);
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || "Failed to submit enquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`contact-section${visible ? " is-visible" : ""}`}
      id="contact"
    >
      <div className="contact-container">
        {/* Left Column: Info & Map */}
        <div className="contact-info contact-reveal contact-reveal-left">
          <span className="contact-badge">Project Enquiries</span>

          <h2 className="contact-title">
            Discuss a Project or Share Your Specification
          </h2>

          <div className="contact-map-wrap">
            <iframe
              className="contact-map"
              title="Studio Location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND.mapQuery)}&t=m&z=15&output=embed&iwloc=near`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="contact-cards">
              <a className="contact-card contact-card-phone" href={BRAND.phoneHref}>
                <span className="contact-card-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                  </svg>
                </span>
                <span className="contact-card-text">
                  <span className="contact-card-label">Direct Enquiries</span>
                  <strong className="contact-card-value">{BRAND.phone}</strong>
                </span>
              </a>

              <a className="contact-card contact-card-email" href={`mailto:${BRAND.email}`}>
                <span className="contact-card-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <span className="contact-card-text">
                  <span className="contact-card-label">Share Material Schedule / BOQ</span>
                  <strong className="contact-card-value">{BRAND.email}</strong>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Center Vertical Divider */}
        <div className="contact-divider" aria-hidden="true" />

        {/* Right Column: Contact Form Box */}
        <div className="contact-form-box contact-reveal contact-reveal-right">
          <div className="contact-form-head">
            <h3 className="contact-form-title">
              Let’s Discuss Your
              <br />
              Project Brief
            </h3>
            <svg className="contact-plane" viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M58 6 6 28l16 6 6 18 8-11 14 10z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M22 34 58 6 28 52M28 52l1-12 7 1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M4 50h8M10 56h10M2 44h6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray="1 4"
              />
            </svg>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-field">
              <input
                className="contact-input"
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                aria-label="First Name"
                required
              />
            </div>

            <div className="contact-field">
              <input
                className="contact-input"
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                aria-label="Last Name"
                required
              />
            </div>

            <div className="contact-field">
              <input
                className="contact-input"
                type="email"
                name="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-label="Email"
                required
              />
            </div>

            <div className="contact-field">
              <input
                className="contact-input"
                type="tel"
                name="phone"
                placeholder="Phone / WhatsApp Number"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                aria-label="Phone Number"
              />
            </div>

            <div className="contact-field">
              <input
                className="contact-input"
                type="text"
                name="company"
                placeholder="Studio / Firm / Company Name"
                value={form.company}
                onChange={handleChange}
                autoComplete="organization"
                aria-label="Company Name"
              />
            </div>

            <div className="contact-field">
              <input
                className="contact-input"
                type="text"
                name="address"
                placeholder="Project City / Destination"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                aria-label="Project Location"
              />
            </div>

            <div className="contact-field contact-field-full">
              <textarea
                className="contact-input contact-textarea"
                name="message"
                rows="6"
                placeholder="Share your material references, intended applications (feature walls, facade, flooring), dimensions, or BOQ notes... *"
                value={form.message}
                onChange={handleChange}
                aria-label="Project Details"
                required
              />
            </div>

            {/* Honeypot field (hidden from grid layout flow) */}
            <div style={{ display: "none" }} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="contact-field contact-field-full contact-actions">
              <button className="contact-submit" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Discuss a Project"}
              </button>
              <p
                className={`contact-status${status.type ? ` is-${status.type}` : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}