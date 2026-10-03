/**
 * ============================================================
 * Memory Capsule Page (frontend/src/pages/MemoryCapsule.jsx)
 * ============================================================
 * Phase 4 — Part A: Memory Capsule
 *
 * Features:
 * - Photo upload with live preview & file format check (JPG, PNG, JPEG <= 5MB)
 * - Title input & caption textarea with purple glow focus
 * - Date picker for memory milestone date
 * - Multipart FormData upload to POST /api/memories
 * - Beautiful responsive dark grid of memory cards (#0a0a0f / #13131f)
 * - Each card displays photo, title, caption, formatted date, & delete button
 * - Click photo to open full-screen lightbox modal
 * - Delete memory with custom confirmation modal (DELETE /api/memories/:id)
 * - Loading spinner during upload & retrieval
 * - Success & error toast notifications
 * - Pure CSS animations (Zero Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl, getUploadUrl } from '../config/api';
import {
  Image as ImageIcon,
  UploadCloud,
  Calendar,
  Trash2,
  Maximize2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Heart,
  Plus
} from 'lucide-react';

const MemoryCapsule = () => {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  // Memories list & loading
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // UI Modals & Toasts
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [lightboxImage, setLightboxImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, memoryId: null, memoryTitle: '' });
  const [deleting, setDeleting] = useState(false);

  // Toast helper (auto-disappears after 3 seconds)
  const showToastMessage = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  // 1. Fetch memories from backend on mount
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/memories'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.memories) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error('Failed to fetch memories:', err);
      showToastMessage('error', 'Unable to retrieve memories from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMemories();
    }
  }, [token]);

  // 2. Handle file selection & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToastMessage('error', 'Only JPG, JPEG, and PNG images are supported.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Clear file preview
  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Submit handler: Upload to backend via multipart/form-data
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      showToastMessage('error', 'Please choose a photo to upload.');
      return;
    }

    if (!title.trim()) {
      showToastMessage('error', 'Please provide a title for this memory.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', title.trim());
      formData.append('caption', caption.trim());
      formData.append('date', date);

      const response = await fetch(apiUrl('/api/memories'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload memory photo.');
      }

      showToastMessage('success', data.message || 'Memory archived successfully!');

      // Reset form
      setTitle('');
      setCaption('');
      setDate(new Date().toISOString().split('T')[0]);
      handleClearFile();

      // Refresh memories list
      await fetchMemories();
    } catch (err) {
      console.error('Upload error:', err);
      showToastMessage('error', err.message || 'Error uploading memory photo.');
    } finally {
      setUploading(false);
    }
  };

  // 4. Delete memory
  const confirmDelete = async () => {
    if (!deleteModal.memoryId) return;

    setDeleting(true);
    try {
      const response = await fetch(apiUrl(`/api/memories/${deleteModal.memoryId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete memory.');
      }

      showToastMessage('success', 'Memory photo deleted.');
      setDeleteModal({ show: false, memoryId: null, memoryTitle: '' });
      await fetchMemories();
    } catch (err) {
      console.error('Delete error:', err);
      showToastMessage('error', err.message || 'Error deleting memory.');
    } finally {
      setDeleting(false);
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
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/30 text-[#a855f7]">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Memory Capsule
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6b21a8]/30 border border-[#a855f7]/30 text-purple-300 font-semibold">
                  {memories.length} Photos Archived
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Upload and preserve lifelong photographs, family milestones, and heartfelt stories for future generations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Memory Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338]">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#232338]">
          <UploadCloud className="w-4 h-4 text-[#a855f7]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Archive a New Memory
          </h2>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Photo Upload / Preview Zone (5 Cols) */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Memory Photograph (Max 5MB • JPG, PNG)
              </label>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#a855f7]/50 group bg-[#0a0a0f] aspect-video sm:aspect-square flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#6b21a8] text-white text-xs font-semibold shadow-glow-sm hover:bg-[#7c3aed]"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="p-1.5 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-[#232338] hover:border-[#a855f7] bg-[#0a0a0f]/60 hover:bg-[#13131f]/80 p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center aspect-video sm:aspect-square group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/20 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drop photograph
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    JPG, JPEG, or PNG up to 5MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Right Column: Title, Caption, Date (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Memory Title / Milestone
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer in Santorini with Maya, 2021"
                  required
                  disabled={uploading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date Memory Occurred
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    disabled={uploading}
                    className="w-full bg-[#0a0a0f] border border-[#232338] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Caption / Personal Story
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe the story, sounds, feelings, and who was with you during this moment..."
                  disabled={uploading}
                  className="w-full bg-[#0a0a0f] border border-[#232338] text-slate-100 placeholder-slate-600 rounded-xl p-3 text-xs leading-relaxed transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 resize-y"
                />
              </div>

              {/* Upload Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-glow-sm disabled:opacity-50 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? 'Archiving Photo...' : 'Archive in Capsule'}</span>
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>

      {/* Memories Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Archived Memories</span>
            <span className="text-xs text-slate-400 font-normal">
              (Sorted chronologically by date)
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#232338]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] flex items-center justify-center animate-spin mx-auto mb-3">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-slate-400">Loading your memory capsule archive...</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#232338] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6b21a8]/20 border border-[#a855f7]/30 flex items-center justify-center mx-auto text-[#a855f7]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No photos in your memory capsule yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Preserve your first photograph and story above to ensure your loved ones remember your most joyful moments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((mem) => {
              const formattedDate = new Date(mem.date).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={mem._id}
                  className="glass-card rounded-2xl border border-[#232338] hover:border-[#a855f7]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg"
                >
                  {/* Image Container with Fullscreen trigger */}
                  <div className="relative aspect-[4/3] bg-[#0a0a0f] overflow-hidden">
                    <img
                      src={getUploadUrl(mem.imageUrl)}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setLightboxImage(mem)}
                    />
                    
                    {/* Hover Overlay with expand icon */}
                    <div 
                      onClick={() => setLightboxImage(mem)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer pointer-events-auto"
                    >
                      <div className="p-2 rounded-xl bg-black/70 border border-[#a855f7]/50 text-white flex items-center gap-1.5 text-xs font-semibold">
                        <Maximize2 className="w-4 h-4 text-[#a855f7]" />
                        <span>View Fullscreen</span>
                      </div>
                    </div>

                    {/* Date Pill Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#0a0a0f]/80 backdrop-blur-md border border-[#232338] text-[11px] font-semibold text-purple-200 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#a855f7]" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  {/* Card Content & Caption */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-200 transition-colors">
                        {mem.title}
                      </h3>
                      {mem.caption && (
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                          {mem.caption}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action: Delete Button */}
                    <div className="pt-3 border-t border-[#232338] flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Archived {new Date(mem.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            show: true,
                            memoryId: mem._id,
                            memoryTitle: mem.title,
                          })
                        }
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-700 text-rose-300 hover:text-white transition-all cursor-pointer"
                        title="Delete memory"
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

      {/* Full-Screen Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-hidden border border-[#232338] bg-[#13131f] flex flex-col cursor-default shadow-2xl relative"
          >
            {/* Modal Top Header */}
            <div className="p-4 border-b border-[#232338] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{lightboxImage.title}</h3>
                <p className="text-[11px] text-purple-300">
                  {new Date(lightboxImage.date).toLocaleDateString([], {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-[#0a0a0f] border border-[#232338] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Full Image */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#0a0a0f]">
              <img
                src={getUploadUrl(lightboxImage.imageUrl)}
                alt={lightboxImage.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-glow-sm"
              />
            </div>

            {/* Modal Caption Footer */}
            {lightboxImage.caption && (
              <div className="p-4 bg-[#13131f] border-t border-[#232338] text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                  Story & Caption:
                </span>
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-rose-900/60 bg-[#13131f] shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800">
                <Trash2 className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Memory Photo?</h3>
                <p className="text-xs text-slate-400">This photo will be removed from your vault.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-white">"{deleteModal.memoryTitle}"</strong>? The image file will be wiped from your server storage.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, memoryId: null, memoryTitle: '' })}
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

export default MemoryCapsule;
