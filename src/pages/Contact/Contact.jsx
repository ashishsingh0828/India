import PageBanner from "../../components/Breadcrumb/Breadcrumb";
import Banner from "../../components/Banner/Banner";
import ContactForm from "../../components/ContactForm/ContactForm";

export default function Contact() {
  return (
    <>
      <PageBanner title="Contact Us" breadcrumbs={[{ label: "Home", path: "/" }, { label: "Contact" }]} />
      <ContactForm />
      <Banner buttonHref="#contact" buttonText="Send Us a Message" />
    </>
  );
}
