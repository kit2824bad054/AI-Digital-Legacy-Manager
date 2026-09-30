/**
 * ============================================================
 * AI DIGITAL LEGACY MANAGER - ROOT APP COMPONENT (App.jsx)
 * ============================================================
 * Features:
 * - Wrapped with AuthProvider to share JWT session across application
 * - Public routes: Home ("/"), Login ("/login"), Signup ("/signup"), Deployment ("/deployment")
 * - Protected routes: Dashboard ("/dashboard"), Secret Vault ("/vault"), AI Snapshot ("/ai-snapshot")
 * - ProtectedRoute redirects unauthenticated visitors to "/login"
 * - Persistent Navbar (with live Login/Logout state) & Footer
 * - Pure CSS animations and zero Framer Motion dependencies
 * ============================================================
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Authentication Provider & Guards
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPage from './pages/DashboardPage';
import MemoryVaultPage from './pages/MemoryVaultPage';
import PersonalitySnapshotPage from './pages/PersonalitySnapshotPage';
import DeploymentPage from './pages/DeploymentPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-[#e2e8f0] relative selection:bg-[#a855f7] selection:text-white">
          {/* Navigation Bar with dynamic auth status */}
          <Navbar />

          {/* Main Routing Container */}
          <main className="flex-1">
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/deployment" element={<DeploymentPage />} />
              
              {/* Redirect legacy /auth route to /login */}
              <Route path="/auth" element={<Navigate to="/login" replace />} />

              {/* ================= PROTECTED ROUTES ================= */}
              {/* Requires valid JWT in localStorage. Redirects to /login if missing. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/vault" element={<MemoryVaultPage />} />
                <Route path="/ai-snapshot" element={<PersonalitySnapshotPage />} />
              </Route>

              {/* Fallback Catch-All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
