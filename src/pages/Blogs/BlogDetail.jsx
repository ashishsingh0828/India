import { useParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import BlogDetails from "../../components/blog-details/BlogDetails";
import { PageLoader, PageError } from "../../components/Status";
import { useApi, asset, lines, splitTags, fmtDate } from "../../api";

const DUMMY_BLOG_DETAIL = {
  title: "Statuario vs Calacatta Marble: The Connoisseur’s Selection Guide",
  heroImage: "/Images/Video section Images/Video section Images.png",
  image: "/Images/Banner Slider images/1.png",
  introHeading: "Comparing Two of the World's Most Iconic White Carrara Stones",
  introText: "Italian marble has remained the pinnacle of architectural luxury for millennia. Among Carrara's prized extractions, Statuario and Calacatta Gold stand as the world's most sought-after natural stones.",
  galleryA: "/Images/Banner Slider images/2.png",
  galleryB: "/Images/Banner Slider images/3.png",
  secondHeading: "Distinctive Vein Characteristics & Mineral Composition",
  secondText: "While Statuario features bold, dramatic grey and charcoal veining sweeping across an ultra-pure milk-white crystalline background, Calacatta Gold introduces warm taupe, honey, and champagne tones woven into its vein network.",
  approachHeading: "Key Selection & Installation Guidelines",
  approachItems: "Hand-select whole slabs to ensure full lot color consistency\nAlways request pre-cutting dry-lay dry runs for vein alignment\nEnsure penetrating fluoropolymer sealing immediately following laying",
  approachImage: "/Images/Banner Slider images/4.png",
  author: "IE Marbles Curators",
  date: "October 2026",
  category: "Marble Guides",
  tags: "Italian Marble, Statuario, Calacatta, Quarry Selection",
};

export default function BlogDetail() {
  const { slug } = useParams();
  const one = useApi(`/blogs/${slug}`);
  const all = useApi("/blogs"); // sidebar: recent posts, categories, tags

  const p = one.data || (!one.loading && one.error ? DUMMY_BLOG_DETAIL : null);
  const title = p?.title || "Stone & Marble Journal";
  const banner = <PageBanner title={title} breadcrumbs={[{ label: "Home", path: "/" }, { label: "Blog", path: "/blogs" }, { label: title }]} />;

  if (one.loading) return <>{banner}<PageLoader /></>;
  if (!p) return <>{banner}<PageError error={one.error} onRetry={one.reload} /></>;

  const list = all.data || [];
  const post = {
    hero: asset(p.heroImage || p.image),
    introHeading: p.introHeading || p.title,
    introText: p.introText || p.excerpt || "",
    gallery: [p.galleryA, p.galleryB].filter(Boolean).map(asset),
    secondHeading: p.secondHeading || "",
    secondText: p.secondText || "",
    approachHeading: p.approachHeading || "",
    approachItems: lines(p.approachItems),
    approachImage: asset(p.approachImage),
    author: p.author || "IE Marbles Expert",
    date: fmtDate(p.date || p.createdAt || "2026-10-08"),
    category: p.category || "Natural Stone",
    tags: splitTags(p.tags),
  };
  const recent = list.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => ({ slug: x.slug, title: x.title, image: asset(x.image) }));
  const categories = list.length
    ? [...new Set(list.map((x) => x.category).filter(Boolean))]
    : ["Marble Guides", "Architecture", "Stone Craft", "Quarry Imports"];
  const tags = list.length
    ? [...new Set(list.flatMap((x) => splitTags(x.tags)))]
    : ["Italian Marble", "Statuario", "Calacatta", "Bookmatching", "CNC Cutting"];

  return (
    <>
      {banner}
      <BlogDetails post={post} recent={recent} categories={categories} tags={tags} />
      <Banner />
    </>
  );
}
