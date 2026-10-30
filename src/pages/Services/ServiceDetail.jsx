import { useParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ServiceDetails from "../../components/ServiceDetails";
import { PageLoader, PageError } from "../../components/Status";
import { useApi, asset, paras, youtubeId } from "../../api";
import { BANNER_IMAGE, DUMMY_VIDEO } from "../../config";
import { IMG, pic } from "../../data/images";
import {
  CONTACT_IMAGE,
  FALLBACK_FAQS,
  FALLBACK_STEPS,
  installationHeading,
  normalizePairs,
} from "../../data/services";

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
    { title: "Direct quarry sourcing", text: "Italian Statuario and Calacatta, with selected Indian stones, chosen slab by slab in Kishangarh." },
    { title: "Precision dry-lay", text: "The full surface is laid out before bonding so book-matching and joints can be approved in person." },
  ],
  processHeading: "Our Four-Step Installation Process",
  steps: FALLBACK_STEPS,
  faqHeading: "Marble Care & Queries",
  faqs: FALLBACK_FAQS,
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
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} bgImage={IMG.hero4} />
        <PageLoader />
      </>
    );
  }

  if (!s) {
    return (
      <>
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} bgImage={IMG.hero4} />
        <PageError error={one.error} onRetry={one.reload} />
      </>
    );
  }

  const vid = youtubeId(s.videoUrl) || youtubeId(DUMMY_VIDEO);
  const parsedFaqs = normalizePairs(s.faqs, ["q", "a"]);
  const parsedSteps = normalizePairs(s.steps, ["title", "text"]);
  const genericSteps = parsedSteps.some((row) => /request for service/i.test(row.title));
  const genericFaqs = parsedFaqs.some((row) => /emergency repair/i.test(`${row.q} ${row.a}`));
  const steps = parsedSteps.length && !genericSteps ? parsedSteps : FALLBACK_STEPS;
  const faqs = parsedFaqs.length >= 2 && !genericFaqs ? parsedFaqs : FALLBACK_FAQS;
  const service = {
    hero: pic(asset(s.heroImage || s.image), 0),
    contactImage: pic(asset(s.contactImage) || CONTACT_IMAGE, 5),
    paragraphs: Array.isArray(s.paragraphs) && s.paragraphs.length
      ? s.paragraphs
      : (paras(s.paragraphs).length ? paras(s.paragraphs) : DUMMY_SERVICE_DETAIL.paragraphs),
    strategyHeading: s.strategyHeading || "",
    strategyText: s.strategyText || "",
    sideImage: pic(asset(s.image || s.heroImage), 2),
    features: normalizePairs(s.features, ["title", "text"]),
    processHeading: installationHeading(s.processHeading, steps.length),
    steps,
    videoHeading: s.videoHeading || "See How We Work",
    videoText: s.videoText || "",
    video: vid ? { thumb: pic(asset(s.image) || BANNER_IMAGE, 3), youtubeId: vid } : null,
    faqHeading: s.faqHeading && !/^frequently asked questions$/i.test(s.faqHeading)
      ? s.faqHeading
      : "Marble Care & Queries",
    faqs,
  };
  const links = (all.data && all.data.length ? all.data : [
    { title: "Marble Flooring", slug: "marble-flooring" },
    { title: "Wall Cladding", slug: "wall-cladding" },
    { title: "Countertops & Vanities", slug: "countertops-vanities" },
    { title: "Custom Staircases", slug: "staircases-inlays" },
  ]).map((x) => ({ label: x.title, href: `/services/${x.slug}` }));

  return (
    <>
      <PageBanner title={s.title} breadcrumbs={crumbs(s.title)} bgImage={IMG.hero4} />
      <ServiceDetails service={service} links={links} />
      <Banner image={IMG.hero1} />
    </>
  );
}
