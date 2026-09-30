/**
 * ============================================================
 * Auth Routes (backend/routes/auth.js)
 * ============================================================
 * Endpoints:
 * 1. POST /api/auth/signup  -> Register new user with hashed password & return JWT
 * 2. POST /api/auth/login   -> Authenticate user, verify password with bcrypt & return JWT
 * 3. GET  /api/auth/me      -> Protected route to fetch current authenticated user profile
 *
 * Rules:
 * - Passwords are NEVER stored in plain text (hashed via bcrypt in User model).
 * - JWT is generated using process.env.JWT_SECRET.
 * - Comprehensive error handling with clear messages.
 * ============================================================
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper: Generate JSON Web Token
 * @param {string} id - The MongoDB _id of the user
 * @param {string} email - The email address
 * @returns {string} Signed JWT token string
 */
const generateToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'legacy_guardian_ultra_secure_jwt_secret_key_2026_xyz987',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password',
      });
    }

    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 3. Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // 5. Create new user in MongoDB (pre-save hook will hash the password)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // 6. Generate JWT token
    const token = generateToken(user._id, user.email);

    // 7. Return response (excluding password hash)
    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to AI Digital Legacy Manager.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ [Signup Error]:', error);

    // Handle Mongoose duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already in use',
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during user registration. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // 2. Find user by email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Intentionally generic error message to prevent account enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Verify password hash using the user instance method (bcrypt.compare)
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id, user.email);

    // 5. Send success response
    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Access granted.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ [Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login authentication. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile (token verification test)
 * @access  Private (Protected by JWT)
 */
router.get('/me', protect, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
