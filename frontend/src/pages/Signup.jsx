/**
 * ============================================================
 * Signup Page (frontend/src/pages/Signup.jsx)
 * ============================================================
 * Features:
 * - Full user registration with Name, Email, Password, and Confirm Password
 * - Calls backend POST /api/auth/signup
 * - Stores JWT token and user info into localStorage via useAuth()
 * - Dark & mysterious glassmorphism card (#0a0a0f / #13131f)
 * - Purple glow on input focus (focus:border-[#a855f7] focus:ring-2)
 * - Red error messages & green success messages
 * - Link to Login page
 * - Strictly CSS animations only (NO Framer Motion)
 * ============================================================
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import { User, Mail, Lock, Shield, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors as user types
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // 1. Client-side field validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Master password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      // 2. Send POST request to backend /api/auth/signup
      const response = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // 3. Save JWT token & user info in localStorage + AuthContext
      login(data.token, data.user);

      // 4. Display green success message
      setSuccessMessage('Account created successfully! Initializing your secure vault...');

      // 5. Redirect to Dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Signup error:', err);
      // Red error message
      setErrorMessage(err.message || 'Network error connecting to backend API.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      {/* Background Deep Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#6b21a8]/20 blur-[140px] pointer-events-none rounded-full" />

      {/* Toast Notification (Bottom Right - Fixed) */}
      {(errorMessage || successMessage) && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
            successMessage
              ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-rose-950/90 border-rose-600/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
          }`}
        >
          {successMessage ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{successMessage || errorMessage}</span>
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 mb-3 shadow-glow-sm">
            <Shield className="w-6 h-6 text-[#a855f7]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Your Legacy Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Safeguard your digital assets, legal will, and future letters.
          </p>
        </div>

        {/* Glassmorphic Signup Box */}
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya Lin"
                  required
                  disabled={loading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

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
                  placeholder="maya@example.com"
                  required
                  disabled={loading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Master Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm Master Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  disabled={loading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2 mt-4 shadow-glow-sm disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Open Vault'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-4 border-t border-[#232338] text-center">
            <p className="text-xs text-slate-400">
              Already have an encrypted vault?{' '}
              <Link
                to="/login"
                className="text-[#a855f7] hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="text-center mt-6 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#a855f7]" />
          <span>Passphrases hashed with bcrypt salt rounds before storage</span>
        </div>

      </div>
    </div>
  );
};

export default Signup;
