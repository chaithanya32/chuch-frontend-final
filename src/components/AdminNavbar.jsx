import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT token
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="admin-navbar">
      <div className="logo" onClick={() => navigate("/admin")}>
        Church Admin
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate("/admin")}>Dashboard</li>
        <li onClick={() => navigate("/admin/volunteers")}>Volunteers</li>
        <li onClick={() => navigate("/admin/attendance")}>Attendance</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
