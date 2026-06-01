import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#6a8273' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center text-white fw-bold" to="/">
          <img
            src="/images/logo.png"
            alt="Trajkovski Dent"
            width="70"
            height="70"
            className="me-2"
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="fs-4">Trajkovski Dent</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {user.role === 'patient' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/patient-dashboard">Book Appointment</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/my-appointments">My Appointments</Link>
                    </li>
                  </>
                )}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/admin-dashboard">Admin Dashboard</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;