/**
 * ============================================================
 * Memory Model (backend/models/Memory.js)
 * ============================================================
 * Phase 4 — Part A: Memory Capsule
 *
 * Purpose:
 * Stores precious photos, milestones, and personal captions
 * in MongoDB Atlas for the user's loved ones to cherish.
 *
 * Fields:
 * - userId: References the authenticated User author
 * - title: Title of the memory or milestone
 * - caption: Personal description or story behind the photo
 * - imageUrl: Relative or absolute path to the uploaded photo
 * - date: The date when the memory occurred
 * - createdAt: Automatic timestamp
 * ============================================================
 */

const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    // The authenticated user who created and owns this memory
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A valid userId is required to create a memory'],
      index: true,
    },
    // Descriptive title (e.g. "Family Road Trip to Yosemite")
    title: {
      type: String,
      required: [true, 'Please provide a title for this memory'],
      trim: true,
    },
    // Heartfelt caption / story
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    // The URL/path where the uploaded image is stored (/uploads/filename.ext)
    imageUrl: {
      type: String,
      required: [true, 'An image is required for a memory capsule'],
    },
    // Date when this memory occurred
    date: {
      type: Date,
      required: [true, 'Please specify the memory date'],
      default: Date.now,
    },
  },
  {
    // Automatically creates `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Memory', memorySchema);
