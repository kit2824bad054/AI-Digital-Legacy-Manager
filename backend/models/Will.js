/**
 * ============================================================
 * Will Model (backend/models/Will.js)
 * ============================================================
 * Purpose:
 * Stores the user's legal digital will, testament, asset
 * allocations, and personal final wishes in MongoDB Atlas.
 *
 * Fields:
 * - userId: References the authenticated User who owns this will
 * - title: Descriptive title of the will
 * - content: The full legal will content / markdown text
 * - createdAt: Timestamp of when will was first created
 * - updatedAt: Timestamp of the latest update/save
 * ============================================================
 */

const mongoose = require('mongoose');

const willSchema = new mongoose.Schema(
  {
    // Reference to the user who created this will
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A valid userId is required to create a will'],
      index: true,
    },
    // Title of the digital will document
    title: {
      type: String,
      required: [true, 'Please provide a title for your will'],
      trim: true,
      default: 'My Last Will and Testament',
    },
    // The main legal will content
    content: {
      type: String,
      required: [true, 'Please provide the content of your will'],
    },
  },
  {
    // Automatically creates `createdAt` and `updatedAt` date fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Will', willSchema);
