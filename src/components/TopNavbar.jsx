// src/components/TopNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/TopNavbar.css";

const TopNavbar = () => {
  return (
    <nav className="top-navbar">
      <ul className="nav-links">
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/volunteer-dashboard">Volunteer Section</Link></li>
      </ul>
    </nav>
  );
};

export default TopNavbar;
