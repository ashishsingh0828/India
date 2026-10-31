import { useState } from "react";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ServiceList from "../../components/ServiceList/ServiceList";
import Pagination from "../../components/Common/Pagination";
import { PageLoader, PageError, Empty } from "../../components/Status";
import { useApi, asset } from "../../api";
import { pic } from "../../data/images";

const SERVICES_BANNER = "/Images/Services/Banner.jpg";

const DUMMY_SERVICES = [
  {
    slug: "feature-walls-book-matching",
    title: "Feature Walls & Book-Matching Coordination",
    description:
      "Dramatic, symmetrical book-matched marble or quartzite feature walls with continuous natural veining — coordinated slab selection, dry-lay approval and precise installation.",
    image: "/Images/Services/S-1.jpg",
    imageB: "/Images/Services/S-2.jpg",
  },
  {
    slug: "facades-architectural-cladding",
    title: "Facades & Architectural Cladding",
    description:
      "Calibrated limestone and quartzite facade panels with crisp mitered joints, aligned shadow lines and daylight-ready exterior coordination for refined buildings.",
    image: "/Images/Services/S-2.jpg",
    imageB: "/Images/Services/S-1.jpg",
  },
  {
    slug: "surfaces-custom-edge-detailing",
    title: "Surfaces & Custom Edge Detailing",
    description:
      "Monolithic natural stone islands and surfaces with mitered waterfall edges, honed depth and custom profiles coordinated from selection through fabrication.",
    image: "/Images/Services/S-3.jpg",
    imageB: "/Images/Services/S-4.jpg",
  },
  {
    slug: "flooring-selection-dry-lay",
    title: "Flooring Selection & Dry-Lay Coordination",
    description:
      "Large-format honed marble flooring with seamless grain alignment, tonal balance and dry-lay verification before installation across luxury interiors.",
    image: "/Images/Services/S-4.jpg",
    imageB: "/Images/Services/S-3.jpg",
  },
  {
    slug: "monolithic-staircases-inlays",
    title: "Monolithic Staircases & Custom Inlays",
    description:
      "Floating stone staircases with continuous grain from tread to riser, precision inlays and architectural detailing for sophisticated modern interiors.",
    image: "/Images/Services/S-5.jpg",
    imageB: "/Images/Services/S-1.jpg",
  },
];

export default function Services() {
  const { data, loading, error, reload } = useApi("/services");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const allServices = (data && data.length)
    ? data.map((s) => ({
        slug: s.slug,
        title: s.title,
        description: s.shortDescription || "",
        image: pic(asset(s.image), 0),
        imageB: pic(asset(s.imageB || s.heroImage || s.image), 1),
      }))
    : DUMMY_SERVICES;

  const startIndex = (page - 1) * pageSize;
  const paginatedServices = allServices.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PageBanner
        title="Services & Sourcing Process"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Services" }]}
        bgImage={SERVICES_BANNER}
      />
      {loading ? (
        <PageLoader />
      ) : error && (!data || !data.length) ? (
        <ServiceList services={DUMMY_SERVICES} />
      ) : allServices.length ? (
        <>
          <ServiceList services={paginatedServices} />
          <Pagination
            currentPage={page}
            totalItems={allServices.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Empty
          title="No services yet"
          text="Services added in the admin panel will appear here."
        />
      )}
      <Banner image={SERVICES_BANNER} />
    </>
  );
}
