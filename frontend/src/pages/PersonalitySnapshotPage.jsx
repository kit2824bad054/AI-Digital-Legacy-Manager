/**
 * ============================================================
 * AI Personality Snapshot Page (PersonalitySnapshotPage.jsx)
 * ============================================================
 * Phase 5 — Part A
 *
 * Integrates the complete 10-question legacy reflection wizard,
 * Google Gemini AI synthesis pipeline, and structured result portrait.
 * ============================================================
 */

import React from 'react';
import AIPersonality from './AIPersonality';

const PersonalitySnapshotPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative animate-fade-in">
      <AIPersonality />
    </div>
  );
};

export default PersonalitySnapshotPage;
