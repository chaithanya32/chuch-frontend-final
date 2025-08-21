import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerRoute from "./components/VolunteerRoute";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            <PrivateRoute>
              <VolunteerRoute>
                <VolunteerDashboard />
              </VolunteerRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
