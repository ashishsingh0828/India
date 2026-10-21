import React from "react";
import "./Pagination.css";

function Arrow({ direction }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path d="M11 3L5 8L11 13" />
      ) : (
        <path d="M5 3L11 8L5 13" />
      )}
    </svg>
  );
}

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 9,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePage = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  return (
    <nav className="ie-pagination" aria-label="Page navigation">
      <button
        type="button"
        className="ie-page-btn"
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <Arrow direction="prev" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`ie-page-btn ${page === currentPage ? "is-active" : ""}`}
          onClick={() => handlePage(page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {String(page).padStart(2, "0")}
        </button>
      ))}

      <button
        type="button"
        className="ie-page-btn"
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <Arrow direction="next" />
      </button>
    </nav>
  );
}
