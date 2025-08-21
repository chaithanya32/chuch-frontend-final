import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { fetchCurrentUser, fetchAttendanceLogs, markAttendance, markExit, checkVolunteer } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [attendanceCode, setAttendanceCode] = useState("");
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("IN"); // IN or OUT
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);

        const logsData = await fetchAttendanceLogs();
        setLogs(logsData);

        try {
          await checkVolunteer();
          setIsVolunteer(true);
        } catch {
          setIsVolunteer(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAttendClick = async () => {
    if (isSubmitting) {
      toast.warning("Your attendance is already being submitted. Please wait.");
      return;
    }

    if (attendanceCode.length !== 6) {
      toast.warning("Please enter a valid 6-digit code provided by the volunteer.");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (mode === "IN") {
        response = await markAttendance(attendanceCode);
      } else {
        response = await markExit(attendanceCode);
      }

      toast.success(response.message || `${mode} attendance recorded successfully.`);
      setAttendanceCode("");

      const updatedLogs = await fetchAttendanceLogs();
      setLogs(updatedLogs);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || `Failed to mark ${mode} attendance.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name || "User"} 🙏</h2>

      <div className="code-input-container">
        <label htmlFor="attendanceCode">Enter 6-Digit Code Provided by Volunteer:</label>
        <input
          type="text"
          id="attendanceCode"
          maxLength={6}
          value={attendanceCode}
          onChange={(e) => setAttendanceCode(e.target.value)}
          placeholder="e.g. 123456"
          className="code-input"
        />

        <div className="toggle-container">
          <button className={`toggle-btn ${mode === "IN" ? "active" : ""}`} onClick={() => setMode("IN")}>
            IN
          </button>
          <button className={`toggle-btn ${mode === "OUT" ? "active" : ""}`} onClick={() => setMode("OUT")}>
            OUT
          </button>
        </div>

        <button className="attend-btn" onClick={handleAttendClick} disabled={isSubmitting}>
          {isSubmitting ? "Submitting... ⏳" : "Submit Attendance"}
        </button>
      </div>

      <div className="table-container">
        <h3>Your Attendance Logs</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="2">No attendance logs yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                  <td>{log.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isVolunteer && (
        <div className="volunteer-section">
          <button className="volunteer-btn" onClick={() => navigate("/volunteer-dashboard")}>
            Go to Volunteer Dashboard
          </button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Dashboard;
