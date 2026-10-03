/**
 * ============================================================
 * Dashboard Layout Component (frontend/src/pages/Dashboard.jsx)
 * ============================================================
 * Phase 3 — Part A
 *
 * Features:
 * - Left sidebar navigation:
 *   - 🏠 Home ("/")
 *   - 📝 Digital Will ("will" view)
 *   - 💌 Future Letters ("letters" view)
 *   - 🖼️ Memory Capsule ("/vault")
 *   - 🔐 Secret Vault ("/vault")
 *   - 🤖 AI Personality ("/ai-snapshot")
 *   - 🚪 Logout (clears session and redirects to /login)
 * - Top navbar with user avatar, name, and live status badge
 * - Main content area dynamically renders DigitalWill or FutureLetters
 * - Sidebar collapses smoothly on mobile devices with toggle button
 * - Active tab highlighted in vibrant purple with pure CSS transitions
 * - Dark & Mysterious theme (#0a0a0f background, #13131f sidebar)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sub-components
import DigitalWill from './DigitalWill';
import FutureLetters from './FutureLetters';

// Icons
import {
  Home,
  FileText,
  Mail,
  Image as ImageIcon,
  KeyRound,
  Bot,
  LogOut,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronRight,
  User as UserIcon,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view: 'will' (default) or 'letters'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'letters' ? 'letters' : 'will');

  // Mobile sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state with URL search param
  useEffect(() => {
    if (tabParam === 'letters' || tabParam === 'will') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSidebarOpen(false); // Close mobile drawer on selection
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DL';

  // Navigation Items Specification
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isExternal: true,
      path: '/',
    },
    {
      id: 'will',
      label: 'Digital Will',
      icon: FileText,
      isExternal: false,
    },
    {
      id: 'letters',
      label: 'Future Letters',
      icon: Mail,
      isExternal: false,
    },
    {
      id: 'capsule',
      label: 'Memory Capsule',
      icon: ImageIcon,
      isExternal: true,
      path: '/vault?tab=memories',
    },
    {
      id: 'vault',
      label: 'Secret Vault',
      icon: KeyRound,
      isExternal: true,
      path: '/vault?tab=vault',
    },
    {
      id: 'ai',
      label: 'AI Personality',
      icon: Bot,
      isExternal: true,
      path: '/ai-snapshot',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col md:flex-row relative">
      
      {/* ============================================================
          1. LEFT SIDEBAR NAVIGATION
          ============================================================ */}
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-20 left-0 z-40 h-screen md:h-[calc(100vh-5rem)] w-72 bg-[#13131f] border-r border-[#232338] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#232338]">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] p-[1px] shadow-glow-sm">
                <div className="w-full h-full bg-[#13131f] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#a855f7] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight flex items-center gap-1">
                  Legacy <span className="text-[#a855f7]">Vault</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                  Phase 3 Dashboard
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#0a0a0f] border border-[#232338]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Legacy Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isExternal && activeTab === item.id;

            if (item.isExternal) {
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#a855f7] transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => switchTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#a855f7]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-glow-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: User Card & Logout Button */}
        <div className="p-4 border-t border-[#232338] bg-[#0e0e17] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6b21a8] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white shadow-glow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">
                {user?.name || 'Vault Guardian'}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || 'guardian@vault.local'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Lock Vault</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          2. MAIN CONTENT AREA WITH TOP NAVBAR
          ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 md:top-20 z-30 h-16 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#232338] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Current Active Section Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Dashboard</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs font-semibold text-white px-2.5 py-1 rounded-lg bg-[#13131f] border border-[#232338]">
                {activeTab === 'will' ? '📝 Digital Will' : '💌 Future Letters'}
              </span>
            </div>
          </div>

          {/* Right Section: User Pill & Quick Nav */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13131f] border border-[#232338] text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Vault Online</span>
            </div>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6b21a8] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white shadow-glow-sm">
                {initials}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:block">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Tab Switcher Pills (Top of Content) */}
        <div className="px-4 sm:px-8 pt-6">
          <div className="flex flex-col sm:inline-flex sm:flex-row p-1 bg-[#13131f] border border-[#232338] rounded-2xl shadow-inner w-full sm:w-auto gap-1">
            <button
              type="button"
              onClick={() => switchTab('will')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'will'
                  ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Digital Will Builder</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab('letters')}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'letters'
                  ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Future Scheduled Letters</span>
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full">
          {activeTab === 'will' ? <DigitalWill /> : <FutureLetters />}
        </main>

      </div>

    </div>
  );
};

export default Dashboard;
