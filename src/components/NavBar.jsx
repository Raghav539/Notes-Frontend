import React from "react";
import { FaSquarePlus } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ searchText, handelSearchText, logoutUser, user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/login"); // redirect after logout
  };
  return (
    <nav className="navbar bg-body-tertiary py-50" style={{ padding: "20px" }}>
      <div className="container d-flex justify-content-around">
        <Link className="navbar-brand" to="/">
          <h4 style={{ fontWeight: "bold" }}>Notey</h4>
        </Link>
        <div className="d-flex">
          <div
            className="input-group input-group-sm"
            style={{ width: "500px", height: "40px" }}
          >
            <input
              className="form-control"
              placeholder="Search"
              value={searchText}
              onChange={(e) => handelSearchText(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </div>
        </div>
        <div className="d-flex gap-3 aligin-item-center">
          <Link to="/add-note" style={{ textDecoration: "none" }}>
            <button className="btn btn-outline-primary btn-md" type="button">
              <FaSquarePlus className="me-2 fs-6" /> Add Notes
            </button>
          </Link>
          <button
            className="btn btn-outline-primary btn-md"
            type="button"
             onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2 fs-6" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
