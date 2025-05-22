import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import '../styles/Navbar.css'; // Import Navbar CSS

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and functions

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">ThriftStore</Link>
      <ul className="navbar-links">
        {isAuthenticated && (
          <>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
            <li><NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Products</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
          </>
        )}
      </ul>
      <div className="navbar-auth-section">
        {isAuthenticated ? (
          <>
            {user && <span className="navbar-user-info">Hi, {user.name}!</span>}
            <button onClick={logout} className="logout-button">Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? "login-link active" : "login-link"}>Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
