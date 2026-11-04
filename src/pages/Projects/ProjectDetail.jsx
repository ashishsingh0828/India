import { useParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ProjectDetailView from "../../components/ProjectDetials/ProjectDetail";
import { PageLoader, PageError } from "../../components/Status";
import { useApi, asset } from "../../api";
import { FALLBACK_PROJECTS, projectBySlug, withNeighbors } from "../../data/projects";
import { IMG } from "../../data/images";

export default function ProjectDetail() {
  const { slug } = useParams();
  const one = useApi(slug ? `/projects/${slug}` : null);
  const list = useApi("/projects");
  const hasApiList = !!list.data?.length;
  /* API wins: only use the bundled fallback when the API has no published projects. */
  const fallback = hasApiList ? null : (projectBySlug(slug) || FALLBACK_PROJECTS[0]);
  const rows = hasApiList ? list.data : FALLBACK_PROJECTS;
  const projectData = one.data || (!one.loading && !list.loading ? fallback : null);
  const view = projectData ? withNeighbors(projectData, rows) : null;
  const title = view?.title || "Project Details";

  return (
    <>
      <PageBanner
        title={title}
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Projects", path: "/projects" }, { label: title }]}
        bgImage={asset(view?.heroImage || view?.imageA) || IMG.hero1}
      />
      {one.loading ? (
        <PageLoader />
      ) : view ? (
        <ProjectDetailView data={view} />
      ) : (
        <PageError error={one.error} onRetry={one.reload} />
      )}
      {!one.loading && view && <Banner image={IMG.hero3} />}
    </>
  );
}
