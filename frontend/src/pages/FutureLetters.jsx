/**
 * ============================================================
 * Future Letters Scheduler (frontend/src/pages/FutureLetters.jsx)
 * ============================================================
 * Phase 3 — Part C
 *
 * Features:
 * - Recipient name input field
 * - Subject input field
 * - Large textarea for emotional letter message
 * - Date picker for scheduled delivery date
 * - Save button (POST /api/letters or PUT /api/letters/:id)
 * - List of all saved letters rendered as glassmorphic cards
 * - Real-time countdown & delivery date badge
 * - Edit existing letter (pre-fills form)
 * - Delete letter with confirmation modal (DELETE /api/letters/:id)
 * - Letters sorted chronologically by delivery date
 * - Loading spinner during API requests
 * - Reactive success (emerald) & error (rose) toast alerts
 * - Pure CSS animations (Zero Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Send, 
  Calendar, 
  User, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Sparkles, 
  Heart,
  X,
  FileText
} from 'lucide-react';

const FutureLetters = () => {
  const { token } = useAuth();

  // Letters collection & loading states
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    subject: '',
    content: '',
    deliveryDate: '',
  });

  // UI state: Toasts & Modal
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, letterId: null, letterSubject: '' });
  const [deleting, setDeleting] = useState(false);

  // Toast notification helper
  const showToastMessage = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 4000);
  };

  // 1. Fetch user's letters on mount
  const fetchLetters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/letters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.letters) {
        setLetters(data.letters);
      }
    } catch (err) {
      console.error('Error fetching letters:', err);
      showToastMessage('error', 'Failed to retrieve letters from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLetters();
    }
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. Submit handler: Create or Update Letter
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.recipientName.trim() || !formData.subject.trim() || !formData.content.trim() || !formData.deliveryDate) {
      showToastMessage('error', 'Please fill in all fields (Recipient, Subject, Message, and Delivery Date).');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId ? `/api/letters/${editingId}` : '/api/letters';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to schedule letter.');
      }

      showToastMessage('success', data.message || 'Future letter saved successfully!');
      
      // Reset form
      setFormData({
        recipientName: '',
        subject: '',
        content: '',
        deliveryDate: '',
      });
      setEditingId(null);

      // Refresh list
      await fetchLetters();
    } catch (err) {
      console.error('Save letter error:', err);
      showToastMessage('error', err.message || 'Error scheduling future letter.');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Edit letter: Populate form
  const handleEditClick = (letter) => {
    setEditingId(letter._id);
    setFormData({
      recipientName: letter.recipientName,
      subject: letter.subject,
      content: letter.content,
      // Format to YYYY-MM-DD for HTML5 date input
      deliveryDate: new Date(letter.deliveryDate).toISOString().split('T')[0],
    });
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      recipientName: '',
      subject: '',
      content: '',
      deliveryDate: '',
    });
  };

  // 4. Delete letter
  const confirmDeleteLetter = async () => {
    if (!deleteModal.letterId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/letters/${deleteModal.letterId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete letter.');
      }

      showToastMessage('success', 'Future letter deleted.');
      setDeleteModal({ show: false, letterId: null, letterSubject: '' });

      // If we were editing this deleted letter, clear the form
      if (editingId === deleteModal.letterId) {
        handleCancelEdit();
      }

      // Refresh list
      await fetchLetters();
    } catch (err) {
      console.error('Delete letter error:', err);
      showToastMessage('error', err.message || 'Failed to delete letter.');
    } finally {
      setDeleting(false);
    }
  };

  // Helper for delivery status badge & days calculation
  const getDeliveryStatus = (deliveryDate) => {
    const now = new Date();
    const target = new Date(deliveryDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: 'Delivered / Ready', color: 'bg-emerald-950/60 border-emerald-800 text-emerald-300' };
    } else if (diffDays === 1) {
      return { text: 'Unlocks Tomorrow', color: 'bg-amber-950/60 border-amber-800 text-amber-300' };
    } else {
      return { text: `Unlocks in ${diffDays} days`, color: 'bg-[#6b21a8]/20 border-[#a855f7]/40 text-purple-300' };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Alert */}
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

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-[#232338] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-[#7c3aed]/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/30 text-[#a855f7]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Future Scheduled Letters
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6b21a8]/30 border border-[#a855f7]/30 text-purple-300 font-semibold">
                {letters.length} Scheduled
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Write heartfelt messages, milestone advice, or final words to be delivered on exact future dates.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card: Compose / Edit Letter */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#232338]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#a855f7]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {editingId ? 'Edit Scheduled Letter' : 'Compose New Future Letter'}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Recipient Name / Relationship
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="e.g. My Son Lucas / Best Friend Sarah"
                  required
                  disabled={submitting}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

            {/* Scheduled Delivery Date */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Delivery / Unlock Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={submitting}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>
            </div>

          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Letter Subject / Milestone Occasion
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. For your 21st birthday, or when you start your first business"
              required
              disabled={submitting}
              className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
            />
          </div>

          {/* Letter Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Letter Message
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              rows={6}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your words of wisdom, memories, personal jokes, love, or encouragement here..."
              required
              disabled={submitting}
              className="w-full bg-[#0a0a0f] border border-[#232338] text-slate-100 placeholder-slate-600 rounded-xl p-4 text-xs leading-relaxed font-sans transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 resize-y"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-glow-sm disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Encrypting & Saving...' : editingId ? 'Update Scheduled Letter' : 'Schedule Future Letter'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Letters List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Scheduled Vault Archive</span>
            <span className="text-xs text-slate-400 font-normal">
              (Sorted by earliest delivery date)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#232338]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] flex items-center justify-center animate-spin mx-auto mb-3">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-slate-400">Loading your scheduled future letters...</p>
          </div>
        ) : letters.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-[#232338] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/20 border border-[#a855f7]/30 flex items-center justify-center mx-auto text-[#a855f7]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No letters scheduled yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Write your first future letter above to leave words of wisdom, milestone messages, and guidance for your loved ones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letter) => {
              const status = getDeliveryStatus(letter.deliveryDate);
              const formattedDate = new Date(letter.deliveryDate).toLocaleDateString([], {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={letter._id}
                  className="glass-card rounded-2xl p-5 border border-[#232338] hover:border-[#a855f7]/40 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  <div>
                    {/* Top Row: Recipient & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#6b21a8]/30 border border-[#a855f7]/40 flex items-center justify-center text-xs font-bold text-[#a855f7]">
                          {letter.recipientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recipient</span>
                          <h3 className="text-xs font-bold text-white">{letter.recipientName}</h3>
                        </div>
                      </div>

                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    {/* Subject */}
                    <h4 className="text-sm font-semibold text-purple-200 mt-2 mb-1.5 line-clamp-1">
                      {letter.subject}
                    </h4>

                    {/* Preview of message */}
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans bg-[#0a0a0f]/60 p-3 rounded-xl border border-[#232338]/60">
                      "{letter.content}"
                    </p>
                  </div>

                  {/* Bottom Row: Delivery Date + Actions */}
                  <div className="pt-3 border-t border-[#232338] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#a855f7]" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(letter)}
                        className="p-1.5 rounded-lg bg-[#13131f] hover:bg-[#6b21a8]/40 border border-[#232338] hover:border-[#a855f7]/40 text-slate-300 hover:text-white transition-all"
                        title="Edit letter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            show: true,
                            letterId: letter._id,
                            letterSubject: letter.subject,
                          })
                        }
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 text-rose-300 hover:text-white transition-all"
                        title="Delete letter"
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
                <h3 className="text-base font-bold text-white">Delete Scheduled Letter?</h3>
                <p className="text-xs text-slate-400">This action cannot be reversed.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete the letter <strong className="text-white">"{deleteModal.letterSubject}"</strong>? It will no longer be stored or scheduled for delivery.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, letterId: null, letterSubject: '' })}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0a0a0f] border border-[#232338] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteLetter}
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

export default FutureLetters;
