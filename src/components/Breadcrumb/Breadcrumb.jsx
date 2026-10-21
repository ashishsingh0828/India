import { Link } from "react-router-dom";
import { BANNER_IMAGE } from "../../config";
import "./Breadcrumb.css";

export default function PageBanner({
  title = "Contact",
  breadcrumbs = [
    { label: "Home", path: "/" },
    { label: title, path: null },
  ],
  bgImage = BANNER_IMAGE,
}) {
  return (
    <div className="page-banner-wrapper">
      <section className="page-banner-section">
        <div className="page-banner-bg" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="page-banner-overlay" />
        <div className="page-banner-container">
          <h1 className="page-banner-title" key={title}>{title}</h1>
          <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
            <ol className="breadcrumbs-list">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="breadcrumb-item">
                    {!isLast && crumb.path ? (
                      <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
                    ) : (
                      <span className="breadcrumb-current">{crumb.label}</span>
                    )}
                    {!isLast && <span className="breadcrumb-separator">&rarr;</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>
    </div>
  );
}
