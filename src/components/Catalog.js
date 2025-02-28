import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Catalog.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Catalog() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleBeers, setVisibleBeers] = useState(9);
  const [showWarning, setShowWarning] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [maxAlcoholFilter, setMaxAlcoholFilter] = useState(0);

  const placeholderImage =
    "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg";

  useEffect(() => {
    axios
      .get("https://api.sampleapis.com/beers/ale")
      .then((response) => {
        const beersData = response.data;
        setBeers(beersData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  const filteredBeers = beers.filter(beer => {
    const matchesSearch = beer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const alcStr = beer.alcohol || '0%';
    const alc = parseFloat(alcStr.replace('%', '')) || 0;
    const matchesAlcohol = alc <= maxAlcoholFilter;
    return matchesSearch && matchesAlcohol;
  });

  let sortedBeers = [...filteredBeers];
  if (sortBy === "price_asc") {
    sortedBeers.sort((a, b) => {
      const priceA = parseFloat((a.price || '$0').replace('$', '')) || 0;
      const priceB = parseFloat((b.price || '$0').replace('$', '')) || 0;
      return priceA - priceB;
    });
  } else if (sortBy === "price_desc") {
    sortedBeers.sort((a, b) => {
      const priceA = parseFloat((a.price || '$0').replace('$', '')) || 0;
      const priceB = parseFloat((b.price || '$0').replace('$', '')) || 0;
      return priceB - priceA;
    });
  } else if (sortBy === "rating_desc") {
    sortedBeers.sort((a, b) => b.rating?.average - a.rating?.average);
  } 

  const beersToShow = sortedBeers.slice(0, visibleBeers);

  const handleShowMore = () => {
    setVisibleBeers((prev) => prev + 9);
  };

  return (
    <div>
      {showWarning && (
        <div className="age-verification-modal">
          <div className="modal-content" >
            <div className="modal-header">
              <h2>AGE VERIFICATION REQUIRED</h2>
            </div>
            <div className="modal-body">
              <p>
                🚨 This website contains alcohol-related content. 
                You must be at least 21 years old to enter.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="enter-button"
                onClick={() => setShowWarning(false)}
              >
                ENTER SITE
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fs-3 fw-bold" href="#">
            🍺 Beer Catalog
          </a>
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search beers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-4">
        <div className="row">
          {beersToShow.map((beer) => (
            <div key={beer.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow beer-card">
                <div className="image-wrapper">
                  <img
                    src={beer.image || placeholderImage}
                    className="card-img-top beer-image"
                    alt={beer.name}
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{beer.name}</h5>
                  <p className="card-text">
                    <strong>Price:</strong> {beer.price}<br />
                    <strong>Rating:</strong> {beer.rating?.average} ({beer.rating?.reviews} reviews)<br />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleBeers < filteredBeers.length && (
          <div className="text-center mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleShowMore}>
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;

