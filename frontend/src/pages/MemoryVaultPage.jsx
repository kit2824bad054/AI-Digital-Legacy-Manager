/**
 * ============================================================
 * Memory Capsule + Secret Vault (MemoryVaultPage.jsx)
 * ============================================================
 * Features:
 * - Confidential Storage for high-security credentials & memories
 * - Zero-knowledge encryption visual indicators
 * - Secret credentials organizer (Seed phrases, passwords, documents)
 * - Multimedia memory archive (letters, audio clips, voice notes)
 * ============================================================
 */

import React, { useState } from 'react';
import { 
  Key, 
  Archive, 
  Lock, 
  Eye, 
  EyeOff, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  FileLock2, 
  Image as ImageIcon,
  Mic
} from 'lucide-react';

const MemoryVaultPage = () => {
  const [activeCategory, setActiveCategory] = useState('vault'); // 'vault' | 'memories'
  const [revealedIds, setRevealedIds] = useState({});

  const toggleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sampleVaultItems = [
    {
      id: 'item-1',
      title: 'Ethereum Hardware Wallet (Ledger Nano X)',
      category: 'Crypto Keys',
      secret: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon art',
      hint: 'Stored in physical safe box #4B',
      updated: '1 month ago',
    },
    {
      id: 'item-2',
      title: 'Primary Master Password Manager (Bitwarden)',
      category: 'Master Passwords',
      secret: 'K9#vL$99!wX@legacy_passphrase_2026',
      hint: 'Unlocks all family banking and streaming accounts',
      updated: '3 weeks ago',
    },
    {
      id: 'item-3',
      title: 'Home Deed & Safe Deposit Combination',
      category: 'Legal Documents',
      secret: 'Dial: 34 Right - 12 Left - 88 Right',
      hint: 'Safe located in study room behind bookshelf',
      updated: '6 months ago',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-[450px] h-[350px] bg-[#7c3aed]/15 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted Vault</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Memory Capsule & Secret Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Guarded with high-grade encryption. Stored safely until posthumous unlock triggers occur.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCategory('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'vault'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Secret Vault</span>
          </button>
          <button
            onClick={() => setActiveCategory('memories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeCategory === 'memories'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Memory Capsule</span>
          </button>
        </div>
      </div>

      {/* Security Status Card */}
      <div className="glass-card rounded-xl p-4 border border-[#232338] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#a855f7]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              Vault Status: Armed & Sealed
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                AES-256 Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Only your private key and trusted executor authentication can decrypt these entries.
            </p>
          </div>
        </div>

        <button className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2 w-fit">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Encrypted Secret</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeCategory === 'vault' ? (
        <div className="space-y-4">
          {sampleVaultItems.map((item) => {
            const isRevealed = Boolean(revealedIds[item.id]);
            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 border border-[#232338] hover:border-[#a855f7]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <FileLock2 className="w-4 h-4 text-[#a855f7]" />
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#13131f] border border-[#232338] text-slate-400">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Updated: {item.updated}</span>
                </div>

                <div className="bg-[#0a0a0f] rounded-xl p-3 border border-[#232338] flex items-center justify-between gap-4">
                  <div className="font-mono text-xs text-slate-300 truncate">
                    {isRevealed ? item.secret : '••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 font-medium px-2 py-1 rounded bg-[#13131f] border border-[#232338] flex-shrink-0"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 mt-2 italic">
                  Note to heirs: {item.hint}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Memory Capsule Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-[#232338] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mx-auto text-[#a855f7]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Family Photo Albums</h3>
            <p className="text-xs text-slate-400">
              High-resolution photo galleries curated with stories behind each capture.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-purple-300 font-semibold">120 Photos Preserved</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-[#232338] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mx-auto text-[#a855f7]">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Audio & Voice Mementos</h3>
            <p className="text-xs text-slate-400">
              Personal audio notes, favorite songs, bedtime stories recorded for children.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-purple-300 font-semibold">8 Audio Notes Recorded</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-[#232338] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center mx-auto text-[#a855f7]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Life Philosophy & Recipes</h3>
            <p className="text-xs text-slate-400">
              Grandmother's secret sourdough recipe, favorite books, and core life principles.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-purple-300 font-semibold">14 Wisdom Entries</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryVaultPage;
