/**
 * ============================================================
 * Vault Model (backend/models/Vault.js)
 * ============================================================
 * Phase 4 — Part B: Secret Vault
 *
 * Purpose:
 * Stores high-security encrypted secrets (master passwords, bank credentials,
 * recovery keys, legal codes, and private messages for trusted individuals).
 *
 * Fields:
 * - userId: References the authenticated User author
 * - type: Category ('Password' | 'Bank Details' | 'Important Document' | 'Personal Message' | 'Other')
 * - title: Descriptive label (e.g. "Primary Swiss Bank Account")
 * - content: AES-256 encrypted payload stored in database
 * - contentHash: Bcrypt cryptographic hash for integrity validation
 * - trustedPerson: Name of beneficiary / trusted person designated to receive this
 * - createdAt, updatedAt: Timestamps
 * ============================================================
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Encryption constants
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto
  .createHash('sha256')
  .update(String(process.env.JWT_SECRET || 'legacy_guardian_ultra_secure_jwt_secret_key_2026_xyz987'))
  .digest(); // Exactly 32 bytes for AES-256

const vaultSchema = new mongoose.Schema(
  {
    // The user who owns this secret
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A valid userId is required for a vault entry'],
      index: true,
    },
    // Type of secret
    type: {
      type: String,
      required: [true, 'Please select a vault secret category'],
      enum: [
        'Password',
        'Bank Details',
        'Important Document',
        'Personal Message',
        'Other',
      ],
      default: 'Password',
    },
    // Title or label
    title: {
      type: String,
      required: [true, 'Please provide a title for this secret'],
      trim: true,
    },
    // The secret content (stored encrypted in MongoDB)
    content: {
      type: String,
      required: [true, 'Secret content cannot be empty'],
    },
    // Bcrypt hash of the content before saving
    contentHash: {
      type: String,
    },
    // Name of the trusted person designated for access
    trustedPerson: {
      type: String,
      required: [true, 'Please specify the name of the trusted person'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save Hook:
 * Encrypts content with AES-256 and computes bcrypt hash before writing to MongoDB.
 */
vaultSchema.pre('save', async function (next) {
  // If content is not modified, skip encryption
  if (!this.isModified('content')) {
    return next();
  }

  try {
    // 1. Generate bcrypt hash of the raw content
    const salt = await bcrypt.genSalt(10);
    this.contentHash = await bcrypt.hash(this.content, salt);

    // 2. Encrypt content using AES-256-CBC with an initialization vector (IV)
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    let encrypted = cipher.update(this.content, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Store in format: iv:encryptedHex
    this.content = `${iv.toString('hex')}:${encrypted}`;

    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Method: decryptContent
 * Decrypts AES-256 ciphertext back to readable string for authorized user
 */
vaultSchema.methods.decryptContent = function () {
  try {
    if (!this.content || !this.content.includes(':')) {
      return this.content;
    }
    const [ivHex, encryptedHex] = this.content.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    return '[Decryption Error: Key mismatch or corrupted data]';
  }
};

module.exports = mongoose.model('Vault', vaultSchema);
