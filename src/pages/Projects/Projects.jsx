import { useState } from "react";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ProjectGallery from "../../components/Gallery/ProjectGallery";
import Pagination from "../../components/Common/Pagination";
import { PageLoader, PageError } from "../../components/Status";
import { useApi } from "../../api";
import { FALLBACK_PROJECTS } from "../../data/projects";
import { IMG } from "../../data/images";

export default function Projects() {
  const { data, loading, error, reload } = useApi("/projects");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const list = data?.length ? data : FALLBACK_PROJECTS;
  const startIndex = (page - 1) * pageSize;
  const paginatedProjects = list.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <PageBanner
        title="Our Stone Projects"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Projects" }]}
        bgImage={IMG.hero2}
      />
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
      <Banner image={IMG.hero1} />
    </>
  );
}
