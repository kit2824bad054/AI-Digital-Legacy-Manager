/**
 * ============================================================
 * Login & Signup Page (AuthPage.jsx)
 * ============================================================
 * Features:
 * - Toggleable Login & Register glassmorphism card
 * - Visual aesthetic aligned with Dark & Mysterious theme
 * - Ready for Phase 2 authentication integration (bcrypt & jwt)
 * - Pure CSS animations and reactive form states
 * ============================================================
 */

import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Phase 1 Setup: Auth form submitted in [${isLogin ? 'LOGIN' : 'SIGNUP'}] mode for: ${formData.email}\n` +
      `Full backend auth with bcrypt & JWT will be wired in Phase 2.`
    );
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6b21a8]/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 mb-3 shadow-glow-sm">
            <Lock className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Vault Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin
              ? 'Access your encrypted digital will & secret memories'
              : 'Begin safeguarding your digital life for those who matter most'}
          </p>
        </div>

        {/* Auth Glass Box */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338]">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#0a0a0f] rounded-xl border border-[#232338] mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#0a0a0f] border border-[#232338] focus:border-[#a855f7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="eleanor@domain.com"
                  className="w-full bg-[#0a0a0f] border border-[#232338] focus:border-[#a855f7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0a0f] border border-[#232338] focus:border-[#a855f7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm Master Passphrase
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0a0a0f] border border-[#232338] focus:border-[#a855f7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2 mt-2 shadow-glow-sm"
            >
              <span>{isLogin ? 'Unlock Digital Vault' : 'Initialize Vault Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Security Assurance */}
          <div className="mt-6 pt-4 border-t border-[#232338] flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Zero-Knowledge client-side protection ready</span>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-purple-300 transition-colors">
            ← Return to Overview
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
