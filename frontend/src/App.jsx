/**
 * ============================================================
 * AI DIGITAL LEGACY MANAGER - ROOT APP COMPONENT (App.jsx)
 * ============================================================
 * Sets up client-side routing with React Router DOM (v6):
 * - Route 1: "/"             -> Home Page (Live Backend Ping & Pillars)
 * - Route 2: "/auth"         -> Login & Signup Page
 * - Route 3: "/dashboard"    -> Dashboard + Digital Will + Future Letters
 * - Route 4: "/vault"        -> Memory Capsule + Secret Vault
 * - Route 5: "/ai-snapshot"  -> AI Personality Snapshot (Gemini 2.5 Flash)
 * - Route 6: "/deployment"   -> Production Deployment Guide & Checklist
 *
 * Rules:
 * - NO Framer Motion used anywhere; styled with pure Tailwind CSS & CSS animations.
 * - Global layout includes persistent Navbar and Footer with dark & mysterious aesthetic.
 * ============================================================
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MemoryVaultPage from './pages/MemoryVaultPage';
import PersonalitySnapshotPage from './pages/PersonalitySnapshotPage';
import DeploymentPage from './pages/DeploymentPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-[#e2e8f0] relative selection:bg-[#a855f7] selection:text-white">
        {/* Navigation Header */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            {/* Page 1: Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Page 2: Login & Signup */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Page 3: Dashboard + Digital Will + Future Letters */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Page 4: Memory Capsule + Secret Vault */}
            <Route path="/vault" element={<MemoryVaultPage />} />

            {/* Page 5: AI Personality Snapshot */}
            <Route path="/ai-snapshot" element={<PersonalitySnapshotPage />} />

            {/* Page 6: Deployment */}
            <Route path="/deployment" element={<DeploymentPage />} />

            {/* Fallback: redirect undefined routes back to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
