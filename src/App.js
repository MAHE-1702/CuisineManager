import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CuisinesPage from "./Pages/CuisinesPage";
import CategoryPage from "./Pages/CategoriesPages";
import SubCategoryPage from "./Pages/SubcategoriesPages";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav className="navigation navbar navbar-expand-lg navbar-light bg-light">
          <div className="containermenu container">
            <NavLink className="title navbar-brand" to="/">
              <h4 style={{fontWeight:"700"}}>CUISINE MANAGER</h4>
            </NavLink>
            <button
              className="toggleeffect navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#list"
              aria-controls="list"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="list collapse navbar-collapse" id="list">
              <ul className="navbar-nav ms-auto">
                <li className="items nav-item">
                  <NavLink
                    className="option nav-link"
                    to="/cuisines"
                    activeClassName="selected"
                  >
                    Cuisines
                  </NavLink>
                </li>
                <li className="items nav-item">
                  <NavLink
                    className="option nav-link"
                    to="/categories"
                    activeClassName="selected"
                  >
                    Categories
                  </NavLink>
                </li>
                <li className="items nav-item">
                  <NavLink
                    className="option nav-link"
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
      </div>
    </Router>
  );
}

export default App;
