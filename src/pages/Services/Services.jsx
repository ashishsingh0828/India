import { useState } from "react";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ServiceList from "../../components/ServiceList/ServiceList";
import Pagination from "../../components/Common/Pagination";
import { PageLoader, PageError, Empty } from "../../components/Status";
import { useApi, asset } from "../../api";
import { pic } from "../../data/images";

const DUMMY_SERVICES = [
  {
    slug: "marble-flooring",
    title: "Flooring Selection & Dry-Lay Coordination",
    description:
      "Dimensional and calibration requirements coordinated to agreed specifications, with dry-lay verification for seamless pattern and grain continuity.",
    image: "/Images/Client feedback/Client feedback-1.png",
  },
  {
    slug: "wall-cladding",
    title: "Feature Walls & Facade Coordination",
    description:
      "Stone selection and processing coordination for book-matched feature walls and facade applications across refined residential and commercial briefs.",
    image: "/Images/Client feedback/Client feedback-2.png",
  },
  {
    slug: "countertops-vanities",
    title: "Surfaces & Edge Detailing Coordination",
    description:
      "CNC and waterjet processing coordination, where available, for natural quartzite, granite and marble surfaces with custom mitered profiles.",
    image: "/Images/Video section Images/Video section Images.png",
  },
  {
    slug: "staircases-inlays",
    title: "Custom Staircases & Architectural Details",
    description:
      "Sourcing and processing coordination for monolithic stone staircases, treads, risers and custom inlaid transition details.",
    image: "/Images/Banner Slider images/1.png",
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
      }))
    : DUMMY_SERVICES;

  const startIndex = (page - 1) * pageSize;
  const paginatedServices = allServices.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PageBanner
        title="Services & Sourcing Process"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Services" }]}
        bgImage="/Images/Banner Slider images/3.png"
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
      <Banner image="/Images/Banner Slider images/1.png" />
    </>
  );
}