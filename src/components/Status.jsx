import { Link } from "react-router-dom";
import "./Status.css";

export const PageLoader = () => (
  <div className="pstatus"><span className="pspin" /> Loading…</div>
);

export const PageError = ({ error, onRetry }) => (
  <div className="pstatus pstatus--col">
    <h3>{error?.status === 404 ? "Page not found" : "We couldn’t load this page"}</h3>
    <p>{error?.status === 404 ? "The page you are looking for doesn’t exist or has been removed." : "Please check your connection and try again."}</p>
    <div>
      {error?.status !== 404 && onRetry && <button onClick={onRetry}>Try again</button>}
      <Link to="/">Back to home</Link>
    </div>
  </div>
);

export const Empty = ({ title, text, link }) => (
  <div className="pstatus pstatus--col">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {link && <div><Link to={link.to}>{link.label}</Link></div>}
  </div>
);
