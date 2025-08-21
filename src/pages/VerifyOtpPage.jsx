// src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('reset_email');

  useEffect(() => {
    if (!email) navigate('/forgot-password');
  }, [email, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/verify-otp', { email, otp });
      // store OTP for the next step
      localStorage.setItem('reset_otp', otp);
      navigate('/reset-password');
    } catch (err) {
      alert(err.response?.data?.detail || 'Invalid or expired OTP');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          required
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
