import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomeAfterLogin.css";
import TopNavbar from "../components/TopNavbar";

const HomeAfterLogin = () => {
  return (
    <>
      <TopNavbar />
      <div className="home-loggedin-container">
        <section className="welcome-section">
          <h1>Welcome Back!</h1>
          <p>We're glad to see you again. Use the options below to manage your church attendance easily.</p>

          <div className="action-buttons">
            <Link to="/going-to-church" className="action-btn">
              I'm Going to Church
            </Link>
            <Link to="/attendance-logs" className="action-btn outline">
              View Attendance Logs
            </Link>
          </div>
        </section>

        <section className="quote-section">
          <blockquote>
            “For where two or three gather in my name, there am I with them.” — Matthew 18:20
          </blockquote>
        </section>
      </div>
    </>
  );
};

export default HomeAfterLogin;
