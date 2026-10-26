import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, MessageSquare, AlertCircle, Calendar, HeartHandshake } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏡 LocalConnect
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <Home size={18} /> Overview
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <MessageSquare size={18} /> Feed
          </NavLink>
          <NavLink to="/issues" className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <AlertCircle size={18} /> Issues
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <Calendar size={18} /> Events
          </NavLink>
          <NavLink to="/recommendations" className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <HeartHandshake size={18} /> Recommendations
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
