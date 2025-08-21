// src/pages/ResetPasswordPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('reset_email');
  const otp = localStorage.getItem('reset_otp');

  useEffect(() => {
    if (!email || !otp) navigate('/forgot-password');
  }, [email, otp, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    try {
      await API.post('/auth/reset-password', {
        email,
        otp,
        new_password: password,
      });
      alert('Password reset successful! Please login.');
      localStorage.removeItem('reset_email');
      localStorage.removeItem('reset_otp');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>
        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
