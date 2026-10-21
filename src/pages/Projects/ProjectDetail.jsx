import { useParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ProjectDetailView from "../../components/ProjectDetials/ProjectDetail";
import { PageLoader, PageError } from "../../components/Status";
import { useApi } from "../../api";

const DUMMY_PROJECT_DETAIL = {
  title: "Statuario Grand Villa Living & Entryway",
  heroImage: "/Images/About Us images/Thasos Velluto Marble.png",
  client: "Private Luxury Residence",
  projectType: "Full Villa Marble Flooring & Bookmatched Entry",
  date: "October 2026",
  website: "iemarbles.com",
  heading: "Curated White Statuario Slabs with Precision CNC Cut & Bookmatched Finish",
  paragraphs: [
    "This architectural project showcases premium hand-selected Statuario marble slabs imported directly from Carrara quarries and processed at our Kishangarh facility.",
    "Every slab underwent high-definition digital vein mapping and 3D dry-lay dry runs prior to installation. The joints were calibrated down to sub-millimeter tolerances with specialized epoxy resins.",
    "A custom fluoropolymer impregnating sealant was applied to guarantee deep stain resistance while accentuating the natural translucent crystalline depth of the stone."
  ],
  factsTitle: "Key Stone Specification Highlights",
  factsText: "Direct quarry-sourced 20mm calibrated slabs polished to mirror 95-gloss reflection rating.",
  checks: [
    "Zero-bevel tight joints with colour-matched marble mastic",
    "Continuous vein alignment across foyer, living hall, and stairs",
    "Deep fluoropolymer nano-sealant with 10-year durability",
    "Dry-lay pre-inspection and client approval at Kishangarh yard"
  ]
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useApi(`/projects/${slug}`);
  const projectData = data || (!loading && error ? DUMMY_PROJECT_DETAIL : null);
  const title = projectData?.title || "Project Details";

  return (
    <>
      <PageBanner title={title} breadcrumbs={[{ label: "Home", path: "/" }, { label: "Projects", path: "/projects" }, { label: title }]} />
      {loading ? <PageLoader /> : projectData ? <ProjectDetailView data={projectData} /> : <PageError error={error} onRetry={reload} />}
      {projectData && <Banner />}
    </>
  );
}
