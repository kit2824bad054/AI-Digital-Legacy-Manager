/**
 * ============================================================
 * Footer Component
 * ============================================================
 * Features:
 * - Dark & mysterious aesthetic with subtle cosmic glow
 * - System security status indicator
 * - Quick links across all 6 core product pages
 * - Architecture badges (React 18, Vite, Node, MongoDB Atlas, Gemini Flash)
 * ============================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Heart, Terminal, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-[#232338] bg-[#0a0a0f] overflow-hidden">
      {/* Background Subtle Glow Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-[#6b21a8]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#13131f] rounded-[7px] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#a855f7]" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                AI Legacy <span className="text-[#a855f7]">Guardian</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Preserving your digital voice, legal intentions, memories, and secret vaults for the people you love.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AES-256 & MongoDB Atlas Cloud Protection</span>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#a855f7]" />
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">
                  Digital Will Builder
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">
                  Future Scheduled Letters
                </Link>
              </li>
              <li>
                <Link to="/vault" className="hover:text-purple-400 transition-colors">
                  Encrypted Memory Capsule
                </Link>
              </li>
              <li>
                <Link to="/vault" className="hover:text-purple-400 transition-colors">
                  Secret Credential Vault
                </Link>
              </li>
              <li>
                <Link to="/ai-snapshot" className="hover:text-purple-400 transition-colors">
                  Gemini Personality Snapshot
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture & Security */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#a855f7]" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-300">
                React v18 + Vite
              </span>
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-300">
                Tailwind CSS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-300">
                Node.js & Express
              </span>
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-300">
                MongoDB Atlas
              </span>
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-purple-300">
                Gemini 2.5 Flash
              </span>
              <span className="px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-300">
                Multer & PDF-Parse
              </span>
            </div>
          </div>

          {/* Column 4: Quick Deployment */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
              Deployment Status
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Built for Vercel (Frontend) & Render (Backend) with MongoDB Atlas cloud clusters.
            </p>
            <Link
              to="/deployment"
              className="inline-flex items-center gap-1.5 text-xs text-[#a855f7] hover:text-white font-semibold underline underline-offset-4"
            >
              View Deployment Checklist →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#232338] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AI Digital Legacy Manager. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
            <span>for eternal peace of mind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
