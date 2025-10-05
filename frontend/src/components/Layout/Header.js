import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🚚</span>
          <span className="logo-text">Shipment Tracker</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/shipments" 
            className={`nav-link ${isActiveRoute('/shipments') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            My Shipments
          </Link>
          <Link 
            to="/shipments/new" 
            className={`nav-link ${isActiveRoute('/shipments/new') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            New Shipment
          </Link>
        </nav>

        <div className="header-actions">
          <span className="user-welcome">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;