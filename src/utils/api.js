import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- AUTH ----------------

// ✅ Login using OAuth2 form data
export const loginUser = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await API.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (err) {
    console.error("Login error:", err.response?.data?.detail || err.message);
    throw err;
  }
};

// ✅ Fetch logged-in user info
export const fetchCurrentUser = async () => {
  const res = await API.get("/auth/me");  // adjust endpoint if needed
  return res.data;
};

// ---------------- ATTENDANCE ----------------

// ✅ Mark attendance (IN)
export const markAttendance = async (code) => {
  const res = await API.post("/attendance/going-to-church", { code });
  return res.data;
};

// ✅ Mark exit (OUT)
export const markExit = async (code) => {
  const res = await API.post("/attendance/going-out-of-church", { code });
  return res.data;
};

// ✅ Fetch user's logs
export const fetchAttendanceLogs = async () => {
  const res = await API.get("/attendance/my-logs");
  return res.data;
};

// ---------------- PASSWORD RESET ----------------

// Step 1: Request OTP
export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

// Step 2: Verify OTP
export const verifyOtp = async (email, otp) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  return res.data;
};

// Step 3: Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  const res = await API.post("/auth/reset-password", {
    email,
    otp,
    new_password: newPassword,
  });
  return res.data;
};

export default API;

export const checkVolunteer = async () => {
  const res = await API.get("/volunteers/me");
  return res.data;
};


export const generateAttendanceCode = async (type) => {
  const res = await API.post("/volunteers/generate-code", { code_type: type });
  return res.data; // { code: "123456" }
};


// ---------------- VOLUNTEER DASHBOARD ----------------
export const getBatchWiseAttendance = async () => {
  const res = await API.get("/attendance_temp/batch-wise");
  return res.data;
};

export const generateInCode = async () => {
  const res = await API.post("/attendance_code_in/generate");
  return res.data;
};

export const generateOutCode = async () => {
  const res = await API.post("/attendance_code_out/generate");
  return res.data;
};

// Run daily email tasks
export const runDailyEmailTasks = async () => {
  const token = localStorage.getItem("token"); // adjust if you use sessionStorage

  const response = await fetch("http://127.0.0.1:8000/email-tasks/run-daily", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // ✅ add JWT
    },
  });

  if (!response.ok) {
    throw new Error("Failed to run email tasks");
  }

  return response.json();
};

/// ---------------- VOLUNTEERS ----------------

// Get all volunteers
export const getVolunteers = async () => {
  const res = await API.get("/volunteers/");   
  return res.data;
};

//Add Voluteer
export const addVolunteer = async (email) => {
  const res = await API.post("/volunteers/", { user_email: email });
  return res.data;
};



// Delete volunteer by email
export const deleteVolunteerByEmail = async (email) => {
  const res = await API.delete(`/volunteers/?email=${email}`);
  return res.data;
};


// ---------------- ADMIN ----------------
export const checkAdmin = async () => {
  const res = await API.get("/admins/me"); // ✅ make sure this endpoint exists in backend
  return res.data;
};
