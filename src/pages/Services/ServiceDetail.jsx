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
import { SERVICE_FALLBACK_LINKS, serviceFallback } from "../../data/serviceFallbacks";

const SERVICES_BANNER = "/Images/Services/Banner.jpg";

export default function ServiceDetail() {
  const { slug } = useParams();
  const one = useApi(`/services/${slug}`);
  const all = useApi("/services");
  const fallback = serviceFallback(slug);
  /* Only use API payload when it matches this slug — avoids stale/wrong service content. */
  const live = one.data && one.data.slug === slug ? one.data : null;
  const s = live || (!one.loading ? fallback : null);
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
  /* Admin content always wins. Only the untouched legacy generic seed text (stone-fitting boilerplate that
     was never India copy) is replaced by the India fallbacks. */
  const legacySteps = parsedSteps.length > 0 && /request for service/i.test(parsedSteps[0].title)
    && /tell us about your space/i.test(parsedSteps[0].text || "");
  const legacyFaqs = parsedFaqs.length > 0 && /what services do you provide|emergency repair/i.test(parsedFaqs[0].q || "")
    && /supply and install marble, granite and quartz|repair cracked or water-damaged/i.test(parsedFaqs.map((r) => r.a).join(" "));
  const steps = parsedSteps.length && !legacySteps ? parsedSteps : FALLBACK_STEPS;
  const faqs = parsedFaqs.length && !legacyFaqs ? parsedFaqs : FALLBACK_FAQS;
  const service = {
    hero: pic(asset(s.heroImage || s.image), 0),
    contactImage: pic(asset(s.contactImage) || CONTACT_IMAGE, 5),
    paragraphs: Array.isArray(s.paragraphs) && s.paragraphs.length
      ? s.paragraphs
      : (paras(s.paragraphs).length ? paras(s.paragraphs) : fallback.paragraphs),
    strategyHeading: s.strategyHeading || "",
    strategyText: s.strategyText || "",
    sideImage: pic(asset(s.imageB || s.image || s.heroImage), 2),
    features: normalizePairs(s.features, ["title", "text"]),
    processHeading: installationHeading(s.processHeading, steps.length),
    steps,
    videoHeading: s.videoHeading || "See How We Work",
    videoText: s.videoText || "",
    video: vid ? { thumb: pic(asset(s.image) || BANNER_IMAGE, 3), youtubeId: vid } : null,
    faqHeading: faqs === FALLBACK_FAQS || !s.faqHeading ? "Marble Care & Queries" : s.faqHeading,
    faqs,
  };
  const serviceRows = (all.data && all.data.length)
    ? all.data
    : (live?.related?.length
      ? [live, ...live.related].filter((x, i, arr) => x?.slug && arr.findIndex((y) => y.slug === x.slug) === i)
      : SERVICE_FALLBACK_LINKS);
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
