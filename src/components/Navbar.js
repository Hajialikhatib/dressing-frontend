import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserName = () => {
    if (user?.user_profile?.full_name) return user.user_profile.full_name;
    if (user?.tailor_profile?.full_name) return user.tailor_profile.full_name;
    return user?.username || 'User';
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          ✂️ Dressing & Design
        </NavLink>

        <div className="navbar-nav">
          {user?.role === 'user' && (
            <>
              <NavLink to="/home" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                🏠 Home
              </NavLink>
              <NavLink to="/my-orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                📦 My Orders
              </NavLink>
            </>
          )}

          {user?.role === 'tailor' && (
            <>
              <NavLink to="/tailor/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/tailor/designs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                👗 My Designs
              </NavLink>
              <NavLink to="/tailor/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                📋 Orders
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              ⚙️ Admin Panel
            </NavLink>
          )}

          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            👤 {getUserName()}
            <span className="nav-badge" style={{ marginLeft: '0.5rem' }}>
              {user?.role}
            </span>
          </span>

          <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
