import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set the base URL for all API calls - USE PORT 5002
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5002';
    console.log('✅ API base URL set to:', axios.defaults.baseURL);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError('');
      console.log('🔐 Attempting login to:', axios.defaults.baseURL);
      
      const response = await axios.post('/api/auth/login', { 
        username, 
        password 
      });
      
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ Login successful');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (username, password) => {
    try {
      setError('');
      console.log('📝 Attempting registration to:', axios.defaults.baseURL);
      
      const response = await axios.post('/api/auth/register', { 
        username, 
        password 
      });
      
      const { token, data } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ Registration successful');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    error,
    setError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};