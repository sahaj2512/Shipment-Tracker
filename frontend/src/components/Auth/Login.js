import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
    
    if (!formData.username && !formData.email) {
      setError('Please provide either username or email');
      return;
    }
    
    const result = await login(formData.username, formData.email, formData.password);
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
          <label htmlFor="username">Username or Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username or email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (Alternative)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
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
          <Link to="/register" className="toggle-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;