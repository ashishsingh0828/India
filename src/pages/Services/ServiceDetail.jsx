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

const SERVICES_BANNER = "/Images/Services/Banner.jpg";

const DUMMY_SERVICE_DETAIL = {
  title: "Feature Walls & Book-Matching Coordination",
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
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const one = useApi(`/services/${slug}`);
  const all = useApi("/services");

  const s = one.data || (!one.loading && one.error ? DUMMY_SERVICE_DETAIL : null);
  const crumbs = (title) => [{ label: "Home", path: "/" }, { label: "Services", path: "/services" }, { label: title }];

  if (one.loading) {
    return (
      <>
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} bgImage={SERVICES_BANNER} />
        <PageLoader />
      </>
    );
  }

  if (!s) {
    return (
      <>
        <PageBanner title="Service Details" breadcrumbs={crumbs("Service Details")} bgImage={SERVICES_BANNER} />
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
    sideImage: pic(asset(s.imageB || s.image || s.heroImage), 2),
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
  const FALLBACK_SERVICE_LINKS = [
    { title: "Feature Walls & Book-Matching Coordination", slug: "feature-walls-book-matching" },
    { title: "Facades & Architectural Cladding", slug: "facades-architectural-cladding" },
    { title: "Surfaces & Custom Edge Detailing", slug: "surfaces-custom-edge-detailing" },
    { title: "Flooring Selection & Dry-Lay Coordination", slug: "flooring-selection-dry-lay" },
    { title: "Monolithic Staircases & Custom Inlays", slug: "monolithic-staircases-inlays" },
  ];
  const serviceRows = (all.data && all.data.length)
    ? all.data
    : (one.data?.related?.length
      ? [one.data, ...one.data.related].filter((x, i, arr) => x?.slug && arr.findIndex((y) => y.slug === x.slug) === i)
      : FALLBACK_SERVICE_LINKS);
  /* Up to 4 sidebar links; keep current service first so NavLink active state is clear. */
  const ordered = [...serviceRows].sort((a, b) => (a.slug === slug ? -1 : b.slug === slug ? 1 : 0));
  const links = ordered.slice(0, 4).map((x) => ({ label: x.title, href: `/services/${x.slug}` }));

  return (
    <>
      <PageBanner title={s.title} breadcrumbs={crumbs(s.title)} bgImage={SERVICES_BANNER} />
      <ServiceDetails service={service} links={links} />
      <Banner image={SERVICES_BANNER} />
    </>
  );
}
