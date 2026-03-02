import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import RoleSelectPage from './pages/auth/RoleSelectPage';
import UserRegisterPage from './pages/auth/UserRegisterPage';
import TailorRegisterPage from './pages/auth/TailorRegisterPage';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/user/HomePage';
import MyOrdersPage from './pages/user/MyOrdersPage';
import TailorDashboard from './pages/tailor/TailorDashboard';
import TailorDesignsPage from './pages/tailor/TailorDesignsPage';
import TailorOrdersPage from './pages/tailor/TailorOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="spinner spinner-dark" style={{ width: '2.5rem', height: '2.5rem' }} />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'tailor') return <Navigate to="/tailor/dashboard" replace />;
    return <Navigate to="/home" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicRoute><RoleSelectPage /></PublicRoute>} />
        <Route path="/register/user" element={<PublicRoute><UserRegisterPage /></PublicRoute>} />
        <Route path="/register/tailor" element={<PublicRoute><TailorRegisterPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* User */}
        <Route path="/home" element={<ProtectedRoute roles={['user']}><HomePage /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute roles={['user']}><MyOrdersPage /></ProtectedRoute>} />

        {/* Tailor */}
        <Route path="/tailor/dashboard" element={<ProtectedRoute roles={['tailor']}><TailorDashboard /></ProtectedRoute>} />
        <Route path="/tailor/designs" element={<ProtectedRoute roles={['tailor']}><TailorDesignsPage /></ProtectedRoute>} />
        <Route path="/tailor/orders" element={<ProtectedRoute roles={['tailor']}><TailorOrdersPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
