import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';

function Navbar() {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logOut();
    window.location.href = '/';
  };

  return (
    <nav className="bg-slate-50/85 dark:bg-slate-900/85 backdrop-blur-xl docked full-width top-0 z-50 fixed w-full">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-full">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-black text-blue-900 dark:text-blue-50 tracking-tighter uppercase">Tactical Authority</Link>
          <div className="hidden md:flex gap-6">
            <Link to="/map" className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-200 font-public-sans text-sm font-bold tracking-tight">Map View</Link>
            <Link to="/report" className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-200 font-public-sans text-sm font-bold tracking-tight">Report</Link>
            <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-200 font-public-sans text-sm font-bold tracking-tight">Admin</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-[1px] bg-outline-variant/30 mx-2"></div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.photoURL && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                  </div>
                )}
                <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
