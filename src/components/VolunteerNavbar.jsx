import React from 'react';
import "../styles/VolunteerNavbar.css";

const VolunteerNavbar = ({ volunteerName, onLogout }) => {
  return (
    <nav className="volunteer-navbar">
      <div className="nav-left">Welcome, {volunteerName || "Volunteer"}</div>
      <div className="nav-right">
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default VolunteerNavbar;
