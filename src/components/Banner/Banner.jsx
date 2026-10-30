import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BANNER_IMAGE } from "../../config";
import "./Banner.css";

const defaultLines = [
  ["Transform", "your", "space", "with"],
  ["timeless", "marble", "&", "stone"],
];

function ArrowIcon() {
  return (
    <svg className="banner-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Banner({
image = BANNER_IMAGE,
  subtitle = "IE Marbles— Stone, Curated",
  headingLines = defaultLines,
  buttonText = "Discuss a Project",
  buttonHref = "/contact",
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) { setReady(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setReady(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bannerStyle = image ? { "--banner-image": `url("${image}")` } : undefined;
  const isAnchor = buttonHref.startsWith("#");
  const ButtonTag = isAnchor ? "a" : Link;
  const buttonProps = isAnchor ? { href: buttonHref } : { to: buttonHref };
  let wordIndex = 0;

  return (
    <section ref={ref} className={`banner-section${ready ? " is-ready" : ""}`} style={bannerStyle}>
      <div className="banner-frame">
        <div className="banner-media">
          <div className="banner-image" />
          <div className="banner-overlay" />
        </div>

        <div className="banner-content">
          <p className="banner-subtitle">{subtitle}</p>

          <h2 className="banner-title" aria-label={headingLines.map((line) => line.join(" ")).join(" ")}>
            {headingLines.map((line, lineIndex) => (
              <span className="banner-title-line" key={lineIndex} aria-hidden="true">
                {line.map((word) => {
                  const index = wordIndex++;
                  return (
                    <span className="banner-word" style={{ "--banner-i": index }} key={`${word}-${index}`}>{word}</span>
                  );
                })}
              </span>
            ))}
          </h2>

          <ButtonTag className="banner-button" {...buttonProps}>
            <span className="banner-button-text">{buttonText}</span>
            <span className="banner-button-icon">
              <span className="banner-arrow banner-arrow-out"><ArrowIcon /></span>
              <span className="banner-arrow banner-arrow-in"><ArrowIcon /></span>
            </span>
          </ButtonTag>
        </div>
      </div>
    </section>
  );
}
