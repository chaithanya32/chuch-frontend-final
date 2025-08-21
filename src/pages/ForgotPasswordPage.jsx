// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot-password', { email });
      localStorage.setItem('reset_email', email);
      navigate('/verify-otp');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to send OTP');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
