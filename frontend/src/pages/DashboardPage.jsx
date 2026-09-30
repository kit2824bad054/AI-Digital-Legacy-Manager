/**
 * ============================================================
 * Dashboard + Digital Will + Future Letters (DashboardPage.jsx)
 * ============================================================
 * Features:
 * - Central Command Hub for Digital Legacy
 * - Digital Will builder & asset allocation manager
 * - Future Letters scheduler with milestone dates
 * - Document upload pipeline preview (Multer, PDF-parse, Mammoth)
 * ============================================================
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Users, 
  Calendar, 
  Plus, 
  UploadCloud, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('will'); // 'will' | 'letters'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Glow Accent */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#6b21a8]/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Legacy Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard: Digital Will & Future Letters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your legal declarations, asset allocations, and posthumous messages.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('will')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'will'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white'
            }`}
          >
            Digital Will
          </button>
          <button
            onClick={() => setActiveTab('letters')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'letters'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white'
            }`}
          >
            Future Letters
          </button>
        </div>
      </div>

      {/* Quick Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Digital Will Status</span>
            <FileText className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <span>Draft v1.2</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
              In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Last edited 2 days ago</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Future Letters</span>
            <Send className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div className="text-lg font-bold text-white">3 Scheduled</div>
          <p className="text-[11px] text-slate-500 mt-1">2 Recipients registered</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Designated Beneficiaries</span>
            <Users className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div className="text-lg font-bold text-white">4 People</div>
          <p className="text-[11px] text-slate-500 mt-1">2 Primary, 2 Secondary</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Dead Man's Switch</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Armed (90 Days)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Next heartbeat in 28 days</p>
        </div>
      </div>

      {/* Main Tabbed Content */}
      {activeTab === 'will' ? (
        <div className="space-y-6">
          {/* Will Upload & Parser Banner */}
          <div className="glass-card rounded-2xl p-6 border border-[#232338] relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glow-badge text-[11px] font-semibold text-purple-300">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>AI Will Ingestion Pipeline (Multer + PDF-Parse + Mammoth)</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Have an existing Legal Will or Document?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload your PDF or Word document (.docx). Our backend automatically extracts asset listings,
                  executors, and conditions using Gemini 2.5 Flash structured JSON parsing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Will (.pdf / .docx)</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </label>
                <button className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4 text-[#a855f7]" />
                  <span>Create from Scratch</span>
                </button>
              </div>
            </div>
          </div>

          {/* Asset Allocation Sample Table */}
          <div className="glass-card rounded-2xl p-6 border border-[#232338]">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#a855f7]" />
              <span>Asset & Legacy Declarations</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232338] text-slate-400">
                    <th className="pb-3 font-semibold">Asset Category</th>
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Beneficiary</th>
                    <th className="pb-3 font-semibold">Allocation %</th>
                    <th className="pb-3 font-semibold text-right">Access Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232338]/60 text-slate-300">
                  <tr>
                    <td className="py-3 font-semibold text-white">Cryptocurrency & Web3</td>
                    <td className="py-3 text-slate-400">Ledger Hardware Wallet Seed Phrase</td>
                    <td className="py-3">Maya (Daughter)</td>
                    <td className="py-3 font-mono text-purple-300">100%</td>
                    <td className="py-3 text-right text-emerald-400">Upon 18th Birthday</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-white">Cloud Media & Memories</td>
                    <td className="py-3 text-slate-400">Google Drive & iCloud Photo Archives</td>
                    <td className="py-3">Marcus (Spouse)</td>
                    <td className="py-3 font-mono text-purple-300">Shared</td>
                    <td className="py-3 text-right text-purple-400">Immediate Release</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-white">Investment Accounts</td>
                    <td className="py-3 text-slate-400">Vanguard Index Portfolio Index</td>
                    <td className="py-3">Family Trust</td>
                    <td className="py-3 font-mono text-purple-300">100%</td>
                    <td className="py-3 text-right text-emerald-400">Legal Executor Release</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Future Letters Section */
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-[#232338]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#a855f7]" />
                <span>Scheduled Future Letters</span>
              </h3>
              <button className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>Write New Letter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0f] rounded-xl p-4 border border-[#232338] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">To: Maya (On your wedding day)</span>
                  <span className="text-[11px] text-purple-300 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> Milestone Trigger
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  "If you are reading this, today is one of the most magical moments of your journey..."
                </p>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sealed with AES-256 Vault Encryption
                </div>
              </div>

              <div className="bg-[#0a0a0f] rounded-xl p-4 border border-[#232338] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">To: Marcus (Our 30th Anniversary)</span>
                  <span className="text-[11px] text-purple-300 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> Oct 14, 2035
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  "Thank you for every laughter, every quiet morning, and the life we built together..."
                </p>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sealed with AES-256 Vault Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
