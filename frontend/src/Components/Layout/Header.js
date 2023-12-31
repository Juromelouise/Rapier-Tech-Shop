import React, { useEffect, useState } from "react";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../utils/helpers";
import Search from "./Search";
import { toast } from "react-toastify";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API}/api/v1/logout`);
      setUser("");
      logout(() => navigate("/"));
      toast.success("Logged out", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo on the left */}
        <Link to="/" style={{ textDecoration: "none", fontWeight: "400" }}>
          <div className="navbar-brand">
            <img id="LogoHeader" alt="Logo" src="../images/Logo.PNG" />
          </div>
        </Link>

        {/* Toggle button for small screens */}
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

        {/* Content aligned to the right */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="ms-auto d-flex align-items-center">
            <div className="Cartitem">
              <Link to="/cart">
                <i className="bi bi-cart"></i>
              </Link>
            </div>

            <Search />

            <div className="AangAvatar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  {user ? (
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropDownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <figure className="avatar avatar-nav">
                          <img
                            src={user.avatar && user.avatar.url}
                            alt={user && user.name}
                            className="rounded-circle"
                          />
                        </figure>
                        <span>{user && user.name}</span>
                      </button>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="dropDownMenuButton"
                      >
                        {user && user.role === "admin" && (
                          <Link className="dropdown-item" to="/admin/dashboard">
                            Dashboard
                          </Link>
                        )}
                        <Link
                          to="/order/me"
                          className="dropdown-item"
                        >
                          My Orders
                        </Link>
                        <Link className="dropdown-item" to="/me">
                          Profile
                        </Link>
                        <Link
                          className="dropdown-item text-danger"
                          to="/"
                          onClick={logoutUser}
                        >
                          Logout
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" className="btn ml-4" id="login_btn">
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
