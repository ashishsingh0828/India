import { useParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ServiceDetails from "../../components/ServiceDetails";
import { PageLoader, PageError } from "../../components/Status";
import { useApi, asset, paras, pairs, youtubeId } from "../../api";

const DUMMY_SERVICE_DETAIL = {
  title: "Marble Flooring & Dry-Lay",
  heroImage: "/Images/Service/Omini Bianco Marble.png",
  image: "/Images/Service/Tempest Marble.png",
  paragraphs: [
    "We provide comprehensive natural marble slab selection, precision dry-lay layouts, and sub-millimeter joint installation for luxury residences, commercial lobbies, and villas.",
    "Every block is carefully selected at our Kishangarh stone facility for uniform density, natural mineral luster, and continuous vein movement across adjacent slabs.",
    "Prior to installation, we dry-lay the entire surface in our workshop to allow clients and architects to inspect bookmatching and vein continuity."
  ],
  strategyHeading: "Our Stone Craftsmanship & Engineering",
  strategyText: "Leveraging 5-axis Italian bridge cutters and laser alignment tools, we eliminate uneven joints and lippage.",
  features: [
    ["Direct Quarry Sourcing", "Imported Statuario, Calacatta, and premium Indian Makrana and Rajnagar marbles."],
    ["Precision Dry-Lay Inspection", "Full-scale slab positioning mapped before any permanent bonding."]
  ],
  processHeading: "Our Four-Stage Installation Process",
  steps: [
    ["Slab Selection & Dry-Lay", "Clients hand-select slabs and review dry-lay flow in our Kishangarh yard."],
    ["Base Calibration", "Screed leveling with laser gauges to ensure an ultra-flat subfloor."],
    ["Vein-Matched Laying", "Installation using high-performance stone adhesive and hairline color-matched joints."],
    ["Diamond Polishing & Sealing", "Multi-stage diamond grinding followed by deep fluoropolymer nano-sealing."]
  ],
  faqHeading: "Marble Care & Queries",
  faqs: [
    ["How often should natural marble floors be sealed?", "We apply a heavy-duty penetrating sealer that protects stone for 3 to 5 years depending on traffic."],
    ["Can veins be continuous across large hall floors?", "Yes, through our computerized book-matching and pre-installation dry-lay process."]
  ]
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const one = useApi(`/services/${slug}`);
  const all = useApi("/services"); // used for the sidebar "Service List"

  const s = one.data || (!one.loading && one.error ? DUMMY_SERVICE_DETAIL : null);
  const crumbs = (title) => [{ label: "Home", path: "/" }, { label: "Services", path: "/services" }, { label: title }];

  if (one.loading) {
    return (
      <>
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} />
        <PageLoader />
      </>
    );
  }

  if (!s) {
    return (
      <>
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} />
        <PageError error={one.error} onRetry={one.reload} />
      </>
    );
  }

  const vid = youtubeId(s.videoUrl);
  const service = {
    hero: asset(s.heroImage || s.image),
    contactImage: asset(s.image),
    paragraphs: paras(s.paragraphs),
    strategyHeading: s.strategyHeading || "",
    strategyText: s.strategyText || "",
    sideImage: asset(s.image),
    features: (Array.isArray(s.features) && typeof s.features[0] === 'object' && !Array.isArray(s.features[0]))
      ? s.features
      : pairs(s.features).map(([title, text]) => ({ title, text })),
    processHeading: s.processHeading || "Service Process",
    steps: (Array.isArray(s.steps) && typeof s.steps[0] === 'object' && !Array.isArray(s.steps[0]))
      ? s.steps
      : pairs(s.steps).map(([title, text]) => ({ title, text })),
    videoHeading: s.videoHeading || "",
    videoText: s.videoText || "",
    video: vid ? { thumb: asset(s.heroImage || s.image), youtubeId: vid } : null,
    faqHeading: s.faqHeading || "Frequently Asked Questions",
    faqs: (Array.isArray(s.faqs) && typeof s.faqs[0] === 'object' && !Array.isArray(s.faqs[0]))
      ? s.faqs
      : pairs(s.faqs).map(([q, a], i) => ({ q: `${i + 1}. ${q}`, a })),
  };
  const links = (all.data && all.data.length ? all.data : [
    { title: "Marble Flooring", slug: "marble-flooring" },
    { title: "Wall Cladding", slug: "wall-cladding" },
    { title: "Countertops & Vanities", slug: "countertops-vanities" },
    { title: "Custom Staircases", slug: "staircases-inlays" },
  ]).map((x) => ({ label: x.title, href: `/services/${x.slug}` }));

  return (
    <>
      <PageBanner title={s.title} breadcrumbs={crumbs(s.title)} />
      <ServiceDetails service={service} links={links} />
      <Banner />
    </>
  );
}
