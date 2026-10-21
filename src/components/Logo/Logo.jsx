import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../../config";
import "./Logo.css";

/* ------------------------------------------------------------------
   LOGO IMAGE SPACE:
   Place your logo image in: India/public/logo.png (or logo.svg)
   You can also pass `imageSrc="/your-logo-file.png"` to <Logo />.
------------------------------------------------------------------- */

function FallbackMark({ size = 46 }) {
  return (
    <svg
      className="ie-logo-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="markGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF2D1" />
          <stop offset="28%" stop-color="#DFB76C" />
          <stop offset="65%" stop-color="#C89B4A" />
          <stop offset="100%" stop-color="#8C631F" />
        </linearGradient>
        <linearGradient id="markTaupe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6E5642" />
          <stop offset="50%" stop-color="#5C4736" />
          <stop offset="100%" stop-color="#3E2F23" />
        </linearGradient>
        <linearGradient id="markCarrara" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#F2EFE8" />
          <stop offset="100%" stop-color="#DDD8CD" />
        </linearGradient>
      </defs>

      <g>
        {/* NUMBER 1 */}
        <polygon points="12,26 23,12 28,12 28,26" fill="url(#markGold)" />
        <polygon points="21,26 28,26 28,88 21,88" fill="url(#markTaupe)" />
        <polygon points="28,26 33,26 33,88 28,88" fill="url(#markGold)" />
        <polygon points="15,88 39,88 37,86 17,86" fill="url(#markGold)" />

        {/* LETTER E */}
        <polygon points="41,12 85,12 85,24 53,24 53,88 41,88" fill="url(#markTaupe)" />
        <polygon points="41,12 85,12 82,10 44,10" fill="url(#markGold)" />
        <polygon points="85,12 85,24 88,21 88,9" fill="url(#markGold)" />
        <polygon points="41,12 41,88 38,85 38,15" fill="url(#markGold)" />

        {/* Diagonal signature marble facet */}
        <polygon points="49,44 79,44 79,56 49,56" fill="url(#markTaupe)" />
        <polygon points="56,44 79,44 69,56 49,56" fill="url(#markCarrara)" stroke="url(#markGold)" strokeWidth="0.8" />

        {/* Bottom bar */}
        <polygon points="41,76 85,76 85,88 41,88" fill="url(#markTaupe)" />
        <polygon points="85,76 85,88 88,85 88,73" fill="url(#markGold)" />
      </g>
    </svg>
  );
}

export default function Logo({
  light = false,
  compact = false,
  imageSrc = "/Images/logo.png",
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const size = compact ? 38 : 46;

  return (
    <Link
      className={`ie-logo${light ? " ie-logo--light" : ""}${compact ? " ie-logo--compact" : ""}`}
      to="/"
      aria-label="IE Marbles home"
    >
      {/* -------------------------------------------------------------
          LOGO IMAGE SPACE:
          Drop your logo file into `India/public/logo.png` or `logo.svg`
          ------------------------------------------------------------- */}
      <div className="ie-logo-image-space" style={{ width: size, height: size }}>
        {!imgFailed ? (
          <img
            src={imageSrc}
            alt="IE Marbles Logo"
            className="ie-logo-image"
            width={size}
            height={size}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <FallbackMark size={size} />
        )}
      </div>

      <span className="ie-logo-text">
        <span className="ie-logo-brand">
          <span className="ie-logo-letters">IE</span>
          <span className="ie-logo-name">MARBLES</span>
        </span>
        <span className="ie-logo-sub">
          <span className="ie-logo-rule" aria-hidden="true" />
          <span className="ie-logo-tag">NATURAL STONE</span>
          <span className="ie-logo-rule" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
