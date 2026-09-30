/**
 * ============================================================
 * Login Page (frontend/src/pages/Login.jsx)
 * ============================================================
 * Features:
 * - User authentication with Email and Password
 * - Calls backend POST /api/auth/login
 * - Stores JWT token in localStorage via useAuth()
 * - Purple glow input fields on focus
 * - Glassmorphism card for the login form
 * - Purple gradient button (btn-primary)
 * - Error messages in RED, success messages in GREEN
 * - Link to Signup page
 * - Fully mobile responsive, pure CSS animations only
 * ============================================================
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after login (or default to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    try {
      // Send POST request to backend /api/auth/login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // Store JWT token and user profile in localStorage via AuthContext
      login(data.token, data.user);

      // Green success message
      setSuccessMessage('Authentication successful! Decrypting vault session...');

      // Redirect to target or dashboard
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      // Red error message
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Background Deep Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6b21a8]/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 mb-3 shadow-glow-sm">
            <KeyRound className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Unlock Your Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your credentials to access your protected digital legacy.
          </p>
        </div>

        {/* Glassmorphic Login Box */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338]">
          
          {/* Red Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Green Success Message Banner */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Master Passphrase
                </label>
                <span className="text-[10px] text-purple-400 hover:text-purple-300 cursor-pointer">
                  Encrypted Session
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  disabled={loading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-10 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2 mt-4 shadow-glow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In & Access Vault'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Link to Signup */}
          <div className="mt-6 pt-4 border-t border-[#232338] text-center">
            <p className="text-xs text-slate-400">
              Don't have a digital legacy account yet?{' '}
              <Link
                to="/signup"
                className="text-[#a855f7] hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="text-center mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected with JWT tokens & TLS encrypted communication</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
