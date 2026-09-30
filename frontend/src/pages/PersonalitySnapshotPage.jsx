/**
 * ============================================================
 * AI Personality Snapshot (PersonalitySnapshotPage.jsx)
 * ============================================================
 * Features:
 * - Powered exclusively by Google Gemini 2.5 Flash on the backend
 * - Structured JSON output mode architecture demonstration
 * - Synthesizes personality traits, vocabulary, life lessons, and voice tone
 * - Live interactive preview of conversational legacy avatar
 * ============================================================
 */

import React, { useState } from 'react';
import { Sparkles, Cpu, MessageSquare, Compass, ShieldCheck, Zap, Bot } from 'lucide-react';

const PersonalitySnapshotPage = () => {
  const [testPrompt, setTestPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'avatar',
      text: "Hello! I am your AI Legacy Avatar synthesized by Gemini 2.5 Flash. Once trained on your journal entries and letters, I will speak with your warmth, wisdom, and distinct perspective.",
    },
  ]);

  const handleSimulateChat = (e) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;

    const userMessage = { role: 'user', text: testPrompt };
    const simulatedReply = {
      role: 'avatar',
      text: `[Gemini Backend Simulation]: Reflecting on "${testPrompt}" using your captured philosophical traits. Remember to always prioritize peace over being right, and never forget the summer trips we took together.`,
    };

    setChatHistory([...chatHistory, userMessage, simulatedReply]);
    setTestPrompt('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Glow */}
      <div className="absolute top-10 right-10 w-[500px] h-[350px] bg-[#6b21a8]/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash Engine (Backend-Only Integration)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Personality Snapshot
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Preserve your voice, ethics, cadence, and advice through structured JSON Gemini synthesis.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center gap-2.5 text-xs font-bold text-white mb-1">
            <Cpu className="w-4 h-4 text-[#a855f7]" />
            <span>gemini-2.5-flash Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ultra-fast multi-modal analysis processing voice recordings, letters, and questions into structured cognitive profiles.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center gap-2.5 text-xs font-bold text-white mb-1">
            <Zap className="w-4 h-4 text-[#a855f7]" />
            <span>Structured JSON Mode</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Backend schema enforces deterministic JSON responses for personality metrics, traits, and memory retrieval.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-[#232338]">
          <div className="flex items-center gap-2.5 text-xs font-bold text-white mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Privacy Barrier</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            API keys live exclusively in backend <code className="text-purple-300">.env</code>. The client never communicates directly with Google servers.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Personality Metrics (Left: 5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-[#232338] space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#a855f7]" />
            <span>Extracted Personality Blueprint</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Empathetic Warmth</span>
                <span className="font-mono text-purple-400">92%</span>
              </div>
              <div className="w-full bg-[#0a0a0f] rounded-full h-2 border border-[#232338]">
                <div className="bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] h-2 rounded-full w-[92%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Dry Wit & Gentle Humor</span>
                <span className="font-mono text-purple-400">78%</span>
              </div>
              <div className="w-full bg-[#0a0a0f] rounded-full h-2 border border-[#232338]">
                <div className="bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] h-2 rounded-full w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Pragmatic Financial Advice</span>
                <span className="font-mono text-purple-400">85%</span>
              </div>
              <div className="w-full bg-[#0a0a0f] rounded-full h-2 border border-[#232338]">
                <div className="bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] h-2 rounded-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Philosophical Resilience</span>
                <span className="font-mono text-purple-400">88%</span>
              </div>
              <div className="w-full bg-[#0a0a0f] rounded-full h-2 border border-[#232338]">
                <div className="bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] h-2 rounded-full w-[88%]" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#232338]">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Core Life Mantras Identified:</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
              <li>"Leave every room slightly kinder than you found it."</li>
              <li>"Patience and compounding are the only true superpowers."</li>
              <li>"Always save the old letters."</li>
            </ul>
          </div>
        </div>

        {/* Interactive Chat Simulator (Right: 7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-[#232338] flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#232338] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#a855f7]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Avatar Voice Simulator</h4>
                <p className="text-[10px] text-slate-400">Interactive preview of future heir conversation</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-purple-300 font-mono">
              Ready for Phase 5
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm'
                      : 'bg-[#0a0a0f] border border-[#232338] text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSimulateChat} className="flex gap-2">
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Ask your future legacy avatar for life advice..."
              className="flex-1 bg-[#0a0a0f] border border-[#232338] focus:border-[#a855f7] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PersonalitySnapshotPage;
