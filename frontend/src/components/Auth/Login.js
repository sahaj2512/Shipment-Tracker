import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const { login, error, setError } = useAuth();

  useEffect(() => {
    setError('');
  }, [setError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.username, formData.password);
    if (result.success) {
      // Redirect handled by router
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to Shipment Tracker</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        <p className="auth-toggle">
          Don't have an account?{' '}
          <span onClick={onToggleMode} className="toggle-link">
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;