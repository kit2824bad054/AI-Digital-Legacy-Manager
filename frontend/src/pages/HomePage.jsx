/**
 * ============================================================
 * Home Page (HomePage.jsx)
 * ============================================================
 * Features:
 * - Stunning Dark & Mysterious visual design (#0a0a0f, #6b21a8, #7c3aed)
 * - Glassmorphism cards with purple glow effects
 * - Interactive LIVE Backend Connectivity Test widget to verify
 *   that Frontend and Express backend are communicating properly!
 * - Overview of the 4 core pillars of Digital Legacy Management
 * - Pure CSS animations only (NO Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Send, 
  Key, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  Database,
  Cpu,
  Lock,
  Layers
} from 'lucide-react';

const HomePage = () => {
  // Backend Connection Test State
  const [backendHealth, setBackendHealth] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState(null);
  const [echoResponse, setEchoResponse] = useState(null);

  // Function to ping backend /api/test/health
  const checkBackendHealth = async () => {
    setTestLoading(true);
    setTestError(null);
    const startTime = performance.now();

    try {
      // Uses Vite proxy (/api) or direct configured URL
      const res = await fetch('/api/test/health');
      if (!res.ok) {
        throw new Error(`Server responded with HTTP status ${res.status}`);
      }
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      setBackendHealth({ ...data, latency });
    } catch (err) {
      console.error('Backend connection test failed:', err);
      setTestError(err.message || 'Unable to connect to Express backend.');
      setBackendHealth(null);
    } finally {
      setTestLoading(false);
    }
  };

  // Test POST echo route to verify bidirectional data transfer
  const sendEchoTest = async () => {
    try {
      const res = await fetch('/api/test/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testMessage: 'Hello from Phase 1 Frontend! Connectivity test passed.',
          clientTimestamp: new Date().toLocaleTimeString(),
        }),
      });
      const data = await res.json();
      setEchoResponse(data);
    } catch (err) {
      console.error('Echo test error:', err);
    }
  };

  // Run health check on initial component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="relative min-h-screen animate-fade-in">
      {/* Ambient Cosmic Purple Glow Accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#6b21a8]/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#7c3aed]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Floating Pure CSS Purple Particle Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="particle-dot w-2 h-2 top-24 left-[10%]" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <span className="particle-dot w-1.5 h-1.5 top-64 left-[25%]" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <span className="particle-dot w-3 h-3 top-40 right-[15%]" style={{ animationDelay: '1s', animationDuration: '7s' }} />
        <span className="particle-dot w-2 h-2 top-96 right-[28%]" style={{ animationDelay: '3s', animationDuration: '9s' }} />
        <span className="particle-dot w-1.5 h-1.5 bottom-80 left-[18%]" style={{ animationDelay: '1.5s', animationDuration: '6.5s' }} />
        <span className="particle-dot w-2.5 h-2.5 bottom-40 right-[12%]" style={{ animationDelay: '2.5s', animationDuration: '8.5s' }} />
        <span className="particle-dot w-2 h-2 top-[55%] left-[8%]" style={{ animationDelay: '0.8s', animationDuration: '7.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
        
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glow-badge text-xs font-semibold text-purple-300 animate-floating">
            <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>AI Digital Legacy Guardian • Secure Vault & Personality Matrix Online</span>
          </div>

          {/* Main Title with Glowing Mysterious Typography */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your Digital Life, <br />
            <span className="text-gradient-purple">Eternally Protected.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Safeguard your final wishes, secret credentials, heartfelt letters, and AI personality
            snapshot. Encrypted with bank-grade security, revealed only when your legacy needs to be passed on.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl btn-primary flex items-center justify-center gap-2 text-sm font-semibold shadow-glow-md"
            >
              <span>Explore Dashboard & Will</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/vault"
              className="w-full sm:w-auto px-6 py-3 rounded-xl btn-secondary flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Key className="w-4 h-4 text-[#a855f7]" />
              <span>Enter Secret Vault</span>
            </Link>
          </div>
        </div>

        {/* ============================================================
            LIVE BACKEND CONNECTION DIAGNOSTIC CARD (Phase 1 Requirement)
            ============================================================ */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="glass-card rounded-2xl p-6 border border-[#232338] relative overflow-hidden">
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232338]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6b21a8]/20 border border-[#a855f7]/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#a855f7]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Backend & Database Bridge Status
                    {backendHealth?.success && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live communication verification between React (port 5173) and Express (port 5000)
                  </p>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={checkBackendHealth}
                disabled={testLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/50 text-slate-200 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testLoading ? 'animate-spin' : ''}`} />
                <span>{testLoading ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              
              {/* Express Server Indicator */}
              <div className="bg-[#0a0a0f]/60 rounded-xl p-3 border border-[#232338]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#a855f7]" /> Express Server
                  </span>
                  {backendHealth?.services?.expressServer === 'Operational' ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Online
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3 h-3" /> Checking
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {backendHealth ? `Port: ${backendHealth.serverPort} (${backendHealth.latency}ms)` : 'Waiting for ping...'}
                </div>
              </div>

              {/* MongoDB Atlas Indicator */}
              <div className="bg-[#0a0a0f]/60 rounded-xl p-3 border border-[#232338]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#a855f7]" /> MongoDB Atlas
                  </span>
                  {backendHealth?.services?.mongodbAtlas?.connected ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="text-purple-300 flex items-center gap-1 font-semibold text-[11px]">
                      Config Ready
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate" title={backendHealth?.services?.mongodbAtlas?.status}>
                  {backendHealth?.services?.mongodbAtlas?.status || 'Driver initialized'}
                </div>
              </div>

              {/* Gemini 2.5 Flash Indicator */}
              <div className="bg-[#0a0a0f]/60 rounded-xl p-3 border border-[#232338]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" /> Gemini AI Flash
                  </span>
                  <span className="text-purple-300 flex items-center gap-1 font-semibold text-[11px]">
                    Backend Only
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Structured JSON Mode
                </div>
              </div>
            </div>

            {/* Error or Success notification message */}
            {testError ? (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>
                    Backend offline or unreachable. Run <code className="bg-black/40 px-1 py-0.5 rounded">npm run dev</code> in the <code className="bg-black/40 px-1 py-0.5 rounded">backend/</code> folder.
                  </span>
                </div>
              </div>
            ) : backendHealth && (
              <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>{backendHealth.message}</span>
                </span>
                <button
                  onClick={sendEchoTest}
                  className="px-2.5 py-1 rounded bg-[#6b21a8]/40 hover:bg-[#6b21a8] text-[11px] font-semibold text-white border border-[#a855f7]/40 transition-colors w-fit"
                >
                  Send Bidirectional Echo Test
                </button>
              </div>
            )}

            {/* Echo Test Result Feedback */}
            {echoResponse && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#0a0a0f] border border-[#232338] text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold">✓ Echo Reply: </span>
                {echoResponse.reply}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            THE 4 PILLARS (Glassmorphic Feature Cards with Glow)
            ============================================================ */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Everything Your Legacy Requires
            </h2>
            <p className="text-sm text-slate-400">
              6 dedicated modules engineered for security, empathy, and absolute confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Digital Will */}
            <Link to="/dashboard" className="glass-card-interactive rounded-2xl p-6 group block">
              <div className="w-12 h-12 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Digital Will Builder
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Allocate crypto keys, financial accounts, social profiles, and physical heirlooms to designated beneficiaries.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#a855f7]">
                <span>Build Will</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Future Letters */}
            <Link to="/dashboard" className="glass-card-interactive rounded-2xl p-6 group block">
              <div className="w-12 h-12 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Future Scheduled Letters
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Write heartfelt letters to children, partners, or friends scheduled for milestone birthdays, weddings, or milestones.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#a855f7]">
                <span>Write Letters</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Memory Capsule & Vault */}
            <Link to="/vault" className="glass-card-interactive rounded-2xl p-6 group block">
              <div className="w-12 h-12 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Key className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Secret Vault & Capsule
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Store master passwords, seed phrases, deeds, audio recordings, and family photo archives in zero-knowledge storage.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#a855f7]">
                <span>Open Vault</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: AI Personality Snapshot */}
            <Link to="/ai-snapshot" className="glass-card-interactive rounded-2xl p-6 group block">
              <div className="w-12 h-12 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-[#a855f7]" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                AI Personality Snapshot
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Gemini 2.5 Flash on the backend to synthesize your tone, advice, principles, and humor for your heirs.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#a855f7]">
                <span>View Snapshot</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>

        {/* ============================================================
            SECURITY & CONFIDENTIALITY BANNER
            ============================================================ */}
        <div className="glass-card rounded-2xl p-8 border border-[#232338] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a855f7] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Dead Man Switch Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Your data remains locked until verified release conditions are met.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configured with verification ping protocols, designated trusted executors, and MongoDB Atlas encrypted at-rest storage.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/auth"
              className="px-6 py-3 rounded-xl btn-primary text-sm font-semibold inline-flex items-center gap-2"
            >
              <span>Create Your Legacy Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
