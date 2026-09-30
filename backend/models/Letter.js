/**
 * ============================================================
 * Letter Model (backend/models/Letter.js)
 * ============================================================
 * Purpose:
 * Stores encrypted future scheduled letters to be delivered to
 * loved ones, family, or friends on specified future dates.
 *
 * Fields:
 * - userId: References the authenticated User author
 * - recipientName: Full name of the recipient
 * - subject: Subject / title of the letter
 * - content: Heartfelt letter content / message
 * - deliveryDate: Specific future date when letter is to be unlocked
 * - createdAt: Timestamp when letter was created
 * - updatedAt: Timestamp when letter was last edited
 * ============================================================
 */

const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema(
  {
    // The authenticated user who created this future letter
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A valid userId is required to create a letter'],
      index: true,
    },
    // The name of the recipient (e.g. "My Daughter Maya")
    recipientName: {
      type: String,
      required: [true, 'Please provide the recipient name'],
      trim: true,
    },
    // The subject line (e.g. "To open on your 18th birthday")
    subject: {
      type: String,
      required: [true, 'Please provide a subject line for the letter'],
      trim: true,
    },
    // The main letter content
    content: {
      type: String,
      required: [true, 'Please provide the letter message content'],
    },
    // The target future delivery date
    deliveryDate: {
      type: Date,
      required: [true, 'Please choose a future delivery date'],
    },
  },
  {
    // Automatically creates `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model('Letter', letterSchema);
