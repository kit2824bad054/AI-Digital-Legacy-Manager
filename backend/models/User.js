/**
 * ============================================================
 * User Model (backend/models/User.js)
 * ============================================================
 * Technology: Mongoose (MongoDB Atlas) & bcryptjs
 *
 * Requirements:
 * - name: string (required)
 * - email: string (required, unique, lowercased)
 * - password: string (required, minimum 6 characters, hashed before save)
 * - createdAt: date (auto timestamp)
 *
 * Security:
 * - Passwords are NEVER stored in plain text.
 * - Uses bcryptjs with a cost factor (salt rounds) of 10.
 * - Provides a helper method `matchPassword` for login authentication.
 * ============================================================
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full legal name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a master password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Pre-save Mongoose Hook:
 * Automatically runs before saving a user document.
 * If the password field was modified (new user or password reset),
 * it generates a cryptographic salt and hashes the password.
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it was modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Method: matchPassword
 * Compares an incoming plain text password against the hashed password in MongoDB
 * @param {string} enteredPassword - The plain-text password from login form
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
