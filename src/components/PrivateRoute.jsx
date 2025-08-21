import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // ✅ correct import

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // token expired → clear and redirect
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    // invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
