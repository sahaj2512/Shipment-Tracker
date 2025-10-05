import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Manage your shipments efficiently</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/shipments/new" className="action-card primary">
          <div className="action-icon">+</div>
          <h3>Create New Shipment</h3>
          <p>Add a new shipment to track</p>
        </Link>

        <Link to="/shipments" className="action-card">
          <div className="action-icon">📦</div>
          <h3>View All Shipments</h3>
          <p>Manage existing shipments</p>
        </Link>

        <div className="action-card">
          <div className="action-icon">📊</div>
          <h3>Shipment Analytics</h3>
          <p>View shipping statistics (Coming Soon)</p>
        </div>
      </div>

      <div className="dashboard-quick-stats">
        <div className="stat-card">
          <h4>Total Shipments</h4>
          <div className="stat-number">8</div>
          <p>All time</p>
        </div>
        <div className="stat-card">
          <h4>In Transit</h4>
          <div className="stat-number">3</div>
          <p>Active shipments</p>
        </div>
        <div className="stat-card">
          <h4>Delivered</h4>
          <div className="stat-number">2</div>
          <p>This month</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;