// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import TopNavbar from '../components/TopNavbar';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    id_number: '',
    batch: '',
    branch: '',
    phone_number: '',
    gender: '',
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'batch') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        branch: (value === 'PUC1' || value === 'PUC2') ? '' : prev.branch
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isPUCBatch = formData.batch === 'PUC1' || formData.batch === 'PUC2';

  const handleSubmit = async e => {
  e.preventDefault();

  // Rename user_name to name for backend
  const payload = {
    ...formData,
    name: formData.user_name
  };
  delete payload.user_name; // remove old key

  try {
    const res = await API.post('/auth/register', payload);
    console.log(res.data); // debug
    alert('Registered successfully! Please verify your email before logging in.');
    navigate('/login');
  } catch (err) {
    console.error(err.response?.data || err); // full backend error
    alert(err.response?.data?.detail || 'Signup failed');
  }
  };


  return (
    <div className="signup-page">
    
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create an Account</h2>

          <input type="text" name="user_name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="text" name="id_number" placeholder="ID Number" onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />

          <label>Batch</label>
          <select name="batch" onChange={handleChange} required>
            <option value="">Select Batch</option>
            <option value="PUC1">PUC1</option>
            <option value="PUC2">PUC2</option>
            <option value="E1">Engineering 1st Year</option>
            <option value="E2">Engineering 2nd Year</option>
            <option value="E3">Engineering 3rd Year</option>
            <option value="E4">Engineering 4th Year</option>
          </select>

          <label>Branch</label>
          <select name="branch" onChange={handleChange} disabled={isPUCBatch} required={!isPUCBatch}>
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">Mechanical</option>
            <option value="CIVIL">Civil</option>
            <option value="CHEM">Chemical</option>
            <option value="MME">MME</option>
            <option value="EEE">EEE</option>
          </select>

          <label>Gender</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit">Sign Up</button>
          <p className="login-redirect">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
