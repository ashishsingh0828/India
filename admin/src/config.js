/* One config object per content type drives its list page AND its form.
   Australia uses a luxury-homes layout (suburb, status, specs, floor plans).
   India keeps the stone / interiors project fields. */
import { getSite } from "./api";

const opts = (a) => a.map((v) => ({ value: v, label: v }));
const publishing = { title: "Publishing", fields: [{ name: "published", label: "Published (visible on the website)", type: "switch" }] };

const indiaProjects = {
  key: "projects", label: "Project", plural: "Projects", icon: "folder", color: "#B38A45",
  titleField: "title", imageField: "imageA", categoryField: "category",
  defaults: { heading: "Here to Know About This Project", factsTitle: "Interesting Facts In Approach", published: true },
  sections: [
    { title: "Basics", fields: [
      { name: "title", label: "Title", required: true },
      { name: "category", label: "Category", type: "select", options: opts(["Residential", "Commercial", "Flooring", "Kitchen & Countertops", "Bathrooms", "Wall Cladding"]) },
      { name: "client", label: "Client", placeholder: "Client or company name" },
      { name: "projectType", label: "Project Type", placeholder: "Marble Flooring" },
      { name: "date", label: "Date", placeholder: "15 January 2026" },
      { name: "website", label: "Website", placeholder: "yourdomain.com" },
    ] },
    { title: "Images", desc: "The gallery shows the first image and swaps to the second on hover.", cols: 3, fields: [
      { name: "imageA", label: "Gallery image", type: "image", required: true },
      { name: "imageB", label: "Gallery hover image", type: "image", required: true },
      { name: "heroImage", label: "Detail page top image", type: "image" },
    ] },
    { title: "Detail page content", fields: [
      { name: "heading", label: "Main heading", wide: true },
      { name: "paragraphs", label: "Paragraphs", type: "textarea", rows: 7, help: "Leave a blank line between paragraphs." },
      { name: "factsTitle", label: "Facts title", wide: true },
      { name: "factsText", label: "Facts text", type: "textarea", rows: 4 },
      { name: "checks", label: "Checklist", type: "textarea", rows: 5, help: "One item per line." },
      { name: "extraHeading", label: "Bottom heading", wide: true, help: "Optional heading above recent projects. Leave blank to hide." },
      { name: "extraParagraphs", label: "Bottom paragraphs", type: "textarea", rows: 5, help: "Optional copy. Leave a blank line between paragraphs." },
    ] },
    publishing,
  ],
};

const australiaProjects = {
  key: "projects", label: "Project", plural: "Projects", icon: "folder", color: "#B38A45",
  titleField: "title", imageField: "imageA", categoryField: "category",
  defaults: {
    heading: "A boutique home composed as one complete living environment",
    factsTitle: "Architecture & interior, designed as one",
    videoHeading: "Walk through the composition",
    client: "Private residence",
    location: "Western Australia",
    suburb: "Residence",
    status: "In Delivery",
    collection: "In Delivery",
    featured: true,
    published: true,
  },
  sections: [
    { title: "Basics", desc: "Name the project the way it appears on the collection — suburb first, never a street address.", fields: [
      { name: "title", label: "Project name", required: true, placeholder: "Residence" },
      { name: "suburb", label: "Collection name", placeholder: "Residence", help: "Large title on the project page, e.g. Residence or Port Coogee." },
      { name: "shortCode", label: "Short code (optional)", placeholder: "R01", help: "Optional second line under the name, in the luxury-builder style." },
      { name: "category", label: "Type", type: "select", options: opts(["Boutique Home", "Upcoming", "In Delivery", "Completed", "Architecture", "Interior Design"]) },
      { name: "status", label: "Status", type: "select", options: opts(["Upcoming", "In Delivery", "Completed"]) },
      { name: "collection", label: "Collection filter", type: "select", options: opts(["Residence", "Interior", "Upcoming"]) },
      { name: "year", label: "Year", placeholder: "2026" },
      { name: "scope", label: "Scope", type: "select", options: opts(["Build", "Interior", "Build + Interior", "Upcoming"]) },
      { name: "location", label: "Location", placeholder: "Western Australia", help: "Suburb or region only. Do not enter a street address." },
      { name: "client", label: "Client", placeholder: "Private residence" },
      { name: "date", label: "Date or phase", placeholder: "In delivery" },
      { name: "featured", label: "Featured on homepage collection", type: "switch" },
    ] },
    { title: "Specifications", desc: "Shown as a spec strip on the project page. Leave blank if not public.", cols: 3, fields: [
      { name: "storeys", label: "Storeys", placeholder: "3" },
      { name: "beds", label: "Beds" },
      { name: "baths", label: "Baths" },
      { name: "cars", label: "Cars" },
      { name: "floorArea", label: "Composition / area note", placeholder: "Marble main floors · pool & alfresco", wide: true },
      { name: "specLine", label: "Short spec line", placeholder: "Three storeys · Pool & alfresco", wide: true },
      { name: "conceptHeadline", label: "Concept line", placeholder: "The beauty of indoor-outdoor living", wide: true, help: "The large line on the hero, e.g. indoor–outdoor living." },
    ] },
    { title: "Hero & plans", desc: "Listing image plus floor plans.", cols: 3, fields: [
      { name: "imageA", label: "Listing image", type: "image", required: true },
      { name: "imageB", label: "Secondary image", type: "image" },
      { name: "heroImage", label: "Detail page hero", type: "image" },
      { name: "floorPlanA", label: "Floor plan — ground", type: "image" },
      { name: "floorPlanB", label: "Floor plan — upper", type: "image" },
      { name: "floorPlanC", label: "Floor plan — undercroft", type: "image" },
      { name: "planLabels", label: "Plan labels", type: "textarea", rows: 3, wide: true, help: "One per line, matching the three plans: Ground / Upper / Undercroft." },
    ] },
    { title: "Film", desc: "A YouTube walkthrough sits in the project story, the way a luxury builder showcases the finished house.", fields: [
      { name: "videoUrl", label: "YouTube video link", type: "url", placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "videoHeading", label: "Video heading", wide: true },
      { name: "videoText", label: "Video text", type: "textarea", rows: 3 },
    ] },
    { title: "Project photography", desc: "Upload several images of this project. Captions appear under each photo, in order.", cols: 3, fields: [
      { name: "galleryA", label: "Gallery 1", type: "image" },
      { name: "galleryB", label: "Gallery 2", type: "image" },
      { name: "galleryC", label: "Gallery 3", type: "image" },
      { name: "galleryD", label: "Gallery 4", type: "image" },
      { name: "galleryE", label: "Gallery 5", type: "image" },
      { name: "galleryF", label: "Gallery 6", type: "image" },
      { name: "galleryG", label: "Gallery 7", type: "image" },
      { name: "galleryH", label: "Gallery 8", type: "image" },
      { name: "scenes", label: "Photo captions", type: "textarea", rows: 8, wide: true, help: "One per line, in gallery order:  Caption | Short description  (e.g.  Poolside living | The ground floor opens to the alfresco and pool.)" },
      { name: "overlayCaption", label: "Hero overlay line", placeholder: "IN DELIVERY / RESIDENCE", wide: true },
    ] },
    { title: "Story", fields: [
      { name: "heading", label: "Story heading", wide: true },
      { name: "paragraphs", label: "Paragraphs", type: "textarea", rows: 8, help: "Leave a blank line between paragraphs. Do not include the client street address." },
      { name: "factsTitle", label: "How we composed it — heading", wide: true },
      { name: "factsText", label: "How we composed it — text", type: "textarea", rows: 4 },
      { name: "checks", label: "Highlights", type: "textarea", rows: 5, help: "One item per line." },
      { name: "resultTitle", label: "Closing heading", wide: true },
      { name: "resultText", label: "Closing text", type: "textarea", rows: 3 },
    ] },
    publishing,
  ],
};

const indiaServices = {
  key: "services", label: "Service", plural: "Services", icon: "layers", color: "#6F6252",
  titleField: "title", imageField: "image", categoryField: null,
  defaults: { strategyHeading: "Our Approach", processHeading: "Service Process", faqHeading: "Frequently Asked Questions", published: true },
  sections: [
    { title: "Basics", fields: [
      { name: "title", label: "Service title", required: true, wide: true },
      { name: "shortDescription", label: "Short description", type: "textarea", rows: 3, required: true, help: "Shown on the services list page." },
    ] },
    { title: "Images", cols: 2, fields: [
      { name: "image", label: "List page image", type: "image", required: true },
      { name: "imageB", label: "List hover / secondary image", type: "image", help: "Second image shown on hover in the services grid." },
      { name: "heroImage", label: "Detail page top image", type: "image" },
    ] },
    { title: "Detail page content", fields: [
      { name: "paragraphs", label: "Intro paragraphs", type: "textarea", rows: 6, help: "Leave a blank line between paragraphs." },
      { name: "strategyHeading", label: "Second heading" },
      { name: "strategyText", label: "Second text", type: "textarea", rows: 4 },
      { name: "features", label: "Feature cards", type: "textarea", rows: 4, help: "One per line:  Title | Description (shown next to the image)" },
      { name: "processHeading", label: "Installation heading", help: "Leave blank to use Our Four-Step Installation Process when there are four steps." },
      { name: "steps", label: "Process steps", type: "textarea", rows: 6, help: "One per line:  Title | Description. Four lines become a four-step heading." },
      { name: "faqHeading", label: "FAQ heading" },
      { name: "videoUrl", label: "YouTube video link", type: "url", placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "videoHeading", label: "Video heading", wide: true },
      { name: "videoText", label: "Video text", type: "textarea", rows: 3 },
      { name: "faqs", label: "FAQs", type: "textarea", rows: 8, help: "Easy format:\n1. Your question (can be 2–4 lines)\nAns - Your answer\n\nOr one line: Question | Answer" },
    ] },
    publishing,
  ],
};

const australiaServices = {
  key: "services", label: "Service", plural: "Services", icon: "layers", color: "#6F6252",
  titleField: "title", imageField: "image", categoryField: "category",
  defaults: { strategyHeading: "Our Approach", processHeading: "Design & Build Process", faqHeading: "Frequently Asked Questions", published: true },
  sections: [
    { title: "Basics", fields: [
      { name: "title", label: "Service title", required: true },
      { name: "category", label: "Category", type: "select", options: opts(["Architecture", "Interior Design", "Complete Home", "Builder", "Outdoor Living"]) },
      { name: "shortDescription", label: "Short description", type: "textarea", rows: 3, required: true, help: "Shown on the services list and homepage cards." },
      { name: "conceptHeadline", label: "Concept line", placeholder: "From sketch to furnishing, under one roof", wide: true },
    ] },
    { title: "Images", cols: 2, fields: [
      { name: "image", label: "List page image", type: "image", required: true },
      { name: "heroImage", label: "Detail page top image", type: "image" },
    ] },
    { title: "Detail page content", fields: [
      { name: "paragraphs", label: "Intro paragraphs", type: "textarea", rows: 6, help: "Leave a blank line between paragraphs." },
      { name: "strategyHeading", label: "Second heading" },
      { name: "strategyText", label: "Second text", type: "textarea", rows: 4 },
      { name: "features", label: "Feature cards", type: "textarea", rows: 4, help: "One per line:  Title | Description" },
      { name: "steps", label: "Process steps", type: "textarea", rows: 6, help: "One per line:  Title | Description — the design-and-build process." },
      { name: "videoUrl", label: "YouTube video link", type: "url", placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "videoHeading", label: "Video heading", wide: true },
      { name: "videoText", label: "Video text", type: "textarea", rows: 3 },
      { name: "faqs", label: "FAQs", type: "textarea", rows: 8, help: "Easy format:\n1. Your question (can be 2–4 lines)\nAns - Your answer\n\nOr one line: Question | Answer" },
    ] },
    publishing,
  ],
};

const indiaBlogs = {
  key: "blogs", label: "Blog post", plural: "Blog posts", icon: "doc", color: "#8A6E4B",
  titleField: "title", imageField: "image", categoryField: "category",
  defaults: { published: true },
  sections: [
    { title: "Basics", fields: [
      { name: "title", label: "Post title", required: true, wide: true },
      { name: "category", label: "Category", type: "select", required: true, options: opts(["Materials", "Design", "Care & Maintenance", "Installation Tips", "Residential", "Commercial"]) },
      { name: "tags", label: "Tags", placeholder: "Design, Materials", help: "Separate with commas." },
      { name: "author", label: "Author", placeholder: "admin" },
      { name: "date", label: "Publish date", type: "date" },
      { name: "excerpt", label: "Short excerpt", type: "textarea", rows: 3 },
    ] },
    { title: "Images", desc: "Only the thumbnail is required. The others fill the blog details page.", cols: 3, fields: [
      { name: "image", label: "List thumbnail", type: "image", required: true },
      { name: "heroImage", label: "Post top image", type: "image" },
      { name: "galleryA", label: "Gallery image 1", type: "image" },
      { name: "galleryB", label: "Gallery image 2", type: "image" },
      { name: "approachImage", label: "Side image (next to the list)", type: "image" },
    ] },
    { title: "Post content", fields: [
      { name: "introHeading", label: "First heading", wide: true },
      { name: "introText", label: "First text", type: "textarea", rows: 5 },
      { name: "secondHeading", label: "Second heading", wide: true },
      { name: "secondText", label: "Second text", type: "textarea", rows: 5 },
      { name: "approachHeading", label: "List heading", wide: true },
      { name: "approachItems", label: "List items", type: "textarea", rows: 5, help: "One item per line." },
    ] },
    publishing,
  ],
};

const australiaBlogs = {
  ...indiaBlogs,
  sections: indiaBlogs.sections.map((section) => (
    section.title !== "Basics" ? section : {
      ...section,
      fields: section.fields.map((field) => (
        field.name !== "category" ? field : {
          ...field,
          options: opts(["Architecture", "Interior Design", "Process", "Materials", "Design", "Western Australia"]),
        }
      )),
    }
  )),
};

export function getResources(site = getSite()) {
  const aus = site === "australia";
  return {
    projects: aus ? australiaProjects : indiaProjects,
    services: aus ? australiaServices : indiaServices,
    blogs: aus ? australiaBlogs : indiaBlogs,
  };
}

export const RESOURCES = getResources();
export const RESOURCE_KEYS = ["projects", "services", "blogs"];
