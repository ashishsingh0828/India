/* Adds sample content for every site so the websites show real data straight away.
     npm run seed          -> only fills sites/types that are empty
     npm run seed:force    -> wipes sample content for all sites and re-creates it   */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Contact = require("../models/Contact");
const models = require("../models/content");
const { slugify } = require("../utils/helpers");
const { SITES } = require("../middleware/guards");

const FORCE = process.argv.includes("--force");
/* Free Unsplash photos (interiors with stone floors, countertops, bathrooms). Replace them from the admin panel. */
const IMG = {
  floor: ["1600607687939-ce8a6c25118c", "1618221195710-dd6b41faaea6", "1600210492486-724fe5c67fb0", "1616486338812-3dadae4b4ace"],
  kitchen: ["1507089947368-19c1da9775ae", "1541123437800-1bb1317badc2", "1484154218962-a197022b5858"],
  bath: ["1620626011761-996317b8d101", "1584622650111-993a426fbf0a", "1600566752355-35792bedcfea"],
  wall: ["1604014237800-1c9102c219da", "1615529182904-14819c35db37", "1600573472550-8090b5e0745e"],
};
const ORDER = ["floor", "bath", "kitchen", "wall"];
const pic = (group, n = 0, w = 1200, h = 800) => {
  const list = IMG[group];
  return `https://images.unsplash.com/photo-${list[n % list.length]}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
};
const g = (i) => ORDER[i % ORDER.length];
const text = "Marble has defined luxury interiors for centuries. Our team selects each slab by hand, plans every cut to follow the natural veining, and installs it with precision so the finished surface looks effortless and lasts for decades.";
const text2 = "From the first site visit to the final polish we keep you informed at every step, with clear timelines, transparent pricing and a finish we are proud to put our name on.";
const day = 86400000;

/* India content mirrors India/src fallbacks so admin edit/delete stays in sync with the live site. */
const INDIA_PROJECTS = [
  {
    slug: "statuario-grand-villa", title: "Statuario Grand Villa Living & Entryway", category: "Residential",
    client: "Private Luxury Residence", projectType: "Full Villa Marble Flooring & Bookmatched Entry",
    date: "October 2026", website: "iemarbles.com",
    imageA: "/Images/Our gallery/Bianco Vogue Marble.png", imageB: "/Images/Our gallery/Fossana Marble.png",
    heroImage: "/Images/logo.png",
    heading: "Curated Statuario slabs with a bookmatched entry",
    paragraphs: "Premium Statuario from Carrara, selected and dry-laid in Kishangarh before a single cut.\n\nJoints are colour-matched and calibrated so the foyer, living hall and stair read as one surface.",
    factsTitle: "Stone specification", factsText: "20 mm calibrated slabs, polished and sealed for daily villa use.",
    checks: "Hairline colour-matched joints\nVein alignment across foyer and stairs\nFluoropolymer sealant\nClient dry-lay approval",
    extraHeading: "What the family asked for",
    extraParagraphs: "A bright, calm arrival that still feels grand. We kept the palette quiet and let the stone carry the room.",
  },
  {
    slug: "calacatta-gold-bath-suite", title: "Calacatta Gold Bookmatched Bath Suite", category: "Bathrooms",
    client: "Private Residence", projectType: "Bookmatched Bath & Vanity",
    date: "September 2026", website: "iemarbles.com",
    imageA: "/Images/Our gallery/Paonazzo Marble.png", imageB: "/Images/Our gallery/Pirgon Marble.png",
    heroImage: "/Images/Home/About/Distinctive Quartzite.png",
    heading: "A wet room drawn as one slab story",
    paragraphs: "Sequential Calacatta slabs set as a mirror across the vanity wall and shower.\n\nEdges are mitred so the stone turns the corner without a visual break.",
    factsTitle: "The bath suite", factsText: "Bookmatched cladding, a single vanity top, and a sealed wet-area floor.",
    checks: "Bookmatched feature wall\nMitred vanity edges\nWet-area sealant\nHidden linear waste",
    extraHeading: "A quieter luxury",
    extraParagraphs: "Gold veining is used once, on the wall that faces you as you enter. The floor stays calm so the room does not compete with itself.",
  },
  {
    slug: "emperador-dark-foyer", title: "Emperador Dark & Spanish Crema Foyer", category: "Flooring",
    client: "Hotel Arrival", projectType: "Foyer Flooring & Border",
    date: "August 2026", website: "iemarbles.com",
    imageA: "/Images/Our gallery/Thassos White Marble.png", imageB: "/Images/Our gallery/Tortuga Marble.png",
    heroImage: "/Images/Home/About/Selected Marble Slabs.png",
    heading: "Warm stone underfoot for a first impression",
    paragraphs: "Emperador and Spanish Crema laid as a border-and-field floor for a hotel arrival.\n\nThe pattern is drawn on the dry-lay so the centre medallion sits on the walking line.",
    factsTitle: "Arrival floor", factsText: "Two stones, one field, a border that holds the room.",
    checks: "Field and border layout\nMedallion on axis\nHonored edges\nCommercial traffic seal",
    extraHeading: "Built for traffic",
    extraParagraphs: "A hotel foyer has to look composed at noon and at midnight. The darker field hides daily wear; the cream border keeps the room bright.",
  },
  {
    slug: "nero-marquina-waterfall", title: "Nero Marquina Monolithic Waterfall Island", category: "Kitchen & Countertops",
    client: "Private Kitchen", projectType: "Island & Splashback",
    date: "July 2026", website: "iemarbles.com",
    imageA: "/Images/Home/Services and sourcing/Feature Walls & Facades.png",
    imageB: "/Images/Home/Services and sourcing/Processing Coordination.png",
    heroImage: "/Images/Home/About/Textured Travertine.png",
    heading: "A single black stone island, waterfall on both ends",
    paragraphs: "Nero Marquina cut as one island top with waterfall returns.\n\nThe splashback uses the same block so the kitchen reads as one composition.",
    factsTitle: "The island", factsText: "Mitred waterfall ends, a hidden support frame, and a honed finish that hides fingerprints.",
    checks: "Waterfall returns\nSame-block splashback\nHoned finish\nConcealed steel frame",
    extraHeading: "Cooked in, not added on",
    extraParagraphs: "The island is the room. Seating, prep and the stone line up before the cabinets are set.",
  },
];

const INDIA_SERVICE_BODY = {
  paragraphs: "We provide comprehensive natural marble slab selection, precision dry-lay layouts, and sub-millimeter joint installation for luxury residences, commercial lobbies, and villas.\n\nEvery block is carefully selected at our Kishangarh stone facility for uniform density, natural mineral luster, and continuous vein movement across adjacent slabs.\n\nPrior to installation, we dry-lay the entire surface in our workshop to allow clients and architects to inspect bookmatching and vein continuity.",
  strategyHeading: "Our Stone Craftsmanship & Engineering",
  strategyText: "Leveraging 5-axis Italian bridge cutters and laser alignment tools, we eliminate uneven joints and lippage.",
  features: "Direct quarry sourcing | Italian Statuario and Calacatta, with selected Indian stones, chosen slab by slab in Kishangarh.\nPrecision dry-lay | The full surface is laid out before bonding so book-matching and joints can be approved in person.",
  processHeading: "Our Four-Step Installation Process",
  steps: "Slab selection & dry-lay | You choose the actual slabs in Kishangarh. We dry-lay the full surface so vein flow and book-matching are approved before a single cut.\nMeasure, template & cut | Site measurements and digital templates go back to the yard. Slabs are calibrated, cut and edged to the approved layout.\nVein-matched installation | Fitters set the stone on a levelled base with colour-matched joints so floors, walls or tops read as one continuous surface.\nPolish, seal & handover | The finished surface is polished, sealed with a penetrating fluoropolymer, and handed over with a simple care note.",
  videoHeading: "See How We Work", videoText: "From dry-lay to final polish — how IE Marbles installs natural stone.",
  videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  faqHeading: "Marble Care & Queries",
  faqs: "Can I approve the slabs before they are cut? | Yes. Clients and architects review the dry-lay in our Kishangarh yard, or from high-resolution photographs, before fabrication starts.\nHow do you keep veins continuous across a large floor or wall? | Sequential slabs from the same block are dry-laid and book-matched. Cuts follow the approved layout so the vein continues across joints.\nHow is marble protected after installation? | Every installed surface receives a breathable penetrating sealer that resists wine, oil and moisture without changing the natural colour or sheen.\nDo you work on homes and commercial spaces? | Yes. The same selection, dry-lay and installation process is used for residences, hotels, lobbies and offices.",
};

const INDIA_SERVICES = [
  {
    slug: "marble-flooring", title: "Flooring Selection & Dry-Lay Coordination",
    shortDescription: "Dimensional and calibration requirements coordinated to agreed specifications, with dry-lay verification for seamless pattern and grain continuity.",
    image: "/Images/Services/S-1.png",
    heroImage: "/Images/Services/S-1.png",
    ...INDIA_SERVICE_BODY,
  },
  {
    slug: "wall-cladding", title: "Feature Walls & Facade Coordination",
    shortDescription: "Stone selection and processing coordination for book-matched feature walls and facade applications across refined residential and commercial briefs.",
    image: "/Images/Services/S-2.png",
    heroImage: "/Images/Services/S-2.png",
    ...INDIA_SERVICE_BODY,
  },
  {
    slug: "countertops-vanities", title: "Surfaces & Edge Detailing Coordination",
    shortDescription: "CNC and waterjet processing coordination, where available, for natural quartzite, granite and marble surfaces with custom mitered profiles.",
    image: "/Images/Services/S-3.png",
    heroImage: "/Images/Services/S-3.png",
    ...INDIA_SERVICE_BODY,
  },
  {
    slug: "staircases-inlays", title: "Custom Staircases & Architectural Details",
    shortDescription: "Sourcing and processing coordination for monolithic stone staircases, treads, risers and custom inlaid transition details.",
    image: "/Images/Services/S-4.png",
    heroImage: "/Images/Services/S-4.png",
    ...INDIA_SERVICE_BODY,
  },
];

const INDIA_BLOGS = [
  {
    slug: "statuario-vs-calacatta-marble-guide",
    title: "Statuario vs Calacatta Marble: The Connoisseur’s Selection Guide",
    category: "Marble Guides", tags: "Italian Marble, Statuario, Calacatta, Quarry Selection",
    author: "IE Marbles Curators", date: "2026-10-01",
    excerpt: "Understand the subtle differences in veining, quarry origins, and translucency between Italy's most celebrated white marbles.",
    image: "/Images/About Us images/Calacatta Crema Marble.png",
    heroImage: "/Images/Video section Images/Video section Images.png",
    introHeading: "Comparing Two of the World's Most Iconic White Carrara Stones",
    introText: "Italian marble has remained the pinnacle of architectural luxury for millennia. Among Carrara's prized extractions, Statuario and Calacatta Gold stand as the world's most sought-after natural stones.",
    galleryA: "/Images/Banner Slider images/2.png", galleryB: "/Images/Banner Slider images/3.png",
    secondHeading: "Distinctive Vein Characteristics & Mineral Composition",
    secondText: "While Statuario features bold, dramatic grey and charcoal veining sweeping across an ultra-pure milk-white crystalline background, Calacatta Gold introduces warm taupe, honey, and champagne tones woven into its vein network.",
    approachHeading: "Key Selection & Installation Guidelines",
    approachItems: "Hand-select whole slabs to ensure full lot color consistency\nAlways request pre-cutting dry-lay dry runs for vein alignment\nEnsure penetrating fluoropolymer sealing immediately following laying",
    approachImage: "/Images/Banner Slider images/4.png",
  },
  {
    slug: "honed-vs-polished-natural-stone-finishes",
    title: "Honed vs Polished: Selecting the Ideal Finish for Floors & Facades",
    category: "Architecture", tags: "Finishes, Honed, Polished, Architecture",
    author: "IE Marbles Tech Team", date: "2026-09-15",
    excerpt: "Explore slip resistance, light refraction, and tactile depth across honed, leathered, and high-gloss polished marble finishes.",
    image: "/Images/About Us images/Calacatta Viola Marble.png",
    heroImage: "/Images/Banner Slider images/1.png",
    introHeading: "Finish choices that change how stone feels and performs",
    introText: "Honed, leathered and polished finishes each catch light differently. The right choice depends on traffic, wet areas and the mood of the room.",
    galleryA: "/Images/Banner Slider images/2.png", galleryB: "/Images/Banner Slider images/3.png",
    secondHeading: "Where each finish works best",
    secondText: "Polished floors suit formal halls. Honed stones hide etch marks in kitchens. Leathered surfaces add grip outdoors and on stairs.",
    approachHeading: "Practical selection notes",
    approachItems: "Match finish to traffic and wet zones\nSample under the same light as the room\nSeal every finish — polish alone is not protection",
    approachImage: "/Images/Banner Slider images/4.png",
  },
  {
    slug: "art-of-bookmatching-marble-slabs",
    title: "The Art of Bookmatching: Turning Natural Marble Into Living Art",
    category: "Stone Craft", tags: "Bookmatching, Slabs, Interior Design",
    author: "IE Marbles Artisans", date: "2026-08-20",
    excerpt: "How mirror-cut adjacent slabs create symmetrical kaleidoscopic patterns that define luxury entry halls and master baths.",
    image: "/Images/About Us images/Statuario Baratini Marble.png",
    heroImage: "/Images/Our gallery/Bianco Vogue Marble.png",
    introHeading: "Mirror veins across a wall or floor",
    introText: "Bookmatching opens sequential slabs like a book so veins meet in the centre. It turns stone into a composed artwork rather than a random surface.",
    galleryA: "/Images/Our gallery/Paonazzo Marble.png", galleryB: "/Images/Our gallery/Pirgon Marble.png",
    secondHeading: "Dry-lay before you cut",
    secondText: "The pattern is approved on the yard floor first. Only then are slabs cut and numbered for install so the mirror stays true on site.",
    approachHeading: "Bookmatch checklist",
    approachItems: "Keep slabs from the same block in sequence\nPhotograph the dry-lay for client sign-off\nNumber each piece before shipping to site",
    approachImage: "/Images/Our gallery/Fossana Marble.png",
  },
];
const asIndiaDoc = (site, _label, row) => ({ ...row, site, published: true });

/* Australia content mirrors Australia/src fallbacks (homes, services, blogs). */
const AUS_PUBLIC = {
  elevFront: "/Image/projects/sharma-residence/elevation-01.jpg",
  elevSide: "/Image/projects/sharma-residence/elevation-02.jpg",
  livingOutlook: "/Image/products/slabs/stone-slab-04.jpg",
  livingCalm: "/Image/products/tiles-textures/stone-tile-03.jpg",
  bedroomTimber: "/Image/products/tiles-textures/stone-tile-09.jpg",
  diningLight: "/Image/banners/general/banner-wide-06.jpg",
  bedroomWarm: "/Image/products/tiles-textures/stone-tile-08.jpg",
  diningFormal: "/Image/products/slabs/stone-slab-01.jpg",
  joinery: "/Image/banners/general/banner-wide-07.jpg",
  bathroomMarble: "/Image/products/slabs/stone-slab-12-clean.jpg",
  planGround: "/Image/projects/sharma-residence/floor-plan-02.jpg",
  planUpper: "/Image/projects/sharma-residence/floor-plan-03.jpg",
  svc1: "/images/ksd-stone-07.jpg",
  svc2: "/images/ksd-stone-09.jpg",
  svc3: "/images/ksd-stone-27.jpg",
  svc4: "/images/ksd-stone-38.jpg",
  svc5: "/images/ksd-stone-03.jpg",
  svc6: "/images/ksd-stone-40.jpg",
};

const AUS_PROJECTS = [
  {
    slug: "residence", title: "Residence", category: "Three-Storey Boutique Home",
    client: "Private residence", projectType: "Boutique Home", suburb: "Residence", shortCode: "",
    featured: true, status: "In Delivery", collection: "Residence",
    location: "Western Australia", date: "In delivery", storeys: "3",
    specLine: "Three storeys · Pool & alfresco · Marble floors",
    conceptHeadline: "The beauty of indoor-outdoor living",
    planLabels: "Ground\nUpper\nUndercroft",
    imageA: AUS_PUBLIC.elevFront, imageB: AUS_PUBLIC.elevSide, heroImage: AUS_PUBLIC.elevFront,
    floorPlanA: AUS_PUBLIC.planGround, floorPlanB: AUS_PUBLIC.planUpper,
    heading: "A three-storey boutique home, composed as one",
    paragraphs: "Residence is a three-storey boutique home, with architecture and interiors specified together. Arrival, living and rest, each with a clear purpose.",
    factsTitle: "Builder interior design, composed as one",
    factsText: "The brief was a high-performing, comfortable family home with a personal touch: prayer space, guest rooms, master suite, pool and alfresco living, without treating any of these as add-ons.",
    checks: "Three storeys: undercroft, ground and upper living\nMarble main floors with onyx stair and lift core\nAlfresco, pool and hardstand for indoor–outdoor living\nDedicated mandir and guest accommodation\nComplete home solution: builder interior design and finishes",
  },
  {
    slug: "port-coogee-residence", title: "Port Coogee Residence", category: "Ongoing · Conceptual design",
    client: "Private residence", projectType: "Ongoing", suburb: "Port Coogee", shortCode: "",
    featured: true, status: "Ongoing", collection: "Ongoing",
    location: "Western Australia", date: "Ongoing", storeys: "3",
    specLine: "Ongoing · Conceptual design & drawings",
    conceptHeadline: "Conceptual design of an ongoing home",
    planLabels: "",
    imageA: AUS_PUBLIC.livingOutlook, imageB: AUS_PUBLIC.livingCalm, heroImage: AUS_PUBLIC.livingOutlook,
    floorPlanA: "", floorPlanB: "",
    heading: "An ongoing coastal home, drawn before it is built",
    paragraphs: "Port Coogee Residence is in conceptual design: calm volumes, garden aspect and living that opens toward the water and terrace.",
    factsTitle: "Architecture & interior, designed as one",
    factsText: "Outlook and light set the plan so living opens toward the water and the terrace, not a corridor of leftover rooms.",
    checks: "Architecture and interior design together\nLicensed boutique builder\nIndoor–outdoor living\nClient address remains private",
  },
];

const AUS_SERVICES = [
  {
    slug: "architecture-design", title: "Architecture & Design",
    shortDescription: "Form, proportion and how the family lives, resolved before a brick is laid.",
    image: AUS_PUBLIC.svc1, heroImage: AUS_PUBLIC.svc1,
  },
  {
    slug: "builder-interior-design", title: "Builder Interior Design",
    shortDescription: "Materials, joinery and light considered with the architecture, so every room feels like part of the same home.",
    image: AUS_PUBLIC.svc2, heroImage: AUS_PUBLIC.svc2,
  },
  {
    slug: "complete-home-solutions", title: "Complete Home Solutions",
    shortDescription: "Combined visionary — licensed builder and interior design under one roof. One brief, one team, one finished residence.",
    image: AUS_PUBLIC.svc3, heroImage: AUS_PUBLIC.svc3,
  },
  {
    slug: "licensed-boutique-building", title: "Licensed Boutique Building",
    shortDescription: "High-end Western Australian homes delivered by a licensed builder, with a customer-centred process.",
    image: AUS_PUBLIC.svc4, heroImage: AUS_PUBLIC.svc4,
  },
  {
    slug: "indoor-outdoor-living", title: "Indoor–Outdoor Living",
    shortDescription: "Alfresco, pool and garden composed with the house so Western Australian light and privacy work together.",
    image: AUS_PUBLIC.svc5, heroImage: AUS_PUBLIC.svc5,
  },
  {
    slug: "materials-finishes", title: "Materials & Finishes",
    shortDescription: "Marble, timber, stone and concrete chosen for climate, touch and how they catch the light.",
    image: AUS_PUBLIC.svc6, heroImage: AUS_PUBLIC.svc6,
  },
].map((row) => ({
  ...row,
  paragraphs: `${text}\n\n${text2}`,
  strategyHeading: "Our Approach", strategyText: text2,
  features: "Expert Installation | Skilled fitters with years of stone experience.\nFlooring Upgrades | Refresh any room with a premium stone finish.",
  processHeading: "Service Process",
  steps: "Request For Service | Tell us about your space and what you have in mind.\nService Planning | We measure, plan the cuts and agree a timeline.\nQuality Control | Every slab is checked before and after installation.\nFollow-up & Support | We stay in touch to make sure you are delighted.",
  videoHeading: "See How We Work", videoText: text2, videoUrl: "https://www.youtube.com/watch?v=hddwAIXbKZo",
  faqHeading: "Frequently Asked Questions",
  faqs: "What services do you provide? | We design and build boutique Western Australian homes with interior design under one roof.\nDo you work on custom family homes? | Yes — licensed boutique building with a customer-centred process.\nCan architecture and interiors be one brief? | Yes. Form, materials and how the family lives are resolved together.",
}));

const AUS_BLOGS = [
  {
    slug: "timber-and-stone-bathroom-design-trends",
    title: "Timber Vanities and Natural Tones: Bathroom Design Trends in Australian Homes",
    category: "Design Trends", tags: "Design Trends, Bathrooms, Timber",
    author: "KSD Homes", date: "2026-10-10",
    excerpt: "Timber vanities and natural tones shaping bathroom design in Australian family homes.",
    image: "/Image/banners/hero/hero-banner-03.jpg", heroImage: "/Image/banners/hero/hero-banner-03.jpg",
  },
  {
    slug: "planning-a-family-kitchen-island",
    title: "Planning a Kitchen Island That Works Hard for Busy Family Life",
    category: "Kitchen Design", tags: "Kitchen Design, Family Homes",
    author: "KSD Homes", date: "2026-10-02",
    excerpt: "How to plan a kitchen island that works hard for busy family life.",
    image: "/Image/banners/living-room/living-banner-02.jpg", heroImage: "/Image/banners/living-room/living-banner-02.jpg",
  },
  {
    slug: "alfresco-kitchens-australian-outdoor-living",
    title: "Designing Alfresco Kitchens That Connect Your Home to the Outdoors",
    category: "Outdoor Living", tags: "Outdoor Living, Alfresco",
    author: "KSD Homes", date: "2026-09-24",
    excerpt: "Alfresco kitchens that connect Western Australian homes to outdoor living.",
    image: "/Image/banners/living-room/living-banner-03.jpg", heroImage: "/Image/banners/living-room/living-banner-03.jpg",
  },
  {
    slug: "feature-walls-for-living-rooms",
    title: "Feature Walls That Give Your Living Room Warmth and Character",
    category: "Interiors", tags: "Interiors, Feature Walls",
    author: "KSD Homes", date: "2026-09-15",
    excerpt: "Feature walls that give living rooms warmth and character.",
    image: "/Image/products/slabs/stone-slab-04.jpg", heroImage: "/Image/products/slabs/stone-slab-04.jpg",
  },
  {
    slug: "from-floor-plan-to-handover",
    title: "From Floor Plan to Handover: How We Deliver a Turnkey Custom Home in Perth",
    category: "Construction", tags: "Construction, Perth, Turnkey",
    author: "KSD Homes", date: "2026-09-08",
    excerpt: "From floor plan to handover — delivering a turnkey custom home in Perth.",
    image: "/Image/projects/sharma-residence/floor-plan-02.jpg", heroImage: "/Image/projects/sharma-residence/floor-plan-02.jpg",
  },
  {
    slug: "designing-a-home-cinema-room",
    title: "Designing a Home Cinema Room: Lighting, Acoustics and Seating",
    category: "Home Entertainment", tags: "Home Entertainment, Cinema",
    author: "KSD Homes", date: "2026-08-29",
    excerpt: "Lighting, acoustics and seating for a home cinema room.",
    image: "/Image/banners/general/banner-wide-03.jpg", heroImage: "/Image/banners/general/banner-wide-03.jpg",
  },
].map((row) => ({
  ...row,
  introHeading: "Premium design for Western Australian living",
  introText: text,
  galleryA: AUS_PUBLIC.diningLight, galleryB: AUS_PUBLIC.bedroomTimber,
  secondHeading: "Why families trust a complete home team", secondText: text2,
  approachHeading: "Our Personal Approach",
  approachItems: "Architecture and interior design together\nLicensed boutique builder\nIndoor–outdoor living for WA light\nCustomer-centred delivery",
  approachImage: AUS_PUBLIC.joinery,
}));

const asAusDoc = (site, _label, row) => ({ ...row, site, published: true });

const project = (site, label, [title, category], i) => (
  site === "australia"
    ? {
      site, title, slug: slugify(title), category, published: true,
      client: "Private residence", projectType: category,
      suburb: i === 1 ? "Port Coogee" : "Residence",
      shortCode: "",
      featured: true,
      status: i === 1 ? "Upcoming" : "In Delivery",
      collection: i === 1 ? "Upcoming" : "In Delivery",
      location: "Western Australia", date: i === 1 ? "Upcoming" : "In delivery",
      storeys: "3", specLine: i === 1 ? "Upcoming · Three storeys · Coastal WA" : "Three storeys · Pool & alfresco · Marble floors",
      conceptHeadline: i === 1 ? "Conceptual design of an upcoming home" : "The beauty of indoor-outdoor living",
      planLabels: i === 1 ? "" : "Ground\nUpper\nUndercroft",
      imageA: i === 1 ? AUS_PUBLIC.livingOutlook : AUS_PUBLIC.dining,
      imageB: i === 1 ? AUS_PUBLIC.livingCalm : AUS_PUBLIC.planGround,
      heroImage: i === 1 ? AUS_PUBLIC.livingOutlook : AUS_PUBLIC.dining,
      floorPlanA: i === 1 ? "" : AUS_PUBLIC.planGround,
      floorPlanB: i === 1 ? "" : AUS_PUBLIC.planUpper,
      heading: "A boutique home composed as one complete living environment",
      paragraphs: `${text}\n\n${text2}`,
      factsTitle: "Architecture & interior, designed as one", factsText: text2,
      checks: "Architecture and interior design together\nLicensed boutique builder\nIndoor–outdoor living\nClient address remains private",
    }
    : {
      site, title, slug: slugify(title), category, published: true,
      client: `${label} Design Studio`, projectType: category, date: `1${i + 1} January 2026`, website: "yourdomain.com",
      imageA: pic(g(i), 0, 900, 1000), imageB: pic(g(i), 1, 900, 1000), heroImage: pic(g(i), 2, 1400, 900),
      heading: "Here to Know About This Project", paragraphs: `${text}\n\n${text2}`,
      factsTitle: "Interesting Facts In Approach", factsText: text2,
      checks: "Hand-selected slabs\nPrecision cutting\nFast and reliable service\nAffordable solutions\nExpert installers\nModern equipment",
      extraHeading: "A note on this project", extraParagraphs: text2,
    }
);
const AUS_SERVICE_IMAGES = [
  AUS_PUBLIC.livingOutlook,
  AUS_PUBLIC.bedroom,
  AUS_PUBLIC.diningFormal,
  AUS_PUBLIC.diningLight,
];
const service = (site, label, [title, shortDescription], i) => ({
  site, title, slug: slugify(title), shortDescription, published: true,
  image: site === "australia" ? AUS_SERVICE_IMAGES[i % AUS_SERVICE_IMAGES.length] : pic(g(i), 0, 800, 800),
  heroImage: site === "australia" ? AUS_SERVICE_IMAGES[i % AUS_SERVICE_IMAGES.length] : pic(g(i), 1, 1400, 900),
  paragraphs: `${text}\n\n${text2}`, strategyHeading: "Our Approach", strategyText: text2,
  features: site === "india"
    ? "Direct quarry sourcing | Italian and selected Indian slabs, chosen one by one in Kishangarh.\nPrecision dry-lay | The full surface is laid out before bonding so veins and joints can be approved."
    : "Expert Installation | Skilled fitters with years of stone experience.\nFlooring Upgrades | Refresh any room with a premium stone finish.",
  processHeading: site === "india" ? "Our Four-Step Installation Process" : "Service Process",
  steps: site === "india"
    ? "Slab selection & dry-lay | You choose the actual slabs. We dry-lay the surface so vein flow is approved before cutting.\nMeasure, template & cut | Site measurements go back to the yard. Slabs are calibrated, cut and edged to the approved layout.\nVein-matched installation | Stone is set on a levelled base with colour-matched joints so the surface reads as one piece.\nPolish, seal & handover | The surface is polished, sealed, and handed over with a simple care note."
    : "Request For Service | Tell us about your space and what you have in mind.\nService Planning | We measure, plan the cuts and agree a timeline.\nQuality Control | Every slab is checked before and after installation.\nFollow-up & Support | We stay in touch to make sure you are delighted.",
  videoHeading: "See How We Work", videoText: text2, videoUrl: "https://www.youtube.com/watch?v=hddwAIXbKZo",
  faqHeading: site === "india" ? "Marble Care & Queries" : "Frequently Asked Questions",
  faqs: site === "india"
    ? "Can I approve the slabs before they are cut? | Yes. Review the dry-lay in Kishangarh, or from photographs, before fabrication starts.\nHow do you keep veins continuous across a large floor or wall? | Sequential slabs from the same block are dry-laid and book-matched before cutting.\nHow is marble protected after installation? | A breathable penetrating sealer resists stains without changing the natural colour.\nDo you work on homes and commercial spaces? | Yes. Residences, hotels, lobbies and offices use the same dry-lay and installation process."
    : "What services do you provide? | We supply and install marble, granite and quartz for floors, walls and countertops.\nDo you offer emergency repair? | Yes, we repair cracked or water-damaged stone quickly to prevent further damage.\nDo you work on homes and businesses? | Yes, we handle residential and commercial projects of every size.",
});
const blog = (site, label, [title, category], i) => ({
  site, title, slug: slugify(title), category, published: true, author: "admin", tags: `${category}, Marble`,
  date: new Date(Date.now() - i * 5 * day).toISOString().slice(0, 10), excerpt: text.slice(0, 140) + "…",
  image: site === "australia" ? AUS_SERVICE_IMAGES[i % AUS_SERVICE_IMAGES.length] : pic(g(i + 1), 0, 800, 800),
  heroImage: site === "australia" ? AUS_SERVICE_IMAGES[i % AUS_SERVICE_IMAGES.length] : pic(g(i + 1), 1, 1400, 900),
  introHeading: "Premium stone for stylish spaces", introText: text,
  galleryA: site === "australia" ? AUS_PUBLIC.diningLight : pic(g(i + 2), 0, 900, 700),
  galleryB: site === "australia" ? AUS_PUBLIC.bedroom : pic(g(i + 3), 1, 900, 700),
  secondHeading: "Why homeowners trust our stone experts", secondText: text2,
  approachHeading: "Our Personal Approach",
  approachItems: "Expert installation for homes and offices\nDurable materials built for daily wear\nSkilled craftsmanship for lasting results\nRegular care and maintenance advice",
  approachImage: site === "australia" ? AUS_PUBLIC.joinery : pic(g(i), 2, 800, 600),
});

async function runSeed({ force = FORCE, disconnect = true } = {}) {
  await connectDB();
  await Admin.ensure();
  const setsFor = (site) => site === "australia"
    ? { projects: [AUS_PROJECTS, asAusDoc], services: [AUS_SERVICES, asAusDoc], blogs: [AUS_BLOGS, asAusDoc] }
    : { projects: [INDIA_PROJECTS, asIndiaDoc], services: [INDIA_SERVICES, asIndiaDoc], blogs: [INDIA_BLOGS, asIndiaDoc] };

  for (const site of SITES) {
    const label = site[0].toUpperCase() + site.slice(1);
    const sets = setsFor(site);
    for (const [name, [rows, build]] of Object.entries(sets)) {
      const M = models[name];
      if (force) await M.deleteMany({ site });
      else if (await M.countDocuments({ site })) { console.log(`skip   ${site}/${name} (already has content)`); continue; }
      await M.insertMany(rows.map((r, i) => ({ ...build(site, label, r, i), createdAt: new Date(Date.now() - i * day) })));
      console.log(`added  ${site}/${name}: ${rows.length}`);
    }
    if (force) await Contact.deleteMany({ site });
    if (!(await Contact.countDocuments({ site }))) {
      await Contact.insertMany([
        { site, name: "Aarav Mehta", email: "aarav@example.com", phone: "+91 98765 43210", subject: "Marble flooring quote", message: "Hi, I'd like a quote for 1,200 sq ft of Italian marble flooring." },
        { site, name: "Sophie Turner", email: "sophie@example.com", subject: "Kitchen benchtop", message: "Do you supply and install marble benchtops? I'd like to book a site visit." },
      ]);
      console.log(`added  ${site}/contacts: 2`);
    }
  }
  console.log("\nSeed finished.");
  if (disconnect) await mongoose.disconnect();
}

module.exports = { runSeed };

if (require.main === module) {
  runSeed().catch((e) => { console.error(e); process.exit(1); });
}
