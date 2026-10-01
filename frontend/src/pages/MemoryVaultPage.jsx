/**
 * ============================================================
 * Memory Capsule & Secret Vault Page (MemoryVaultPage.jsx)
 * ============================================================
 * Phase 4 — Hub Component
 *
 * Connects both Phase 4 Pillars:
 * - Part A: MemoryCapsule (Photo archives, milestones, lightbox)
 * - Part B: SecretVault (AES-256 encrypted passwords, bank credentials, & messages)
 *
 * Features:
 * - Tab switcher pills (Memory Capsule vs Secret Vault)
 * - Synchronized with URL search param `?tab=memories` | `?tab=vault`
 * - Dark & mysterious glassmorphism design system
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MemoryCapsule from './MemoryCapsule';
import SecretVault from './SecretVault';
import { ImageIcon, Lock, Sparkles, Shield } from 'lucide-react';

const MemoryVaultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'memories' ? 'memories' : 'vault';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'memories' || tab === 'vault') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#6b21a8]/15 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 4: Encrypted Legacy Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {activeTab === 'vault' ? 'Confidential Secret Vault' : 'Precious Memory Capsule'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'vault'
              ? 'Zero-knowledge AES-256 encrypted credentials and private beneficiary access.'
              : 'Enduring photographs and sentimental stories for your loved ones.'}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="inline-flex p-1 bg-[#13131f] border border-[#232338] rounded-2xl shadow-inner self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('vault')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Secret Vault</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('memories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Memory Capsule</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'vault' ? <SecretVault /> : <MemoryCapsule />}
    </div>
  );
};

export default MemoryVaultPage;
