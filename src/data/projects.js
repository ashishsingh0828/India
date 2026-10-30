import { IMG } from "./images";

export const FALLBACK_PROJECTS = [
  {
    slug: "statuario-grand-villa",
    title: "Statuario Grand Villa Living & Entryway",
    category: "Residential",
    client: "Private Luxury Residence",
    projectType: "Full Villa Marble Flooring & Bookmatched Entry",
    date: "October 2026",
    website: "iemarbles.com",
    imageA: IMG.galleryBianco,
    imageB: IMG.galleryFossana,
    heroImage: IMG.aboutThasos,
    heading: "Curated Statuario slabs with a bookmatched entry",
    paragraphs: "Premium Statuario from Carrara, selected and dry-laid in Kishangarh before a single cut.\n\nJoints are colour-matched and calibrated so the foyer, living hall and stair read as one surface.",
    factsTitle: "Stone specification",
    factsText: "20 mm calibrated slabs, polished and sealed for daily villa use.",
    checks: "Hairline colour-matched joints\nVein alignment across foyer and stairs\nFluoropolymer sealant\nClient dry-lay approval",
    extraHeading: "What the family asked for",
    extraParagraphs: "A bright, calm arrival that still feels grand. We kept the palette quiet and let the stone carry the room.",
  },
  {
    slug: "calacatta-gold-bath-suite",
    title: "Calacatta Gold Bookmatched Bath Suite",
    category: "Bathrooms",
    client: "Private Residence",
    projectType: "Bookmatched Bath & Vanity",
    date: "September 2026",
    website: "iemarbles.com",
    imageA: IMG.galleryPaonazzo,
    imageB: IMG.galleryPirgon,
    heroImage: IMG.aboutViola,
    heading: "A wet room drawn as one slab story",
    paragraphs: "Sequential Calacatta slabs set as a mirror across the vanity wall and shower.\n\nEdges are mitred so the stone turns the corner without a visual break.",
    factsTitle: "The bath suite",
    factsText: "Bookmatched cladding, a single vanity top, and a sealed wet-area floor.",
    checks: "Bookmatched feature wall\nMitred vanity edges\nWet-area sealant\nHidden linear waste",
    extraHeading: "A quieter luxury",
    extraParagraphs: "Gold veining is used once, on the wall that faces you as you enter. The floor stays calm so the room does not compete with itself.",
  },
  {
    slug: "emperador-dark-foyer",
    title: "Emperador Dark & Spanish Crema Foyer",
    category: "Flooring",
    client: "Hotel Arrival",
    projectType: "Foyer Flooring & Border",
    date: "August 2026",
    website: "iemarbles.com",
    imageA: IMG.galleryThassos,
    imageB: IMG.galleryTortuga,
    heroImage: IMG.aboutCrema,
    heading: "Warm stone underfoot for a first impression",
    paragraphs: "Emperador and Spanish Crema laid as a border-and-field floor for a hotel arrival.\n\nThe pattern is drawn on the dry-lay so the centre medallion sits on the walking line.",
    factsTitle: "Arrival floor",
    factsText: "Two stones, one field, a border that holds the room.",
    checks: "Field and border layout\nMedallion on axis\nHonored edges\nCommercial traffic seal",
    extraHeading: "Built for traffic",
    extraParagraphs: "A hotel foyer has to look composed at noon and at midnight. The darker field hides daily wear; the cream border keeps the room bright.",
  },
  {
    slug: "nero-marquina-waterfall",
    title: "Nero Marquina Monolithic Waterfall Island",
    category: "Kitchen & Countertops",
    client: "Private Kitchen",
    projectType: "Island & Splashback",
    date: "July 2026",
    website: "iemarbles.com",
    imageA: IMG.serviceBianco,
    imageB: IMG.serviceDover,
    heroImage: IMG.aboutStatuario,
    heading: "A single black stone island, waterfall on both ends",
    paragraphs: "Nero Marquina cut as one island top with waterfall returns.\n\nThe splashback uses the same block so the kitchen reads as one composition.",
    factsTitle: "The island",
    factsText: "Mitred waterfall ends, a hidden support frame, and a honed finish that hides fingerprints.",
    checks: "Waterfall returns\nSame-block splashback\nHoned finish\nConcealed steel frame",
    extraHeading: "Cooked in, not added on",
    extraParagraphs: "The island is the room. Seating, prep and the stone line up before the cabinets are set.",
  },
];

export function projectBySlug(slug) {
  return FALLBACK_PROJECTS.find((item) => item.slug === slug) || null;
}

export function withNeighbors(item, list = []) {
  const rows = Array.isArray(list) && list.length ? list : FALLBACK_PROJECTS;
  const index = rows.findIndex((row) => row.slug === item.slug);
  const at = index >= 0 ? index : 0;
  const count = rows.length;
  const brief = (row) => row && {
    title: row.title,
    slug: row.slug,
    imageA: row.imageA || row.image,
    imageB: row.imageB || row.imageA || row.image,
  };
  return {
    ...item,
    prev: item.prev || (count > 1 ? brief(rows[(at - 1 + count) % count]) : null),
    next: item.next || (count > 1 ? brief(rows[(at + 1) % count]) : null),
    related: item.related?.length
      ? item.related
      : rows.filter((row) => row.slug !== item.slug).slice(0, 2).map(brief),
  };
}
