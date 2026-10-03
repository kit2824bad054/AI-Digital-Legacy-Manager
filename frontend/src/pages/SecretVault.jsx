/**
 * ============================================================
 * Secret Vault Component (frontend/src/pages/SecretVault.jsx)
 * ============================================================
 * Phase 4 — Part B: Secret Vault
 *
 * Features:
 * - Type selector dropdown (Password, Bank Details, Important Document, Personal Message, Other)
 * - Title input & content textarea with purple glow focus
 * - Trusted person name input
 * - Save button calling POST /api/vault (AES-256 + bcrypt encryption)
 * - List of all vault items as glassmorphic cards
 * - Dynamic category icons (KeyRound, Landmark, FileText, MessageSquareHeart, Shield)
 * - Secret content HIDDEN by default (dots/stars masked)
 * - Click "View" button to reveal content with pure CSS smooth animation
 * - Quick "Copy to Clipboard" with temporary checkmark feedback
 * - Delete secret with confirmation modal (DELETE /api/vault/:id)
 * - Toast messages for feedback & loading spinner
 * - Strictly pure CSS animations (Zero Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import {
  KeyRound,
  Landmark,
  FileText,
  MessageSquareHeart,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Lock,
  Unlock,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UserCheck,
  X,
  Sparkles
} from 'lucide-react';

const SecretVault = () => {
  const { token } = useAuth();

  // Vault secrets list & loading
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [type, setType] = useState('Password');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [trustedPerson, setTrustedPerson] = useState('');

  // Toggled visibility states for secrets: { [itemId]: boolean }
  const [revealedMap, setRevealedMap] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // UI state
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemTitle: '' });
  const [deleting, setDeleting] = useState(false);

  // Toast notification helper (auto-disappears after 3 seconds)
  const showToastMessage = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  // 1. Fetch vault items from backend on mount
  const fetchVaultItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/vault'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.items) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch vault items:', err);
      showToastMessage('error', 'Unable to retrieve vault items from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVaultItems();
    }
  }, [token]);

  // 2. Submit handler: Save new secret
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !trustedPerson.trim()) {
      showToastMessage('error', 'Please fill in Title, Secret Content, and Trusted Person.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(apiUrl('/api/vault'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          content: content.trim(),
          trustedPerson: trustedPerson.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to encrypt secret.');
      }

      showToastMessage('success', data.message || 'Secret safely encrypted and locked in vault!');

      // Reset form
      setTitle('');
      setContent('');
      setTrustedPerson('');
      setType('Password');

      // Refresh vault items
      await fetchVaultItems();
    } catch (err) {
      console.error('Save secret error:', err);
      showToastMessage('error', err.message || 'Error saving secret to vault.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle reveal for a card
  const toggleReveal = (itemId) => {
    setRevealedMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Copy secret to clipboard
  const handleCopy = (secretText, itemId) => {
    navigator.clipboard.writeText(secretText);
    setCopiedId(itemId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // 3. Delete secret
  const confirmDelete = async () => {
    if (!deleteModal.itemId) return;

    setDeleting(true);
    try {
      const response = await fetch(apiUrl(`/api/vault/${deleteModal.itemId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete secret.');
      }

      showToastMessage('success', 'Secret permanently deleted from vault.');
      setDeleteModal({ show: false, itemId: null, itemTitle: '' });
      await fetchVaultItems();
    } catch (err) {
      console.error('Delete secret error:', err);
      showToastMessage('error', err.message || 'Error deleting secret.');
    } finally {
      setDeleting(false);
    }
  };

  // Dynamic icon helper per category
  const getTypeIcon = (itemType) => {
    switch (itemType) {
      case 'Password':
        return <KeyRound className="w-4 h-4 text-amber-400" />;
      case 'Bank Details':
        return <Landmark className="w-4 h-4 text-emerald-400" />;
      case 'Important Document':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Personal Message':
        return <MessageSquareHeart className="w-4 h-4 text-rose-400" />;
      default:
        return <Shield className="w-4 h-4 text-[#a855f7]" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Alert Banner (Bottom Right - Fixed) */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-rose-950/90 border-rose-600/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
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
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-[#232338] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#7c3aed]/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/30 text-[#a855f7]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Secret Vault & Credentials
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6b21a8]/30 border border-[#a855f7]/30 text-purple-300 font-semibold">
                {items.length} Secrets Locked
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Zero-knowledge AES-256 encrypted storage for critical financial keys, passwords, and private beneficiary instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Add Secret Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338]">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#232338]">
          <KeyRound className="w-4 h-4 text-[#a855f7]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Lock New Secret in Vault
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Type Selector Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Secret Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={saving}
                className="w-full bg-[#0a0a0f] border border-[#232338] text-white rounded-xl px-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 cursor-pointer"
              >
                <option value="Password">🔑 Password & PIN</option>
                <option value="Bank Details">🏦 Bank Details & Crypto</option>
                <option value="Important Document">📄 Important Document Key</option>
                <option value="Personal Message">💌 Personal Message</option>
                <option value="Other">🛡️ Other Confidential Secret</option>
              </select>
            </div>

            {/* Trusted Person Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Designated Trusted Person
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trustedPerson}
                  onChange={(e) => setTrustedPerson(e.target.value)}
                  placeholder="e.g. Marcus Vance (Spouse) / Maya (Daughter)"
                  required
                  disabled={saving}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Secret Title / Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ledger Crypto Seed Phrase / Primary Swiss Safe Deposit PIN"
              required
              disabled={saving}
              className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
            />
          </div>

          {/* Secret Content Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Confidential Content (Encrypted with AES-256 + bcrypt)
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your seed phrase, banking codes, passwords, locker combination, or secret instructions..."
              required
              disabled={saving}
              className="w-full bg-[#0a0a0f] border border-[#232338] text-slate-100 placeholder-slate-600 rounded-xl p-3 text-xs leading-relaxed font-mono transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 resize-y"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-glow-sm disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{saving ? 'Encrypting & Storing...' : 'Save to Secret Vault'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Vault Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Encrypted Secrets Inventory</span>
            <span className="text-xs text-slate-400 font-normal">
              (Content masked by default)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#232338]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] flex items-center justify-center animate-spin mx-auto mb-3">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-slate-400">Loading your encrypted secret vault...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#232338] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/20 border border-[#a855f7]/30 flex items-center justify-center mx-auto text-[#a855f7]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">Your Secret Vault is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Store your emergency passwords, cryptocurrency keys, bank credentials, and confidential notes above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const isRevealed = Boolean(revealedMap[item._id]);
              const formattedDate = new Date(item.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item._id}
                  className="glass-card rounded-2xl p-5 border border-[#232338] hover:border-[#a855f7]/40 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  {/* Top: Category Tag + Title */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a0a0f] border border-[#232338] text-[11px] font-semibold text-slate-300">
                        {getTypeIcon(item.type)}
                        <span>{item.type}</span>
                      </div>

                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[#a855f7]" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors mt-1">
                      {item.title}
                    </h3>

                    {/* Trusted Person badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 mb-3">
                      <UserCheck className="w-3.5 h-3.5 text-[#a855f7]" />
                      <span>
                        Designated: <strong className="text-slate-200 font-medium">{item.trustedPerson}</strong>
                      </span>
                    </div>

                    {/* Masked / Revealed Secret Content Box */}
                    <div className="relative rounded-xl bg-[#0a0a0f] border border-[#232338] p-3 text-xs font-mono overflow-hidden transition-all duration-300">
                      {isRevealed ? (
                        <div className="text-purple-200 break-all select-all whitespace-pre-wrap leading-relaxed animate-pulse">
                          {item.content}
                        </div>
                      ) : (
                        <div className="text-slate-600 select-none tracking-widest text-sm py-1">
                          ••••••••••••••••••••••••••••••
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#232338] flex items-center justify-between">
                    {/* View / Hide Button */}
                    <button
                      type="button"
                      onClick={() => toggleReveal(item._id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isRevealed
                          ? 'bg-[#6b21a8]/30 border border-[#a855f7]/50 text-white'
                          : 'bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/40 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-[#a855f7]" />
                          <span>Hide Content</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-[#a855f7]" />
                          <span>View Secret</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(item.content, item._id)}
                        className="p-1.5 rounded-lg bg-[#13131f] hover:bg-[#6b21a8]/30 border border-[#232338] text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Copy Secret"
                      >
                        {copiedId === item._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            show: true,
                            itemId: item._id,
                            itemTitle: item.title,
                          })
                        }
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 text-rose-300 hover:text-white transition-all cursor-pointer"
                        title="Delete Secret"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-rose-900/60 bg-[#13131f] shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Secret?</h3>
                <p className="text-xs text-slate-400">This encrypted item will be destroyed.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteModal.itemTitle}"</strong> from your vault? It cannot be recovered.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, itemId: null, itemTitle: '' })}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0a0a0f] border border-[#232338] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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

export default SecretVault;
