/**
 * ============================================================
 * Protected Route Component (frontend/src/components/ProtectedRoute.jsx)
 * ============================================================
 * Safeguards private pages (Dashboard, Vault, AI Snapshot).
 *
 * Logic:
 * - If auth is still initializing from localStorage -> displays loading spinner
 * - If token exists -> renders child components (or <Outlet />)
 * - If no token -> redirects to /login and saves current URL to return after login
 * ============================================================
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Show glowing spinner while reading localStorage
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] p-[1px] animate-pulse">
          <div className="w-full h-full bg-[#13131f] rounded-[15px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#a855f7] animate-spin" />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 tracking-wider uppercase font-semibold">
          Verifying Vault Access...
        </p>
      </div>
    );
  }

  // 2. If user is NOT authenticated, redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Render protected children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
