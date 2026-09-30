/**
 * ============================================================
 * Auth Middleware (backend/middleware/auth.js)
 * ============================================================
 * Purpose: Protects private routes from unauthorized access.
 *
 * Workflow:
 * 1. Checks incoming request for 'Authorization' header.
 * 2. Parses 'Bearer <JWT_TOKEN>'.
 * 3. Verifies token authenticity using process.env.JWT_SECRET.
 * 4. Loads user record from MongoDB (excluding password hash).
 * 5. Attaches sanitized user object to `req.user`.
 * 6. Rejects invalid, missing, or expired tokens with HTTP 401.
 * ============================================================
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and begins with 'Bearer '
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract token string (split 'Bearer' from '<token>')
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token signature with JWT_SECRET
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'legacy_guardian_ultra_secure_jwt_secret_key_2026_xyz987'
      );

      // 4. Retrieve user record from database, excluding password field
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists',
        });
      }

      // 5. Attach user object to request for downstream controllers
      req.user = user;
      return next();
    } catch (error) {
      console.error('🔒 [Auth Middleware Error]:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or corrupted token',
      });
    }
  }

  // If no token was provided in header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided in Authorization header',
    });
  }
};

module.exports = { protect };
