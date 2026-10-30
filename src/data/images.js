export const IMG = {
  logo: "/Images/logo.png",
  hero1: "/Images/Home/Videos/video.png",
  hero2: "/Images/Banner Slider images/2.png",
  hero3: "/Images/Banner Slider images/3.png",
  hero4: "/Images/Banner Slider images/4.png",
  hero5: "/Images/About/Banner/banner.png",
  hero6: "/Images/About/Main/about.png",
  aboutCrema: "/Images/Home/About/Selected Marble Slabs.png",
  aboutViola: "/Images/Home/About/Distinctive Quartzite.png",
  aboutStatuario: "/Images/Home/About/Textured Travertine.png",
  aboutThasos: "/Images/logo.png",
  galleryBianco: "/Images/Our gallery/Bianco Vogue Marble.png",
  galleryFossana: "/Images/Our gallery/Fossana Marble.png",
  galleryPaonazzo: "/Images/Our gallery/Paonazzo Marble.png",
  galleryPirgon: "/Images/Our gallery/Pirgon Marble.png",
  galleryThassos: "/Images/Our gallery/Thassos White Marble.png",
  galleryTortuga: "/Images/Our gallery/Tortuga Marble.png",

  // Curated Collections / Slider Images
  curatedBianco: "/Images/Home/Curated Collections/Bianco Vogue Marble 1.png",
  curatedFossana: "/Images/Home/Curated Collections/Fossana Marble.png",
  curatedPaonazzo: "/Images/Home/Curated Collections/Paonazzo Marble.png",
  curatedPirgon: "/Images/Home/Curated Collections/Pirgon Marble.png",
  curatedThassos: "/Images/Home/Curated Collections/Thassos White.png",
  curatedTortuga: "/Images/Home/Curated Collections/Tortuga Marble.png",

  // Applications / Home Videos Images
  appVideo1: "/Images/Home/Videos/01.png",
  appVideo2: "/Images/Home/Videos/02.png",
  appVideo3: "/Images/Home/Videos/03.png",
  appVideo4: "/Images/Home/Videos/04.png",

  serviceBianco: "/Images/Home/Services and sourcing/Feature Walls & Facades.png",
  serviceDover: "/Images/Home/Services and sourcing/Processing Coordination.png",
  serviceOmini: "/Images/Home/Services and sourcing/Stone Selection.png",
  serviceTempest: "/Images/Home/Services and sourcing/Supply Coordination.png",
  feedback1: "/Images/Client feedback/Client feedback-1.png",
  feedback2: "/Images/Client feedback/Client feedback-2.png",
  video: "/Images/Video section Images/Video section Images.png",
};

export const ONLINE = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1615874959471-b67b1c1c857c?auto=format&fit=crop&w=1600&q=80",
];

const LOCAL = [
  IMG.hero1, IMG.hero2, IMG.hero3, IMG.hero4,
  IMG.aboutCrema, IMG.aboutViola, IMG.aboutStatuario, IMG.aboutThasos,
  IMG.galleryBianco, IMG.galleryFossana, IMG.galleryPaonazzo, IMG.galleryPirgon,
  IMG.galleryThassos, IMG.galleryTortuga,
  IMG.serviceBianco, IMG.serviceDover, IMG.serviceOmini, IMG.serviceTempest,
  IMG.feedback1, IMG.feedback2, IMG.video,
];

const POOL = [...LOCAL, ...ONLINE];

/** Always returns a real image path. Empty/missing values get a local or online fallback. */
export function pic(src, i = 0) {
  const value = src && String(src).trim();
  if (value && value !== "undefined" && value !== "null") return value;
  return POOL[Math.abs(Number(i) || 0) % POOL.length];
}
