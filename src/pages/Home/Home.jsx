import React from "react";
import Hero from "../../components/Home/Hero";
import OurGallery, { STONE_SLIDES, PROJECT_SLIDES } from "../../components/Values/OurGallery";
import VideoIntro from "../../components/Home/VideoIntro";
import Applications from "../../components/Enquiry/Applications";
import OurServices from "../../components/Home/OurServices";
import WhyChooseUs from "../../components/Values/WhyChooseUs";
import AboutUs from "../../components/Home/AboutUs";
import EnquiryStrip from "../../components/Enquiry/EnquiryStrip";
import EnquiryCta from "../../components/Enquiry/EnquiryCta";
import Faq from "../../components/FAQ/Faq";
import { IMG } from "../../data/images";

export default function Home() {
  return (
    <div className="home-page">
      <Hero />

      {/* 1. Curated Stone Collections (Raw Slabs) */}
      <OurGallery
        id="collections"
        variant="slab"
        items={STONE_SLIDES}
        bgImage={IMG.hero3}
        eyebrow="Curated Collections"
        heading={["Curated", "Stone", "Collections"]}
        lead="Marble, quartzite, travertine and limestone—photographed to let each stone's natural variation, texture and character speak for itself."
        cardBase="/projects"
        linkTo="/contact"
        linkLabel="Enquire About a Stone"
        regionLabel="Stone collections"
        prevLabel="Previous stone"
        nextLabel="Next stone"
      />

      {/* 2. Architectural Video Intro */}
      <VideoIntro image={IMG.hero1} videoUrl="https://www.youtube.com/watch?v=aqz-KE-bpKQ" />

      {/* 3. Applications in Architecture */}
      <Applications />

      {/* 4. Sourcing & Process */}
      <OurServices />

      {/* 5. Verified Projects / Material Studies (Real Installations) */}
      <OurGallery
        id="projects"
        variant="project"
        items={PROJECT_SLIDES}
        bgImage={IMG.hero2}
        eyebrow="Material Studies & Applications"
        heading={["Verified", "Stone", "Applications"]}
        lead="Documented project installations and bespoke stone coordination across refined residential and commercial spaces."
        cardBase="/projects"
        linkTo="/contact"
        linkLabel="Request Material Details"
        regionLabel="Verified projects"
        prevLabel="Previous project"
        nextLabel="Next project"
      />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. About Team & Philosophy */}
      <AboutUs
        images={{ top: IMG.aboutCrema, bottom: IMG.aboutViola, tall: IMG.aboutStatuario }}
        founder={{
          name: "IE Marble & Traders",
          role: "Stone, Curated · Sourcing & Specification",
          image: IMG.aboutThasos,
        }}
      />

      {/* 8. Regional & Global Procurement Reach */}
      <EnquiryStrip />

      {/* 9. High-Intent Action / BOQ Form */}
      <EnquiryCta />

      {/* 10. FAQ */}
      <Faq />
    </div>
  );
}