// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Church Entry App</h1>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
