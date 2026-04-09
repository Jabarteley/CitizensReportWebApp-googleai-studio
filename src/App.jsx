import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import CrisisMap from './components/CrisisMap';
import AdminDashboard from './components/AdminDashboard';
import AnonymousReport from './components/AnonymousReport';

function Layout({ children }) {
  const location = useLocation();
  const noNavbar = ['/', '/report', '/login'].includes(location.pathname);
  return (
    <div className="min-h-screen">
      {!noNavbar && <Navbar />}
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/report" element={<AnonymousReport />} />
        <Route path="/map" element={<CrisisMap />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
