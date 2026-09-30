/**
 * ============================================================
 * Navbar Component (frontend/src/components/Navbar.jsx)
 * ============================================================
 * Features:
 * - Glassmorphism frosted header with subtle purple border
 * - Navigation links for all core application routes
 * - Responsive mobile menu with pure CSS transitions
 * - Dynamic Auth state:
 *   - If logged in: Displays user's name pill + glowing Logout button
 *   - If logged out: Displays Login and Get Started buttons
 * ============================================================
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Menu, 
  X, 
  Sparkles, 
  Key, 
  FileText, 
  Layers, 
  CloudUpload,
  UserCheck,
  LogOut,
  User
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation items mapping across application routes
  const navItems = [
    { label: 'Home', path: '/', icon: Sparkles },
    { label: 'Dashboard & Will', path: '/dashboard', icon: FileText },
    { label: 'Memory & Vault', path: '/vault', icon: Key },
    { label: 'AI Snapshot', path: '/ai-snapshot', icon: Layers },
    { label: 'Deployment', path: '/deployment', icon: CloudUpload },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-[#232338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] p-[1px] shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
              <div className="w-full h-full bg-[#13131f] rounded-[11px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#a855f7] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Legacy <span className="text-[#a855f7]">Guardian</span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Encrypted Vault & Will
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#13131f]/70 border border-[#232338] px-3 py-1.5 rounded-full shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Auth Buttons (Login/Signup OR User Profile/Logout) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Info Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13131f] border border-[#232338]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#6b21a8] to-[#a855f7] flex items-center justify-center text-[11px] font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {user?.name || 'Vault User'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 transition-all cursor-pointer"
                  title="Logout and clear token"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/40 transition-all duration-200"
                >
                  <UserCheck className="w-4 h-4 text-[#a855f7]" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl btn-primary transition-all duration-200 shadow-glow-sm"
                >
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#232338] bg-[#0a0a0f]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                    : 'text-slate-300 hover:bg-[#13131f]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#a855f7]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-[#232338] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-xs text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#a855f7]" />
                  <span>Logged in as <strong>{user?.name}</strong></span>
                </div>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-[#13131f] border border-[#232338] text-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
