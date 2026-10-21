import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { PageError } from "./components/Status";
import Home from "./pages/Home/Home";
import Abouts from "./pages/Abouts/Abouts";
import Services from "./pages/Services/Services";
import ServiceDetail from "./pages/Services/ServiceDetail";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Blogs from "./pages/Blogs/Blogs";
import BlogDetail from "./pages/Blogs/BlogDetail";
import Contact from "./pages/Contact/Contact";

function Page() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className="page-fade" key={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Abouts />} />
        <Route path="/abouts" element={<Abouts />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />

        {/* old template URL aliases */}
        <Route path="/project" element={<Navigate to="/projects" replace />} />
        <Route path="/blog" element={<Navigate to="/blogs" replace />} />

        <Route path="*" element={<PageError error={{ status: 404 }} />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Page />
      <Footer />
    </BrowserRouter>
  );
}
