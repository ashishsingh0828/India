import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import BlogList from "../../components/BlogList/BlogList";
import Pagination from "../../components/Common/Pagination";
import { PageLoader, PageError, Empty } from "../../components/Status";
import { useApi, asset, slugify, splitTags } from "../../api";
import { pic } from "../../data/images";

const DUMMY_BLOGS = [
  {
    slug: "statuario-vs-calacatta-marble-guide",
    title: "Statuario vs Calacatta Marble: The Connoisseur’s Selection Guide",
    category: "Marble Guides",
    tags: "Italian Marble, Statuario, Calacatta",
    author: "IE Marbles Curators",
    excerpt: "Understand the subtle differences in veining, quarry origins, and translucency between Italy's most celebrated white marbles.",
    image: "/Images/About Us images/Calacatta Crema Marble.png",
  },
  {
    slug: "honed-vs-polished-natural-stone-finishes",
    title: "Honed vs Polished: Selecting the Ideal Finish for Floors & Facades",
    category: "Architecture",
    tags: "Finishes, Honed, Polished, Architecture",
    author: "IE Marbles Tech Team",
    excerpt: "Explore slip resistance, light refraction, and tactile depth across honed, leathered, and high-gloss polished marble finishes.",
    image: "/Images/About Us images/Calacatta Viola Marble.png",
  },
  {
    slug: "art-of-bookmatching-marble-slabs",
    title: "The Art of Bookmatching: Turning Natural Marble Into Living Art",
    category: "Stone Craft",
    tags: "Bookmatching, Slabs, Interior Design",
    author: "IE Marbles Artisans",
    excerpt: "How mirror-cut adjacent slabs create symmetrical kaleidoscopic patterns that define luxury entry halls and master baths.",
    image: "/Images/About Us images/Statuario Baratini Marble.png",
  },
];

export default function Blogs() {
  const { data, loading, error, reload } = useApi("/blogs");
  const [params] = useSearchParams(); // ?category=  ?tag=  ?search=  ?author=
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const category = params.get("category");
  const tag = params.get("tag");
  const author = (params.get("author") || "").toLowerCase();
  const q = (params.get("search") || "").toLowerCase();
  const filtered = !category && !tag && !author && !q ? false : true;

  const sourceData = (data && data.length) ? data : DUMMY_BLOGS;

  const posts = sourceData
    .filter((p) =>
      (!category || slugify(p.category) === category) &&
      (!tag || splitTags(p.tags).some((t) => slugify(t) === tag)) &&
      (!author || (p.author || "").toLowerCase() === author) &&
      (!q || `${p.title} ${p.excerpt || ""}`.toLowerCase().includes(q))
    )
    .map((p, i) => ({ slug: p.slug, title: p.title, category: p.category || "", image: pic(asset(p.image), i) }));

  const startIndex = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);

  const label = q ? `Search: “${params.get("search")}”` : category || tag ? (sourceData || []).flatMap((p) => [p.category, ...splitTags(p.tags)]).find((c) => slugify(c) === (category || tag)) : author ? `Posts by ${params.get("author")}` : "";

  return (
    <>
      <PageBanner
        title={label || "Stone & Marble Journal"}
        breadcrumbs={[{ label: "Home", path: "/" }, ...(filtered ? [{ label: "Blog", path: "/blogs" }] : []), { label: label || "Blog" }]}
        bgImage="/Images/Banner Slider images/4.png"
      />
      {loading ? <PageLoader /> : error && !sourceData.length ? <PageError error={error} onRetry={reload} /> :
        posts.length ? (
          <>
            <BlogList posts={paginatedPosts} />
            <Pagination
              currentPage={page}
              totalItems={posts.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </>
        ) : (
          <Empty title="No posts found" text={filtered ? "Try a different search or category." : "Blog posts added in the admin panel will appear here."} link={filtered && { to: "/blogs", label: "View all posts" }} />
        )}
      <Banner />
    </>
  );
}
