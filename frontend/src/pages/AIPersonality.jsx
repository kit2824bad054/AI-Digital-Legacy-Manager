/**
 * ============================================================
 * AI Personality Snapshot (frontend/src/pages/AIPersonality.jsx)
 * ============================================================
 * Phase 5 — Part A: AI Personality Snapshot
 *
 * Features:
 * - 10 In-depth legacy reflection questions
 * - Step-by-step wizard (1 question at a time) with dynamic progress bar
 * - Large textarea with live word count for each reflection
 * - "Previous" and "Next" navigation controls
 * - Calls POST /api/personality/generate to invoke Google Gemini AI
 * - Glowing cosmic loader animation during Gemini AI synthesis
 * - Beautiful result display card:
 *   - 2-3 paragraph synthesized portrait
 *   - 5 personality trait purple badges
 *   - 3 standout strengths with icons
 *   - Grand legacy sentence in prominent typography
 *   - Meaningful philosophical quote in italics
 * - "Regenerate" button to retake or adjust reflection
 * - "Save to Vault" button saving directly to MongoDB Atlas
 * - Pre-loads saved snapshot on mount (GET /api/personality)
 * - Pure CSS animations (Zero Framer Motion)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import {
  Sparkles,
  Bot,
  Brain,
  ArrowRight,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Quote,
  Shield,
  Star,
  Award,
  Zap,
  Heart,
  Compass,
  X
} from 'lucide-react';

const QUESTIONS = [
  { id: 1, question: 'What made you happiest in life?', placeholder: 'Describe your most joyful memories, places, or moments of peace...' },
  { id: 2, question: 'What are you most proud of?', placeholder: 'Reflect on personal achievements, family, character, or obstacles overcome...' },
  { id: 3, question: 'What lesson do you want to leave behind?', placeholder: 'The most important truth or guiding philosophy you have learned...' },
  { id: 4, question: 'Who influenced your life the most?', placeholder: 'Mentors, parents, authors, or loved ones who shaped your character...' },
  { id: 5, question: 'What was your biggest dream?', placeholder: 'The aspirations, goals, or visions that fueled your spirit...' },
  { id: 6, question: 'How do you want to be remembered?', placeholder: 'In the minds and hearts of your children, friends, and community...' },
  { id: 7, question: 'What made you laugh the most?', placeholder: 'Inside jokes, family quirks, humorous situations, or carefree days...' },
  { id: 8, question: 'What was your greatest challenge?', placeholder: 'A hardship or storm that tested and strengthened your resilience...' },
  { id: 9, question: 'What advice would you give your younger self?', placeholder: 'What wisdom would you impart to yourself at age 18 or 25?...' },
  { id: 10, question: 'What does love mean to you?', placeholder: 'Your definition of true devotion, companionship, and unconditional love...' },
];

const AIPersonality = () => {
  const { token, user } = useAuth();

  // Wizard step (0 to 9)
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(''));

  // Generation & Results states
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [result, setResult] = useState(null);
  const [isSavedInDb, setIsSavedInDb] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: '', message: '' });
    }, 3000);
  };

  // 1. Check if user already has a saved personality snapshot
  useEffect(() => {
    const fetchExistingPersonality = async () => {
      setLoadingInitial(true);
      try {
        const response = await fetch(apiUrl('/api/personality'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.personality) {
          setResult(data.personality);
          setIsSavedInDb(true);
          // Pre-populate answers if available
          if (data.personality.answers && data.personality.answers.length > 0) {
            const mapped = QUESTIONS.map((q) => {
              const found = data.personality.answers.find((a) => a.question === q.question);
              return found ? found.answer : '';
            });
            setAnswers(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load existing personality:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    if (token) {
      fetchExistingPersonality();
    }
  }, [token]);

  // Answer change handler
  const handleAnswerChange = (text) => {
    const nextAnswers = [...answers];
    nextAnswers[currentStep] = text;
    setAnswers(nextAnswers);
  };

  // Next Question
  const handleNext = () => {
    if (!answers[currentStep].trim()) {
      showToast('error', 'Please share a few thoughts before moving to the next reflection.');
      return;
    }
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous Question
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 2. Generate Personality Snapshot via Gemini API
  const handleGenerate = async () => {
    if (!answers[currentStep].trim()) {
      showToast('error', 'Please provide an answer for this final question.');
      return;
    }

    setGenerating(true);

    try {
      const formattedPayload = QUESTIONS.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || '(Not answered)',
      }));

      const response = await fetch(apiUrl('/api/personality/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: formattedPayload }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gemini AI synthesis encountered an issue.');
      }

      setResult(data.personality);
      setIsSavedInDb(false);
      showToast('success', 'Personality blueprint synthesized by Gemini AI!');
    } catch (err) {
      console.error('Generate error:', err);
      showToast('error', err.message || 'Failed to synthesize personality snapshot.');
    } finally {
      setGenerating(false);
    }
  };

  // 3. Save to MongoDB Atlas
  const handleSaveToDb = async () => {
    if (!result) return;

    setSaving(true);
    try {
      const formattedAnswers = QUESTIONS.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || '',
      }));

      const response = await fetch(apiUrl('/api/personality'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          personalitySummary: result.summary || result.personalitySummary,
          traits: result.traits || [],
          strengths: result.strengths || [],
          legacy: result.legacy || '',
          quote: result.quote || '',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save to database.');
      }

      setIsSavedInDb(true);
      showToast('success', 'Personality snapshot saved permanently to MongoDB Atlas!');
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', err.message || 'Error saving to MongoDB.');
    } finally {
      setSaving(false);
    }
  };

  // Retake or Regenerate
  const handleRetake = () => {
    setResult(null);
    setCurrentStep(0);
    setIsSavedInDb(false);
  };

  // Calculate Progress Percentage
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Toast Notification (Bottom Right) */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-200'
              : 'bg-rose-950/90 border-rose-600/80 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, type: '', message: '' })}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#232338] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-[#7c3aed]/15 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6b21a8] to-[#7c3aed] text-white shadow-glow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  AI Personality Snapshot
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6b21a8]/30 border border-[#a855f7]/40 text-purple-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Reflect on 10 fundamental life questions. Google Gemini synthesizes your answers into an enduring legacy portrait for your descendants.
              </p>
            </div>
          </div>

          {result && !generating && (
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/50 text-slate-300 hover:text-white transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Retake Reflection</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Initial Data */}
      {loadingInitial ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-[#232338]">
          <div className="w-10 h-10 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Loading your legacy blueprint...</p>
        </div>
      ) : generating ? (
        /* Gemini AI Loading Animation */
        <div className="glass-card rounded-2xl p-16 sm:p-20 text-center border border-[#a855f7]/40 relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial-at-c from-[#6b21a8]/20 via-transparent to-transparent animate-pulse pointer-events-none" />
          
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-[#7c3aed]/30 border-t-[#a855f7] animate-spin" />
            <Brain className="w-8 h-8 text-[#a855f7] absolute animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Synthesizing Your Personality Matrix...
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Google Gemini is reading your 10 reflections to craft your core character traits, values, standout strengths, and posthumous legacy summary.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-purple-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing tone, memories, and philosophy...</span>
          </div>
        </div>
      ) : result ? (
        /* ============================================================
           RESULT DISPLAY CARD: BEAUTIFUL PERSONALITY PORTRAIT
           ============================================================ */
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Portrait Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#a855f7]/30 shadow-glow-md relative overflow-hidden space-y-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7c3aed]/10 blur-[100px] pointer-events-none rounded-full" />
            
            {/* Top Bar: Title & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232338]">
              <div>
                <span className="text-[10px] font-bold text-[#a855f7] uppercase tracking-widest block mb-1">
                  Synthesized Legacy Profile
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {user?.name ? `${user.name}'s Personality Blueprint` : 'Your Legacy Portrait'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#13131f] border border-[#232338] hover:border-[#a855f7]/50 text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  title="Generate a fresh variation from the same reflections"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDb}
                  disabled={saving}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-glow-sm ${
                    isSavedInDb
                      ? 'bg-emerald-950/80 border border-emerald-700/80 text-emerald-200'
                      : 'btn-primary'
                  }`}
                >
                  {isSavedInDb ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Saved in Vault</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save to MongoDB'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1. Legacy Sentence in Prominent Large Typography */}
            {result.legacy && (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#6b21a8]/25 via-[#13131f] to-[#7c3aed]/15 border border-[#a855f7]/40 relative">
                <Sparkles className="w-5 h-5 text-[#a855f7] absolute top-4 left-4" />
                <div className="pl-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300 block mb-2">
                    Enduring Legacy Statement
                  </span>
                  <p className="text-base sm:text-xl font-bold text-white leading-relaxed tracking-tight">
                    "{result.legacy}"
                  </p>
                </div>
              </div>
            )}

            {/* 2. Five Personality Traits as Purple Badges */}
            {result.traits && result.traits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Core Character Traits</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {result.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-[#6b21a8]/30 border border-[#a855f7]/40 text-xs font-bold text-purple-200 shadow-glow-sm flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                      <span>{trait}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Three Standout Strengths with Icons */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Standout Pillars & Strengths</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.strengths.map((str, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0a0a0f]/80 border border-[#232338] hover:border-[#a855f7]/40 transition-all flex items-center gap-3"
                    >
                      <div className="p-2 rounded-lg bg-[#6b21a8]/30 text-[#a855f7] flex-shrink-0">
                        {idx === 0 ? <Heart className="w-4 h-4" /> : idx === 1 ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Full Personality Summary (2-3 paragraphs) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>Philosophical Life Portrait</span>
              </h3>
              <div className="p-6 rounded-2xl bg-[#0a0a0f]/60 border border-[#232338] text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
                {result.summary || result.personalitySummary}
              </div>
            </div>

            {/* 5. Meaningful Quote in Italics */}
            {result.quote && (
              <div className="p-5 rounded-xl bg-[#13131f] border border-[#232338] flex items-start gap-3 text-slate-400">
                <Quote className="w-5 h-5 text-[#a855f7] flex-shrink-0 mt-0.5" />
                <p className="text-xs italic font-serif text-slate-300 leading-relaxed">
                  {result.quote}
                </p>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* ============================================================
           STEP-BY-STEP 10 QUESTION FORM
           ============================================================ */
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#232338] space-y-6">
          
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-300 uppercase tracking-wider">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span className="text-slate-400 font-mono">
                {answeredCount}/10 Answered • {progressPercent}% Completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#0a0a0f] border border-[#232338] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6b21a8] to-[#a855f7] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="pt-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#a855f7]">
                Reflect & Share
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {QUESTIONS[currentStep].question}
              </h2>
            </div>

            {/* Large Textarea */}
            <textarea
              rows={7}
              value={answers[currentStep]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={QUESTIONS[currentStep].placeholder}
              className="w-full bg-[#0a0a0f] border border-[#232338] text-slate-100 placeholder-slate-600 rounded-2xl p-4 sm:p-5 text-sm leading-relaxed transition-all duration-200 focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#7c3aed]/40 resize-y"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Take your time — your loved ones will cherish these exact words.</span>
              <span>{answers[currentStep].trim() ? answers[currentStep].trim().split(/\s+/).length : 0} words</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#232338] flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#13131f] border border-[#232338] text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentStep < QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 shadow-glow-sm cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-glow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Submit & Synthesize Personality</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default AIPersonality;
