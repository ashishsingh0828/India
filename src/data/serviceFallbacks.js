import { FALLBACK_FAQS, FALLBACK_STEPS } from "./services";

/** Per-slug offline fallbacks so detail pages never show the wrong service when API is empty. */
export const SERVICE_FALLBACKS = {
  "feature-walls-book-matching": {
    title: "Feature Walls & Book-Matching Coordination",
    slug: "feature-walls-book-matching",
    heroImage: "/Images/Services/S-1.jpg",
    image: "/Images/Services/S-1.jpg",
    imageB: "/Images/Services/S-2.jpg",
    paragraphs: [
      "Wide living rooms and lobbies need a feature wall that reads as one composition. We select sequential slabs from the same block so book-matching stays perfectly symmetrical.",
      "Vein flow, tonal balance and joint lines are approved in dry-lay before a single cut — so the wall lands with continuous pattern and clean floor reveals.",
      "Architects and clients review the layout in Kishangarh or from high-resolution photographs, then we fabricate and install to the approved order.",
    ],
    strategyHeading: "Book-Matched Feature Walls",
    strategyText: "Symmetry, continuous veining and soft daylight-ready finishes for luxury interiors.",
    features: [
      { title: "Book-matched slabs", text: "Sequential slabs from one block for mirror-perfect veining." },
      { title: "Dry-lay approval", text: "Full wall laid out before cutting so pattern and joints are signed off." },
    ],
    processHeading: "Our Four-Step Installation Process",
    steps: FALLBACK_STEPS,
    faqHeading: "Marble Care & Queries",
    faqs: FALLBACK_FAQS,
  },
  "facades-architectural-cladding": {
    title: "Facades & Architectural Cladding",
    slug: "facades-architectural-cladding",
    heroImage: "/Images/Services/S-2.jpg",
    image: "/Images/Services/S-2.jpg",
    imageB: "/Images/Services/S-1.jpg",
    paragraphs: [
      "Exterior cladding has to hold alignment under sun and shadow. We coordinate calibrated light-toned limestone and quartzite panels for crisp mitered joints and precise joint grids.",
      "Panel sequencing, thickness and edge profiles are set so geometric shadow lines stay sharp across facades and returns.",
      "From yard selection to site fit, the same layout governs residential and commercial envelopes.",
    ],
    strategyHeading: "Facade Panel Precision",
    strategyText: "Calibrated stone, mitered corners and aligned joints for high-end exteriors.",
    features: [
      { title: "Calibrated panels", text: "Consistent thickness for flat planes and clean shadow lines." },
      { title: "Mitered returns", text: "Crisp corners without exposed edge thickness." },
    ],
    processHeading: "Our Four-Step Installation Process",
    steps: FALLBACK_STEPS,
    faqHeading: "Marble Care & Queries",
    faqs: FALLBACK_FAQS,
  },
  "surfaces-custom-edge-detailing": {
    title: "Surfaces & Custom Edge Detailing",
    slug: "surfaces-custom-edge-detailing",
    heroImage: "/Images/Services/S-3.jpg",
    image: "/Images/Services/S-3.jpg",
    imageB: "/Images/Services/S-4.jpg",
    paragraphs: [
      "Kitchen islands and vanity tops need edges that feel carved from one mass. We coordinate mitered waterfall profiles, honed textures and custom edge detailing on marble, quartzite and granite.",
      "CNC and waterjet where available, with templates locked before cutting so mitres meet cleanly at returns.",
      "The result is monolithic depth — stone that reads as architecture, not an applied top.",
    ],
    strategyHeading: "Monolithic Surfaces & Edges",
    strategyText: "Waterfall mitres, honed depth and fixture-ready detailing for kitchens and baths.",
    features: [
      { title: "Waterfall mitres", text: "Continuous grain down the sides of islands and vanity ends." },
      { title: "Honed depth", text: "Soft sheen that shows stone texture without glare." },
    ],
    processHeading: "Our Four-Step Installation Process",
    steps: FALLBACK_STEPS,
    faqHeading: "Marble Care & Queries",
    faqs: FALLBACK_FAQS,
  },
  "flooring-selection-dry-lay": {
    title: "Flooring Selection & Dry-Lay Coordination",
    slug: "flooring-selection-dry-lay",
    heroImage: "/Images/Services/S-4.jpg",
    image: "/Images/Services/S-4.jpg",
    imageB: "/Images/Services/S-3.jpg",
    paragraphs: [
      "Expansive floors need grain that continues across rooms. We select large-format slabs for tonal balance, then dry-lay the full surface so alignment is approved before bonding.",
      "Calibration and joint planning keep lippage out and sheen even under morning light.",
      "From penthouses to lobbies, the same process delivers continuous, elegant stone floors.",
    ],
    strategyHeading: "Continuous Flooring Layouts",
    strategyText: "Dry-lay first, then install — so grain and tone stay continuous across the plane.",
    features: [
      { title: "Large-format slabs", text: "Fewer joints, stronger visual continuity." },
      { title: "Dry-lay verification", text: "Full layout approved before adhesive." },
    ],
    processHeading: "Our Four-Step Installation Process",
    steps: FALLBACK_STEPS,
    faqHeading: "Marble Care & Queries",
    faqs: FALLBACK_FAQS,
  },
  "monolithic-staircases-inlays": {
    title: "Monolithic Staircases & Custom Inlays",
    slug: "monolithic-staircases-inlays",
    heroImage: "/Images/Services/S-5.jpg",
    image: "/Images/Services/S-5.jpg",
    imageB: "/Images/Services/S-1.jpg",
    paragraphs: [
      "A stone staircase should feel carved as one gesture. We source and process treads and risers so grain flows continuously, with optional inlays at landings and transitions.",
      "Monolithic or matched pairs are templated to the structure, then finished for spotlight-ready texture.",
      "Frameless glass and minimal fixings stay secondary — the stone leads.",
    ],
    strategyHeading: "Sculpted Staircases & Inlays",
    strategyText: "Continuous grain, precise inlays and architectural lighting-ready surfaces.",
    features: [
      { title: "Continuous grain", text: "Tread-to-riser flow from matched slabs." },
      { title: "Custom inlays", text: "Transition details that sit flush with the run." },
    ],
    processHeading: "Our Four-Step Installation Process",
    steps: FALLBACK_STEPS,
    faqHeading: "Marble Care & Queries",
    faqs: FALLBACK_FAQS,
  },
};

export const SERVICE_FALLBACK_LINKS = Object.values(SERVICE_FALLBACKS).map(({ title, slug }) => ({ title, slug }));

export function serviceFallback(slug) {
  return SERVICE_FALLBACKS[slug] || SERVICE_FALLBACKS["feature-walls-book-matching"];
}
