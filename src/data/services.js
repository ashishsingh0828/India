import { IMG } from "./images";

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

export const FALLBACK_STEPS = [
  { title: "Slab selection & dry-lay", text: "You choose the actual slabs in Kishangarh. We dry-lay the full surface so vein flow and book-matching are approved before a single cut." },
  { title: "Measure, template & cut", text: "Site measurements and digital templates go back to the yard. Slabs are calibrated, cut and edged to the approved layout." },
  { title: "Vein-matched installation", text: "Fitters set the stone on a levelled base with colour-matched joints so floors, walls or tops read as one continuous surface." },
  { title: "Polish, seal & handover", text: "The finished surface is polished, sealed with a penetrating fluoropolymer, and handed over with a simple care note." },
];

export const FALLBACK_FAQS = [
  { q: "Can I approve the slabs before they are cut?", a: "Yes. Clients and architects review the dry-lay in our Kishangarh yard, or from high-resolution photographs, before fabrication starts." },
  { q: "How do you keep veins continuous across a large floor or wall?", a: "Sequential slabs from the same block are dry-laid and book-matched. Cuts follow the approved layout so the vein continues across joints." },
  { q: "How is marble protected after installation?", a: "Every installed surface receives a breathable penetrating sealer that resists wine, oil and moisture without changing the natural colour or sheen." },
  { q: "Do you work on homes and commercial spaces?", a: "Yes. The same selection, dry-lay and installation process is used for residences, hotels, lobbies and offices." },
];

export function installationHeading(custom, count) {
  const n = Number(count) || 0;
  const generic = !custom || /^(service process|our approach)$/i.test(String(custom).trim());
  if (!generic) return custom;
  if (n <= 1) return "Our Installation Process";
  const word = ONES[n] || String(n);
  return `Our ${word}-Step Installation Process`;
}

export function normalizePairs(raw, keys = ["title", "text"]) {
  if (!raw) return [];
  const [k1, k2] = keys;
  if (Array.isArray(raw) && Array.isArray(raw[0])) {
    return raw
      .map(([a, b]) => ({ [k1]: a, [k2]: b }))
      .filter((row) => row[k1] && row[k2]);
  }
  if (Array.isArray(raw) && raw[0] && typeof raw[0] === "object") {
    return raw
      .map((row) => ({
        [k1]: row[k1] || row.q || row.question || row.heading || "",
        [k2]: row[k2] || row.a || row.answer || row.description || row.text || "",
      }))
      .filter((row) => row[k1] && row[k2]);
  }
  return String(raw)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|");
      return i < 0
        ? { [k1]: line, [k2]: "" }
        : { [k1]: line.slice(0, i).trim(), [k2]: line.slice(i + 1).trim() };
    })
    .filter((row) => row[k1] && row[k2]);
}

export const CONTACT_IMAGE = "/Images/Client feedback/photo-1600585154340-be6161a56a0c 1.png";
