import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstallPWA from './InstallPWA';
import './Navbar.css';

function Navbar({ setAuth }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">⚾ Baseball PWA</Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link to="/tasks" onClick={closeMenu}>Tasks</Link>
        <Link to="/game" onClick={closeMenu}>⚾ Play Game</Link>
        <Link to="/profile" onClick={closeMenu}>Profile</Link>
        <InstallPWA />
        <button onClick={() => { handleLogout(); closeMenu(); }} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
