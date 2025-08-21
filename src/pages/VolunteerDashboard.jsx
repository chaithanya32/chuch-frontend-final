import React, { useState, useEffect } from "react";
import "../styles/VolunteerDashboard.css";
import VolunteerNavbar from "../components/VolunteerNavbar";
import TopNavbar from "../components/TopNavbar";
import {
  getBatchWiseAttendance,
  generateInCode,
  generateOutCode,
  runDailyEmailTasks,
} from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const batches = ["PUC 1", "PUC 2", "ENG 1", "ENG 2", "ENG 3", "ENG 4"];

// Map frontend batch keys to backend batch names
const batchMap = {
  "PUC 1": "PUC 1",
  "PUC 2": "PUC 2",
  "ENG 1": "E1",
  "ENG 2": "E2",
  "ENG 3": "E3",
  "ENG 4": "E4", // matches backend
};


const VolunteerDashboard = () => {
  const [inCode, setInCode] = useState("");
  const [outCode, setOutCode] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  // Email tasks state
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [isEmailTaskTime, setIsEmailTaskTime] = useState(false);

  // Attendance polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBatchWiseAttendance();
        setAttendanceData(data);
      } catch (err) {
        console.error("Failed to fetch batch-wise attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Check IST time for email button
  useEffect(() => {
    const checkTime = () => {
      const istNow = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const day = istNow.getDay(); // 0 = Sunday
      const hours = istNow.getHours();
      const minutes = istNow.getMinutes();

      // ✅ Only allow on Sunday between 17:00–17:59 IST
      if (day === 0 && hours === 17 && minutes >= 0 && minutes < 60) {
        setIsEmailTaskTime(true);
      } else {
        setIsEmailTaskTime(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // check every 1 min
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleGenerateInCode = async () => {
    try {
      const res = await generateInCode();
      setInCode(res.code);
      toast.success(`IN Code: ${res.code}`, { autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate IN code");
    }
  };

  const handleGenerateOutCode = async () => {
    try {
      const res = await generateOutCode();
      setOutCode(res.code);
      toast.success(`OUT Code: ${res.code}`, { autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate OUT code");
    }
  };

  const handleRunEmailTasks = async () => {
    setLoadingEmails(true);
    try {
      const response = await runDailyEmailTasks();
      setEmailStatus(response.message || "Email tasks executed successfully");
      toast.success("Email tasks executed successfully!");
    } catch (error) {
      console.error("Error running email tasks:", error);
      toast.error("Failed to run email tasks");
    } finally {
      setLoadingEmails(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="volunteer-dashboard">
      <TopNavbar />
      <VolunteerNavbar />

      <h2>Volunteer Panel</h2>

      {/* IN/OUT Code Section */}
      <div className="code-buttons">
        <button className="generate-btn" onClick={handleGenerateInCode}>
          Generate IN Code
        </button>
        {inCode && <span className="code-display">{inCode}</span>}

        <button className="generate-btn" onClick={handleGenerateOutCode}>
          Generate OUT Code
        </button>
        {outCode && <span className="code-display">{outCode}</span>}
      </div>

      {/* Attendance Tables */}
      <div className="batch-tables">
        {batches.map((batch) => {
          const backendBatchName = batchMap[batch];
          const users = attendanceData[backendBatchName] || [];

          return (
            <div className="batch-table" key={batch}>
              <h3>{batch}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>ID Number</th>
                    <th>Name</th>
                    <th>In Time</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4">No users currently checked-in.</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.id_number}</td>
                        <td>{user.name}</td>
                        <td>{user.in_time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Email Tasks Section */}
      <div className="email-tasks-card">
        <h3>Email Tasks</h3>
        <p className="email-status">
          {emailStatus ? emailStatus : "No email tasks executed yet."}
        </p>

        {isEmailTaskTime ? (
          <button
            className="btn-run-tasks"
            onClick={handleRunEmailTasks}
            disabled={loadingEmails}
          >
            {loadingEmails ? "Running..." : "Run Daily Email Tasks"}
          </button>
        ) : (
          <p className="email-hint">
            Button will be available at 5:00 PM IST on Sundays.
          </p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default VolunteerDashboard;
