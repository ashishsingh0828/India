import { useState } from "react";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ProjectGallery from "../../components/Gallery/ProjectGallery";
import Pagination from "../../components/Common/Pagination";
import { PageLoader, PageError, Empty } from "../../components/Status";
import { useApi } from "../../api";

const DUMMY_PROJECTS = [
  {
    id: "p1",
    title: "Statuario Grand Villa Living & Entryway",
    slug: "statuario-grand-villa",
    imageA: "/Images/Our gallery/Bianco Vogue Marble.png",
    imageB: "/Images/Our gallery/Fossana Marble.png",
  },
  {
    id: "p2",
    title: "Calacatta Gold Bookmatched Bath Suite",
    slug: "calacatta-gold-bath-suite",
    imageA: "/Images/Our gallery/Paonazzo Marble.png",
    imageB: "/Images/Our gallery/Pirgon Marble.png",
  },
  {
    id: "p3",
    title: "Emperador Dark & Spanish Crema Foyer",
    slug: "emperador-dark-foyer",
    imageA: "/Images/Our gallery/Thassos White Marble.png",
    imageB: "/Images/Our gallery/Tortuga Marble.png",
  },
  {
    id: "p4",
    title: "Nero Marquina Monolithic Waterfall Island",
    slug: "nero-marquina-waterfall",
    imageA: "/Images/Service/Bianco Vogue Marble.png",
    imageB: "/Images/Service/Dover White Marble.png",
  },
];

export default function Projects() {
  const { data, loading, error, reload } = useApi("/projects");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const list = data?.length ? data : DUMMY_PROJECTS;
  const startIndex = (page - 1) * pageSize;
  const paginatedProjects = list.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PageBanner title="Our Stone Projects" breadcrumbs={[{ label: "Home", path: "/" }, { label: "Projects" }]} />
      {loading ? (
        <PageLoader />
      ) : error && !list?.length ? (
        <PageError error={error} onRetry={reload} />
      ) : (
        <>
          <ProjectGallery projects={paginatedProjects} />
          <Pagination
            currentPage={page}
            totalItems={list.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      )}
      <Banner />
    </>
  );
}
