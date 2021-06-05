import { useState } from "react";

const Pagination = ({ Card, data, limit, title }) => {
  const [activePage, setActivePage] = useState(1);
  const [pages] = useState(Math.ceil(data.length / limit));
  const getPaginatedData = () => {
    const startIndex = activePage * limit - limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  };
  function goToNextPage() {
    setActivePage((page) => page + 1);
  }

  function goToPreviousPage() {
    setActivePage((page) => page - 1);
  }

  return (
    <div>
      {title === "listFilms" ? (
        <div className="mycards">
          <Card home={getPaginatedData} />
        </div>
      ) : (
        <div className="mycards">
          <Card myfilms={getPaginatedData} />
        </div>
      )}

      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          className={`prev ${activePage === 1 ? "disabled" : ""}`}
        >
          <span
            aria-hidden="true"
            className={`carousel-control-prev-icon prev-btn ${
              activePage === pages ? "disabled" : ""
            }`}
          ></span>
        </button>

        <button
          onClick={goToNextPage}
          className={`next ${activePage === pages ? "disabled" : ""}`}
        >
          <span
            aria-hidden="true"
            className={`carousel-control-next-icon next-btn ${
              activePage === pages ? "disabled" : ""
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
