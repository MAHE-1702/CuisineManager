import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure this is imported
import CuisinesPage from "./Pages/CuisinesPage";
import CategoryPage from "./Pages/CategoriesPages";
import SubCategoryPage from "./Pages/SubcategoriesPages";
import "./App.css";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <h4>CUISINE MANAGER</h4>
          </NavLink>
          {/* Toggler Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Collapsible Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/cuisines"
                  activeClassName="selected"
                >
                  Cuisines
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/categories"
                  activeClassName="selected"
                >
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/subcategories"
                  activeClassName="selected"
                >
                  Subcategories
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<CuisinesPage />} />
        <Route path="/cuisines" element={<CuisinesPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/subcategories" element={<SubCategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
