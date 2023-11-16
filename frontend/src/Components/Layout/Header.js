import React from "react";
import "../../App.css";
import { Link, useNavigate } from 'react-router-dom'

import Search from './Search'
const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      <Link to="/" style={{ textDecoration: 'none' }} >
        <div className="navbar-brand">
          <img id="LogoHeader" alt="Logo" src="../images/Logo.PNG"></img>
          Rapier Tech Shop
        </div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <div className="nav-link nav-menu">
                <i className="bi bi-person-circle"></i>
                Profile
              </div>
            </li>
          </ul>

          <div className="Cartitem"><i class="bi bi-cart"></i></div>
          <Search/>
            {/* <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */}
          </div>
        </div>
    </nav>
  );
};

export default Header;
