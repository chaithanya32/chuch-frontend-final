// src/pages/HomePage.jsx
import React from "react";
import TopNavbar from "../components/TopNavbar";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <div>
      <section className="home-hero">
        <div className="hero-text">
          <h1>Welcome to the Church Attendance System</h1>
          <p>
            Streamline attendance tracking for church members and volunteers. 
            Easily manage sessions, view reports, and foster active participation.
          </p>
          <div className="hero-buttons">
            <a href="/signup" className="btn primary">Get Started</a>
            <a href="/login" className="btn outline">Already have an account?</a>
          </div>
        </div>
        
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features">
          <div className="feature-card">
            <h3>📋 Easy Signup</h3>
            <p>Register quickly and start marking your attendance effortlessly.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Real-time Dashboard</h3>
            <p>Track and manage attendance statistics for each batch or group.</p>
          </div>
          <div className="feature-card">
            <h3>🤝 Volunteer Integration</h3>
            <p>Volunteers can generate codes and view batch-wise reports.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 Church Entry System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
