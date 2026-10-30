import React from "react";
import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import About from "../../components/About/About";
import OurValues from "../../components/Values/OurValues";
import OurGallery, { PROJECT_SLIDES } from "../../components/Values/OurGallery";
import WhyChooseUs from "../../components/Values/WhyChooseUs";
import OurBenefits from "../../components/Values/OurBenefits";
import EnquiryCta from "../../components/Enquiry/EnquiryCta";
import Faq from "../../components/FAQ/Faq";
import { IMG } from "../../data/images";
import ClientFeedback from "../../components/Values/ClientFeedback";

export default function Abouts() {
  return (
    <div className="abouts-page">
      {/* 1. Page Header */}
      <PageBanner
        title="About IE Marbles"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "About Us" }]}
        bgImage={IMG.hero5}
      />

      {/* 2. Core Narrative: Where Natural Stone Meets Architectural Intent */}
      <About />

      {/* 3. Team Philosophy & 4 Guiding Pillars: Understanding the Material */}
      <OurValues />

      {/* 4. Why Work With Us: A More Considered Approach to Natural Stone */}
      <WhyChooseUs />

      {/* 5. Verified Material Studies / Installed Projects */}
      <OurGallery
        id="about-gallery"
        variant="project"
        items={PROJECT_SLIDES}
        bgImage={IMG.hero5}
        eyebrow="Material Studies"
        heading={["Curated", "Stone", "in Architecture"]}
        lead="Authentic photography reflecting natural variation, surface finishes, and spatial applications."
        linkTo="/contact"
        linkLabel="Discuss a Project"
      />

      {/* 6. Processing Coordination & Capabilities */}
      <OurBenefits
        bgImage={IMG.hero6}
        videoUrl="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
      />

<ClientFeedback/>
      {/* 7. Conversion: Let's Discuss Your Project */}
      <EnquiryCta />

      {/* 8. Frequently Asked Questions */}
      <Faq />
    </div>
  );
}