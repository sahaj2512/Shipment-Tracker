import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ShipmentList from './components/Shipments/ShipmentList';
import ShipmentForm from './components/Shipments/ShipmentForm';
import Dashboard from './components/Dashboard/Dashboard';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !user ? children : <Navigate to="/" />;
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shipments" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ShipmentList />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shipments/new" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="page-container">
                        <h1>Create New Shipment</h1>
                        <ShipmentForm />
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/shipments/edit/:id" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="page-container">
                        <h1>Edit Shipment</h1>
                        <ShipmentForm />
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;