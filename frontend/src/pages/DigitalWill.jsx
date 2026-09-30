/**
 * ============================================================
 * Digital Will Builder (frontend/src/pages/DigitalWill.jsx)
 * ============================================================
 * Phase 3 — Part B
 *
 * Features:
 * - Title input field with purple glow on focus
 * - Large monospace/clean textarea for legal testament & asset allocation
 * - Real-time word count & character count counter
 * - Last saved timestamp display
 * - Save / Update button (calls POST /api/will or PUT /api/will/:id)
 * - Auto-loads existing will from MongoDB on mount (GET /api/will)
 * - Delete will with confirmation modal (DELETE /api/will/:id)
 * - Loading spinner during API requests
 * - Reactive success (emerald) & error (rose) toast alerts
 * - Pure CSS animations (Zero Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Save, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

const DigitalWill = () => {
  const { token } = useAuth();

  // State management
  const [willId, setWillId] = useState(null);
  const [title, setTitle] = useState('My Last Will and Testament');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Helper to show transient toast alerts
  const showToastMessage = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  // 1. Fetch user's existing will on mount
  useEffect(() => {
    const fetchWill = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/will', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.will) {
          setWillId(data.will._id);
          setTitle(data.will.title || 'My Last Will and Testament');
          setContent(data.will.content || '');
          setLastSaved(data.will.updatedAt || data.will.createdAt);
        }
      } catch (err) {
        console.error('Failed to load digital will:', err);
        showToastMessage('error', 'Could not fetch your digital will from server.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchWill();
    }
  }, [token]);

  // 2. Word and character count calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  // 3. Save or Update will in MongoDB
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!content.trim()) {
      showToastMessage('error', 'Will content cannot be empty. Please draft your testament.');
      return;
    }

    setSaving(true);
    try {
      // Use PUT if we already have a willId, otherwise POST
      const url = willId ? `/api/will/${willId}` : '/api/will';
      const method = willId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim() || 'My Last Will and Testament',
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save digital will.');
      }

      setWillId(data.will._id);
      setLastSaved(data.will.updatedAt || new Date().toISOString());
      showToastMessage('success', data.message || 'Digital will saved securely in MongoDB!');
    } catch (err) {
      console.error('Save will error:', err);
      showToastMessage('error', err.message || 'Failed to save digital will.');
    } finally {
      setSaving(false);
    }
  };

  // 4. Delete will from MongoDB
  const handleDelete = async () => {
    if (!willId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/will/${willId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete will.');
      }

      // Reset state
      setWillId(null);
      setTitle('My Last Will and Testament');
      setContent('');
      setLastSaved(null);
      setShowDeleteModal(false);
      showToastMessage('success', 'Digital will has been deleted from your vault.');
    } catch (err) {
      console.error('Delete will error:', err);
      showToastMessage('error', err.message || 'Failed to delete will.');
    } finally {
      setDeleting(false);
    }
  };

  // Insert quick template text for user convenience
  const handleInsertTemplate = () => {
    if (content.trim() && !window.confirm('Replace current text with sample legal testament template?')) {
      return;
    }
    const template = `I, [Full Legal Name], residing at [City, State/Country], declare this to be my Digital Will and Testament.\n\n1. ASSET DISTRIBUTION:\n- Financial & Bank Accounts: [Specify beneficiary or instructions]\n- Cryptocurrency & Digital Wallets: [Hardware key location, passphrase hints]\n- Cloud Storage & Personal Photos: [Designate digital guardian]\n\n2. DIGITAL EXECUTOR:\nI appoint [Guardian Name] (Email: [email@domain.com]) as my designated digital executor to carry out these instructions.\n\n3. SPECIAL INSTRUCTIONS:\n[Any personal farewell notes, charitable donations, or specific final requests.]\n\nDeclared on this day: ${new Date().toLocaleDateString()}.`;
    setContent(template);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toast.show && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium transition-all duration-300 shadow-glow-sm ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200'
              : 'bg-rose-950/80 border-rose-700/80 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast({ show: false, type: '', message: '' })}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action Card */}
      <div className="glass-card rounded-2xl p-6 border border-[#232338] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#7c3aed]/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/30 text-[#a855f7]">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Digital Will & Asset Allocations
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Draft, encrypt, and store your final testament, digital asset instructions, and executor directives.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleInsertTemplate}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/50 text-slate-300 hover:text-white transition-all flex items-center gap-2"
              title="Fill with standard legal template"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Use Template</span>
            </button>

            {willId && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Will</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-glow-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Encrypting & Saving...' : willId ? 'Update Will' : 'Save Will'}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="mt-5 pt-4 border-t border-[#232338] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <strong className="text-white font-semibold">{wordCount}</strong> words
            </span>
            <span className="text-[#232338]">•</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-white font-semibold">{charCount}</strong> characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>
              {lastSaved
                ? `Last saved: ${new Date(lastSaved).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Not saved yet (draft mode)'}
            </span>
          </div>
        </div>
      </div>

      {/* Will Drafting Editor Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338] space-y-5">
        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] flex items-center justify-center animate-spin mb-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Retrieving encrypted will from MongoDB...</p>
          </div>
        ) : (
          <>
            {/* Title Input Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Will Title / Document Header
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Last Will and Testament — Eleanor Vance"
                className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
              />
            </div>

            {/* Large Textarea for Testament Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Testament, Beneficiaries & Asset Allocations
                </label>
                <span className="text-[11px] text-slate-400">
                  Markdown & Plain Text Supported
                </span>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your legal will, distribution of crypto wallets, physical items, and final instructions here..."
                className="w-full bg-[#0a0a0f] border border-[#232338] text-slate-100 placeholder-slate-600 rounded-2xl p-4 sm:p-5 text-sm leading-relaxed font-sans transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 resize-y"
              />
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-[#13131f] border border-[#232338] flex items-start gap-3 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-[#a855f7] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 font-medium">Encrypted Storage Notice:</strong> Your will is tied strictly to your authenticated MongoDB account. Always consult with a licensed legal attorney in your jurisdiction for state-binding statutory will requirements.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-rose-900/60 bg-[#13131f] shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Will?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-white">"{title}"</strong>? Your digital asset instructions and legal testament content will be wiped from MongoDB Atlas.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0a0a0f] border border-[#232338] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DigitalWill;
