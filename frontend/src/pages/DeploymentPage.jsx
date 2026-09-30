/**
 * ============================================================
 * Deployment Guide & Checklist Page (DeploymentPage.jsx)
 * ============================================================
 * Features:
 * - Step-by-step production hosting architecture
 * - Vercel (Frontend) settings
 * - Render (Backend) settings
 * - MongoDB Atlas cluster connection guide
 * - Environment variable verification matrix
 * ============================================================
 */

import React from 'react';
import { CloudUpload, Server, Database, Sparkles, CheckCircle2, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

const DeploymentPage = () => {
  const envVars = [
    { name: 'PORT', target: 'Backend', desc: 'Port number (Render sets this dynamically, default 5000)' },
    { name: 'NODE_ENV', target: 'Backend', desc: 'Set to "production" in live environments' },
    { name: 'CLIENT_URL', target: 'Backend', desc: 'Frontend production domain (e.g. https://your-app.vercel.app)' },
    { name: 'MONGODB_URI', target: 'Backend', desc: 'MongoDB Atlas connection string with username & password' },
    { name: 'JWT_SECRET', target: 'Backend', desc: 'High-entropy secret key for auth tokens' },
    { name: 'GEMINI_API_KEY', target: 'Backend', desc: 'Google AI Studio key for gemini-2.5-flash backend processing' },
    { name: 'VITE_API_BASE_URL', target: 'Frontend', desc: 'Render backend public URL (e.g. https://your-api.onrender.com)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[300px] bg-[#6b21a8]/15 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <CloudUpload className="w-3.5 h-3.5" />
          <span>Production Infrastructure</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Deployment & Hosting Blueprint
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete guide to deploying AI Digital Legacy Manager to Vercel, Render, and MongoDB Atlas.
        </p>
      </div>

      {/* 3-Pillar Hosting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Frontend on Vercel */}
        <div className="glass-card rounded-2xl p-6 border border-[#232338] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
            <CloudUpload className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">1. Frontend on Vercel</h3>
            <span className="text-[10px] text-purple-300 font-mono">React v18 + Vite + Tailwind</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Root Directory: <code className="text-purple-300">frontend</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Build Command: <code className="text-purple-300">npm run build</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Output Directory: <code className="text-purple-300">dist</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Env Var: <code className="text-purple-300">VITE_API_BASE_URL</code></span>
            </li>
          </ul>
        </div>

        {/* Card 2: Backend on Render */}
        <div className="glass-card rounded-2xl p-6 border border-[#232338] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
            <Server className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">2. Backend on Render</h3>
            <span className="text-[10px] text-purple-300 font-mono">Node.js Web Service</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Root Directory: <code className="text-purple-300">backend</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Build Command: <code className="text-purple-300">npm install</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Start Command: <code className="text-purple-300">node server.js</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Health Check Path: <code className="text-purple-300">/api/test/health</code></span>
            </li>
          </ul>
        </div>

        {/* Card 3: Database on MongoDB Atlas */}
        <div className="glass-card rounded-2xl p-6 border border-[#232338] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
            <Database className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">3. Database on MongoDB Atlas</h3>
            <span className="text-[10px] text-purple-300 font-mono">Cloud Serverless Cluster</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Database: <code className="text-purple-300">digital_legacy_db</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Network Access IP: <code className="text-purple-300">0.0.0.0/0</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Driver: Node.js 5.5 or later</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Encryption at Rest enabled by default</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Environment Variables Reference Table */}
      <div className="glass-card rounded-2xl p-6 border border-[#232338]">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#a855f7]" />
          <span>Production Environment Variables Checklist</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232338] text-slate-400">
                <th className="pb-3 font-semibold">Variable Name</th>
                <th className="pb-3 font-semibold">Host Target</th>
                <th className="pb-3 font-semibold">Description & Security Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232338]/60 text-slate-300 font-mono">
              {envVars.map((v) => (
                <tr key={v.name}>
                  <td className="py-2.5 font-bold text-[#a855f7]">{v.name}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${
                      v.target === 'Backend' ? 'bg-purple-950/60 text-purple-300' : 'bg-blue-950/60 text-blue-300'
                    }`}>
                      {v.target}
                    </span>
                  </td>
                  <td className="py-2.5 font-sans text-slate-400">{v.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeploymentPage;
