// src/components/VolunteerRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkVolunteer } from "../utils/api";

const VolunteerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isVolunteer, setIsVolunteer] = useState(false);

  useEffect(() => {
    const verifyVolunteer = async () => {
      try {
        await checkVolunteer();
        setIsVolunteer(true);
      } catch {
        setIsVolunteer(false);
      } finally {
        setLoading(false);
      }
    };
    verifyVolunteer();
  }, []);

  if (loading) return <p>Checking permissions...</p>;

  return isVolunteer ? children : <Navigate to="/dashboard" />;
};

export default VolunteerRoute;
